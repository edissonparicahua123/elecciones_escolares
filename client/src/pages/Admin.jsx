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
  Award,
  Activity,
  PieChart,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) : 0;
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
    link.setAttribute("download", `resultados-votacion-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllVotes = () => {
    if (window.confirm("¿Estás seguro de que deseas resetear todos los votos? Esta acción no se puede deshacer.")) {
      parties.forEach((party) => {
        resetVotesMutation.mutate(party.id);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  // Calcular estadísticas avanzadas
  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const leadingParty = parties.reduce((max, party) => party.votes > (max?.votes || 0) ? party : max, null);
  const averageVotes = parties.length > 0 ? (totalVotes / parties.length).toFixed(1) : 0;
  const participationRate = totalVotes > 0 ? "Alta" : "Sin participación";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto">
        {/* Header Superior */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Inicio</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 backdrop-blur-xl border border-red-700/50 rounded-xl hover:bg-red-900/60 transition-all text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Salir</span>
          </motion.button>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 rounded-3xl shadow-2xl p-8 mb-6"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-4 bg-white/10 backdrop-blur rounded-2xl"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-white mb-1">Panel de Control</h1>
              <p className="text-purple-100 text-base">Sistema Electoral - Administración Avanzada</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard - 4 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <BarChart3 className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-blue-100 text-sm font-medium mb-1">Total Votos</p>
            <p className="text-4xl font-black text-white">{totalVotes}</p>
            <p className="text-blue-200 text-xs mt-2">Votos registrados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Users className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-purple-100 text-sm font-medium mb-1">Partidos</p>
            <p className="text-4xl font-black text-white">{parties.length}</p>
            <p className="text-purple-200 text-xs mt-2">En competencia</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Award className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-green-100 text-sm font-medium mb-1">Líder Actual</p>
            <p className="text-2xl font-black text-white truncate">{leadingParty?.name || "N/A"}</p>
            <p className="text-green-200 text-xs mt-2">{leadingParty ? `${leadingParty.votes} votos` : "Sin datos"}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <Activity className="w-8 h-8 text-white/80 mb-3" />
            <p className="text-orange-100 text-sm font-medium mb-1">Promedio</p>
            <p className="text-4xl font-black text-white">{averageVotes}</p>
            <p className="text-orange-200 text-xs mt-2">Votos por partido</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddParty(!showAddParty)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg text-white font-bold hover:shadow-green-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Partido</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl shadow-lg text-slate-200 font-bold hover:border-purple-500/50 hover:shadow-purple-500/20 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Exportar CSV</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetAllVotes}
            className="flex items-center gap-2 px-6 py-3 bg-red-900/40 border border-red-700/50 rounded-xl shadow-lg text-red-300 font-bold hover:bg-red-900/60 hover:shadow-red-500/20 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Resetear Todo</span>
          </motion.button>
        </motion.div>

        {/* Modal Agregar Partido */}
        <AnimatePresence>
          {showAddParty && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-2xl shadow-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Plus className="w-7 h-7 text-purple-400" />
                  Crear Nuevo Partido
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddParty(false)}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Nombre del Partido *</label>
                  <input
                    type="text"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    placeholder="Ej: Partido del Sol"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Símbolo</label>
                  <select
                    value={newParty.symbol}
                    onChange={(e) => setNewParty({ ...newParty, symbol: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    {SYMBOLS.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newParty.color}
                      onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                      className="w-16 h-12 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newParty.color}
                      onChange={(e) => setNewParty({ ...newParty, color: e.target.value })}
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Slogan</label>
                  <input
                    type="text"
                    value={newParty.slogan}
                    onChange={(e) => setNewParty({ ...newParty, slogan: e.target.value })}
                    placeholder="Slogan del partido"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-300 mb-2">URL del Logo</label>
                  <input
                    type="text"
                    value={newParty.logo_url}
                    onChange={(e) => setNewParty({ ...newParty, logo_url: e.target.value })}
                    placeholder="https://ejemplo.com/logo.png"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Descripción</label>
                  <textarea
                    value={newParty.description}
                    onChange={(e) => setNewParty({ ...newParty, description: e.target.value })}
                    placeholder="Breve descripción del partido"
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => createPartyMutation.mutate(newParty)}
                  disabled={!newParty.name || createPartyMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>Crear Partido</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout Principal: Gráfico + Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Resultados - 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <ResultsChart parties={parties} />
          </motion.div>

          {/* Top 3 Partidos - 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Top 3 Partidos
            </h3>
            <div className="space-y-4">
              {parties
                .sort((a, b) => b.votes - a.votes)
                .slice(0, 3)
                .map((party, index) => {
                  const assignedColor = PARTY_COLORS[parties.indexOf(party) % PARTY_COLORS.length];
                  const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0;
                  const medals = ["🥇", "🥈", "🥉"];
                  
                  return (
                    <motion.div
                      key={party.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="relative overflow-hidden bg-slate-800 rounded-xl p-4 border border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{medals[index]}</span>
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                          style={{ backgroundColor: assignedColor }}
                        >
                          {party.symbol?.[0]?.toUpperCase() || party.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate">{party.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-400">{party.votes} votos</span>
                            <span className="text-xs text-purple-400 font-bold">{percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* Lista Completa de Partidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" />
            Todos los Partidos
          </h2>

          <div className="space-y-3">
            {parties.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-xl font-bold">No hay partidos registrados</p>
                <p className="text-slate-600 text-sm mt-2">Agrega un partido para comenzar</p>
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
                    transition={{ delay: 1 + index * 0.03 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="relative overflow-hidden rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-600 transition-all shadow-lg"
                  >
                    {/* Barra de progreso */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(to right, ${assignedColor} ${percentage}%, transparent ${percentage}%)`,
                      }}
                    />

                    <div className="relative flex items-center justify-between p-5">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0"
                          style={{ backgroundColor: assignedColor }}
                        >
                          {party.symbol?.[0]?.toUpperCase() || party.name[0]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-xl text-white truncate">{party.name}</h3>
                          <div className="flex items-center gap-4 mt-1 flex-wrap">
                            <span className="text-sm text-slate-400">
                              <span className="font-bold text-white">{party.votes}</span> votos
                            </span>
                            <span className="text-sm text-slate-400">
                              <span className="font-bold text-purple-400">{percentage}%</span>
                            </span>
                            {party.symbol && (
                              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                {party.symbol}
                              </span>
                            )}
                          </div>
                          {party.slogan && (
                            <p className="text-xs text-slate-500 italic mt-2 truncate">"{party.slogan}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => resetVotesMutation.mutate(party.id)}
                          className="p-3 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-all text-slate-300 hover:text-white"
                          title="Resetear votos"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (window.confirm(`¿Eliminar ${party.name}? Esta acción no se puede deshacer.`)) {
                              deletePartyMutation.mutate(party.id);
                            }
                          }}
                          className="p-3 bg-red-900/50 border border-red-700 rounded-lg hover:bg-red-900/70 transition-all text-red-300 hover:text-red-200"
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
        </motion.div>
      </div>
    </div>
  );
}