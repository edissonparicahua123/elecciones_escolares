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
  Shield,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";

const SYMBOLS = ["sol", "agua", "tierra", "aire", "fuego", "estrella"];
const PARTY_COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#14B8A6"];

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    symbol: "sol",
    color: PARTY_COLORS[0],
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
        color: PARTY_COLORS[0],
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

  // Calcular estadísticas
  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const leadingParty = parties.reduce((max, party) => 
    party.votes > (max?.votes || 0) ? party : max, null
  );

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs - Purple/Blue theme */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Subtle Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header con navegación */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 backdrop-blur-xl border border-slate-700 rounded-full shadow-lg hover:shadow-purple-500/20 hover:bg-slate-800 hover:border-purple-500/50 transition-all text-slate-200 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-900/50 backdrop-blur-xl border border-red-700 rounded-full shadow-lg hover:shadow-red-500/20 hover:bg-red-900/70 transition-all text-red-300 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </motion.button>
            </div>

            {/* Header Principal */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-6 md:p-8 text-white mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/10 backdrop-blur rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Panel de Administración</h1>
                  <p className="text-purple-100 text-sm md:text-base mt-1">
                    Sistema de gestión electoral
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Total de Votos</span>
                </div>
                <p className="text-3xl font-bold text-slate-100">{totalVotes}</p>
                <p className="text-slate-500 text-xs mt-1">Votos registrados</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Partidos</span>
                </div>
                <p className="text-3xl font-bold text-slate-100">{parties.length}</p>
                <p className="text-slate-500 text-xs mt-1">Partidos registrados</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-lg sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Líder</span>
                </div>
                <p className="text-2xl font-bold text-slate-100 truncate">
                  {leadingParty?.name || "N/A"}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {leadingParty ? `${leadingParty.votes} votos` : "Sin votos aún"}
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddParty(!showAddParty)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 border border-green-700 rounded-xl shadow-lg hover:shadow-green-500/20 transition-all text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Partido</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportToCSV}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 border border-slate-700 rounded-xl shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all text-slate-200 text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetAllVotes}
                className="flex items-center gap-2 px-5 py-3 bg-red-900/50 border border-red-700 rounded-xl shadow-lg hover:shadow-red-500/20 hover:bg-red-900/70 transition-all text-red-300 text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resetear Votos</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Formulario de Agregar Partido */}
          {showAddParty && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 mb-6"
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-5 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-400" />
                Crear Nuevo Partido
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Nombre del Partido
                  </label>
                  <input
                    type="text"
                    value={newParty.name}
                    onChange={(e) =>
                      setNewParty({ ...newParty, name: e.target.value })
                    }
                    placeholder="Ej: Partido del Sol"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Símbolo
                  </label>
                  <select
                    value={newParty.symbol}
                    onChange={(e) =>
                      setNewParty({ ...newParty, symbol: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100"
                  >
                    {SYMBOLS.map((symbol) => (
                      <option key={symbol} value={symbol} className="bg-slate-800 text-slate-100">
                        {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Color del Partido
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newParty.color}
                      onChange={(e) =>
                        setNewParty({ ...newParty, color: e.target.value })
                      }
                      className="w-16 h-11 rounded-lg cursor-pointer bg-slate-800 border border-slate-600"
                    />
                    <input
                      type="text"
                      value={newParty.color}
                      onChange={(e) =>
                        setNewParty({ ...newParty, color: e.target.value })
                      }
                      placeholder="#8B5CF6"
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Slogan
                  </label>
                  <input
                    type="text"
                    value={newParty.slogan}
                    onChange={(e) =>
                      setNewParty({ ...newParty, slogan: e.target.value })
                    }
                    placeholder="Slogan del partido"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    URL del Logo
                  </label>
                  <input
                    type="text"
                    value={newParty.logo_url}
                    onChange={(e) =>
                      setNewParty({ ...newParty, logo_url: e.target.value })
                    }
                    placeholder="https://ejemplo.com/logo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newParty.description}
                    onChange={(e) =>
                      setNewParty({ ...newParty, description: e.target.value })
                    }
                    placeholder="Breve descripción del partido"
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => createPartyMutation.mutate(newParty)}
                  disabled={!newParty.name || createPartyMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all border border-purple-500/30 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>Crear Partido</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddParty(false)}
                  className="px-8 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Gráfico de Resultados */}
          <div className="mb-6">
            <ResultsChart parties={parties} />
          </div>

          {/* Lista de Partidos */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-5 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Gestión de Partidos
            </h2>
            <div className="space-y-4">
              {parties.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-lg">No hay partidos registrados</p>
                  <p className="text-slate-500 text-sm mt-1">Agrega un partido para comenzar</p>
                </div>
              ) : (
                parties.map((party, index) => {
                  const assignedColor = PARTY_COLORS[index % PARTY_COLORS.length];
                  const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0;
                  
                  return (
                    <motion.div
                      key={party.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="relative overflow-hidden rounded-xl border-2 bg-slate-800 shadow-lg transition-all"
                      style={{
                        borderColor: `${assignedColor}40`,
                      }}
                    >
                      {/* Barra de progreso de fondo */}
                      <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                          background: `linear-gradient(to right, ${assignedColor} ${percentage}%, transparent ${percentage}%)`,
                        }}
                      />
                      
                      <div className="relative flex items-center justify-between p-5">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-xl flex-shrink-0"
                            style={{ backgroundColor: assignedColor }}
                          >
                            {party.symbol ? party.symbol[0].toUpperCase() : party.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-100 truncate">{party.name}</h3>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-sm text-slate-400">
                                <span className="font-semibold text-slate-300">{party.votes}</span> votos
                              </span>
                              <span className="text-sm text-slate-400">
                                <span className="font-semibold text-purple-400">{percentage}%</span>
                              </span>
                              {party.symbol && (
                                <span className="text-xs text-slate-500">
                                  Símbolo: {party.symbol}
                                </span>
                              )}
                            </div>
                            {party.slogan && (
                              <p className="text-xs text-slate-500 italic mt-1 truncate">"{party.slogan}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => resetVotesMutation.mutate(party.id)}
                            className="p-2.5 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-all text-slate-300"
                            title="Resetear votos"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `¿Eliminar ${party.name}? Esta acción no se puede deshacer.`
                                )
                              ) {
                                deletePartyMutation.mutate(party.id);
                              }
                            }}
                            className="p-2.5 bg-red-900/50 border border-red-700 rounded-lg hover:bg-red-900/70 transition-all text-red-300"
                            title="Eliminar partido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}