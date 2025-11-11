import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";

const SYMBOLS = ["sol", "agua", "tierra", "aire", "fuego", "estrella"];

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    symbol: "sol",
    color: "#3B82F6",
    description: "",
    slogan: "",
    logo_url: "",
  });

  // Verificar autenticación
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const { data: parties = [], isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
  });

  const createPartyMutation = useMutation({
    mutationFn: (partyData) => partiesApi.create(partyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      setShowAddParty(false);
      setNewParty({
        name: "",
        symbol: "sol",
        color: "#3B82F6",
        description: "",
        slogan: "",
        logo_url: "",
      });
    },
  });

  const deletePartyMutation = useMutation({
    mutationFn: (partyId) => partiesApi.delete(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const resetVotesMutation = useMutation({
    mutationFn: (partyId) => partiesApi.resetVotes(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const exportToCSV = () => {
    const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
    const headers = ["Partido", "Símbolo", "Votos", "Porcentaje"];
    const rows = parties.map((party) => {
      const percentage =
        totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) : 0;
      return [party.name, party.symbol || "", party.votes, `${percentage}%`];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      `Total de Votos,,,${totalVotes}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `resultados-votacion-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllVotes = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas resetear todos los votos? Esta acción no se puede deshacer."
      )
    ) {
      parties.forEach((party) => {
        resetVotesMutation.mutate(party.id);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Salir del Panel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-blue-100 text-lg">
              Gestiona partidos, visualiza resultados y exporta datos
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={exportToCSV}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar a CSV
              </button>
              <button
                onClick={resetAllVotes}
                className="bg-red-500 text-white border-red-600 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Resetear Todos los Votos
              </button>
              <button
                onClick={() => setShowAddParty(!showAddParty)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Partido
              </button>
            </div>
          </div>
        </motion.div>

        {showAddParty && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <h3 className="text-2xl font-bold mb-4">Crear Nuevo Partido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Nombre del Partido
                </label>
                <input
                  type="text"
                  value={newParty.name}
                  onChange={(e) =>
                    setNewParty({ ...newParty, name: e.target.value })
                  }
                  placeholder="Ej: Partido del Sol"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Símbolo
                </label>
                <select
                  value={newParty.symbol}
                  onChange={(e) =>
                    setNewParty({ ...newParty, symbol: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {SYMBOLS.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Color (Hex)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newParty.color}
                    onChange={(e) =>
                      setNewParty({ ...newParty, color: e.target.value })
                    }
                    className="w-20 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newParty.color}
                    onChange={(e) =>
                      setNewParty({ ...newParty, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  value={newParty.slogan}
                  onChange={(e) =>
                    setNewParty({ ...newParty, slogan: e.target.value })
                  }
                  placeholder="Slogan del partido"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  URL del Logo
                </label>
                <input
                  type="text"
                  value={newParty.logo_url}
                  onChange={(e) =>
                    setNewParty({ ...newParty, logo_url: e.target.value })
                  }
                  placeholder="https://ejemplo.com/logo.png"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Descripción
                </label>
                <textarea
                  value={newParty.description}
                  onChange={(e) =>
                    setNewParty({ ...newParty, description: e.target.value })
                  }
                  placeholder="Breve descripción del partido"
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => createPartyMutation.mutate(newParty)}
                disabled={!newParty.name || createPartyMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Crear Partido
              </button>
              <button
                onClick={() => setShowAddParty(false)}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <ResultsChart parties={parties} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Gestión de Partidos</h2>
          <div className="space-y-3">
            {parties.map((party) => (
              <div
                key={party.id}
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  borderColor: party.color,
                  backgroundColor: `${party.color}10`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.symbol ? party.symbol[0].toUpperCase() : party.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{party.name}</h3>
                    <p className="text-sm text-gray-600">
                      {party.votes} votos
                      {party.symbol && ` | Símbolo: ${party.symbol}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => resetVotesMutation.mutate(party.id)}
                    className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Resetear votos"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Eliminar ${party.name}? Esta acción no se puede deshacer.`
                        )
                      ) {
                        deletePartyMutation.mutate(party.id);
                      }
                    }}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar partido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}