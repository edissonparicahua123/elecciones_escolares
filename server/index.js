import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { validateParty, validateVote } from "./middleware/validation.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY son requeridos");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============= RUTAS =============

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ 
    message: "API Elecciones Escolares funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      parties: "/api/parties",
      vote: "/api/vote/:id",
      health: "/api/health"
    }
  });
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .select("count")
      .limit(1);
    
    if (error) throw error;
    
    res.json({ 
      status: "healthy", 
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      database: "disconnected",
      error: error.message 
    });
  }
});

// Obtener todos los partidos
app.get("/api/parties", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .select("*")
      .order("votes", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error("Error al obtener partidos:", error);
    res.status(500).json({ 
      error: "Error al obtener los partidos",
      details: error.message 
    });
  }
});

// Obtener un partido por ID
app.get("/api/parties/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Partido no encontrado" });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error al obtener partido:", error);
    res.status(500).json({ 
      error: "Error al obtener el partido",
      details: error.message 
    });
  }
});

// Crear un nuevo partido
app.post("/api/parties", validateParty, async (req, res) => {
  try {
    const { name, symbol, color, description, slogan, logo_url } = req.body;

    // Verificar si ya existe un partido con ese nombre
    const { data: existing } = await supabase
      .from("parties")
      .select("id")
      .eq("name", name)
      .single();

    if (existing) {
      return res.status(400).json({ 
        error: "Ya existe un partido con ese nombre" 
      });
    }

    const { data, error } = await supabase
      .from("parties")
      .insert([
        {
          name: name.trim(),
          symbol: symbol || null,
          color,
          description: description || null,
          slogan: slogan || null,
          logo_url: logo_url || null,
          votes: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Partido creado: ${data.name}`);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error al crear partido:", error);
    res.status(400).json({ 
      error: "Error al crear el partido",
      details: error.message 
    });
  }
});

// Actualizar un partido
app.put("/api/parties/:id", async (req, res) => {
  try {
    const { name, symbol, color, description, slogan, logo_url, votes } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (symbol !== undefined) updateData.symbol = symbol;
    if (color !== undefined) {
      if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({ 
          error: "Color inválido. Debe ser hexadecimal (ej: #FF0000)" 
        });
      }
      updateData.color = color;
    }
    if (description !== undefined) updateData.description = description;
    if (slogan !== undefined) updateData.slogan = slogan;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (votes !== undefined) {
      if (typeof votes !== 'number' || votes < 0) {
        return res.status(400).json({ 
          error: "Los votos deben ser un número positivo" 
        });
      }
      updateData.votes = votes;
    }

    const { data, error } = await supabase
      .from("parties")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Partido no encontrado" });
      }
      throw error;
    }

    console.log(`✅ Partido actualizado: ${data.name}`);
    res.json(data);
  } catch (error) {
    console.error("Error al actualizar partido:", error);
    res.status(400).json({ 
      error: "Error al actualizar el partido",
      details: error.message 
    });
  }
});

// Eliminar un partido
app.delete("/api/parties/:id", async (req, res) => {
  try {
    // Primero verificar que existe
    const { data: existing } = await supabase
      .from("parties")
      .select("name")
      .eq("id", req.params.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Partido no encontrado" });
    }

    const { error } = await supabase
      .from("parties")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    console.log(`❌ Partido eliminado: ${existing.name}`);
    res.json({ 
      message: "Partido eliminado exitosamente",
      deletedParty: existing.name
    });
  } catch (error) {
    console.error("Error al eliminar partido:", error);
    res.status(400).json({ 
      error: "Error al eliminar el partido",
      details: error.message 
    });
  }
});

// Registrar un voto
app.post("/api/vote/:id", validateVote, async (req, res) => {
  try {
    // Obtener el partido actual
    const { data: party, error: fetchError } = await supabase
      .from("parties")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return res.status(404).json({ error: "Partido no encontrado" });
      }
      throw fetchError;
    }

    // Incrementar votos
    const newVotes = (party.votes || 0) + 1;
    
    const { data, error } = await supabase
      .from("parties")
      .update({ votes: newVotes })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    console.log(`🗳️  Voto registrado para: ${data.name} (Total: ${data.votes})`);
    res.json(data);
  } catch (error) {
    console.error("Error al registrar voto:", error);
    res.status(400).json({ 
      error: "Error al registrar el voto",
      details: error.message 
    });
  }
});

// Resetear votos de un partido
app.post("/api/parties/:id/reset", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("parties")
      .update({ votes: 0 })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Partido no encontrado" });
      }
      throw error;
    }

    console.log(`🔄 Votos reseteados para: ${data.name}`);
    res.json(data);
  } catch (error) {
    console.error("Error al resetear votos:", error);
    res.status(400).json({ 
      error: "Error al resetear los votos",
      details: error.message 
    });
  }
});

// Resetear TODOS los votos
app.post("/api/parties/reset-all", async (req, res) => {
  try {
    const { data: parties } = await supabase
      .from("parties")
      .select("id, name");

    if (!parties || parties.length === 0) {
      return res.json({ 
        message: "No hay partidos para resetear",
        count: 0 
      });
    }

    // Resetear todos los votos a 0
    const { error } = await supabase
      .from("parties")
      .update({ votes: 0 })
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Actualizar todos

    if (error) throw error;

    console.log(`🔄 Todos los votos han sido reseteados (${parties.length} partidos)`);
    res.json({ 
      message: "Todos los votos han sido reseteados",
      count: parties.length,
      parties: parties.map(p => p.name)
    });
  } catch (error) {
    console.error("Error al resetear todos los votos:", error);
    res.status(400).json({ 
      error: "Error al resetear todos los votos",
      details: error.message 
    });
  }
});

// Obtener estadísticas
app.get("/api/stats", async (req, res) => {
  try {
    const { data: parties, error } = await supabase
      .from("parties")
      .select("*")
      .order("votes", { ascending: false });

    if (error) throw error;

    const totalVotes = parties.reduce((sum, p) => sum + (p.votes || 0), 0);
    const leader = parties.length > 0 ? parties[0] : null;

    res.json({
      totalParties: parties.length,
      totalVotes,
      leader: leader ? {
        name: leader.name,
        votes: leader.votes,
        percentage: totalVotes > 0 ? ((leader.votes / totalVotes) * 100).toFixed(2) : 0
      } : null,
      parties: parties.map(p => ({
        name: p.name,
        votes: p.votes,
        percentage: totalVotes > 0 ? ((p.votes / totalVotes) * 100).toFixed(2) : 0
      }))
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ 
      error: "Error al obtener estadísticas",
      details: error.message 
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Servidor Backend Iniciado");
  console.log("=================================");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🗄️  Base de datos: Supabase`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
  console.log("Endpoints disponibles:");
  console.log(`  GET    /api/health`);
  console.log(`  GET    /api/parties`);
  console.log(`  GET    /api/parties/:id`);
  console.log(`  POST   /api/parties`);
  console.log(`  PUT    /api/parties/:id`);
  console.log(`  DELETE /api/parties/:id`);
  console.log(`  POST   /api/vote/:id`);
  console.log(`  POST   /api/parties/:id/reset`);
  console.log(`  POST   /api/parties/reset-all`);
  console.log(`  GET    /api/stats`);
  console.log("=================================");
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM recibido, cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT recibido, cerrando servidor...");
  process.exit(0);
});