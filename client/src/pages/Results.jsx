import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { ArrowLeft, Users, TrendingUp, Loader2, Trophy, BarChart3, Activity, Crown, Medal, Award } from "lucide-react";
import { motion } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";

export default function Results() {
  const navigate = useNavigate();

  const { data: parties = [], isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
    refetchInterval: 3000,
  });

  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const sortedParties = [...parties].sort((a, b) => b.votes - a.votes);
  const leader = sortedParties[0] || { votes: 0 };
  const secondPlace = sortedParties[1] || { votes: 0 };
  const thirdPlace = sortedParties[2] || { votes: 0 };

  const getPercentage = (votes) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden p-6">
      {/* Animated Background Orbs - Pink/Purple theme (Actualizado) */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          // Orb Rosa
          className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          // Orb Púrpura
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          // Orb Índigo
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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

      {/* Floating Particles (Actualizado a rosa) */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-lg hover:bg-slate-800 transition-all text-slate-200 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Inicio</span>
          </motion.button>

          {/* Title Card - Actualizado con gradiente pink/purple */}
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-6 border border-pink-500/30">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
              >
                <TrendingUp className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black mb-1">Resultados en Vivo</h1>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <p className="text-slate-100 text-sm">
                    Actualización automática cada 3 segundos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Votes Card - Actualizado con glassmorphism y pink/purple */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              // Aplicando glassmorphism
              className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 relative overflow-hidden group hover:border-pink-500/50 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  {/* Icon Gradient - Actualizado a pink/purple */}
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Total de Votos</span>
                </div>
                <p className="text-3xl font-black text-slate-100">{totalVotes}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="w-3 h-3 text-pink-400" />
                  <span className="text-xs text-slate-400">Participación activa</span>
                </div>
              </div>
            </motion.div>

            {/* Leader Card - Actualizado con glassmorphism */}
            {leader.votes > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                // Aplicando glassmorphism
                className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-5 relative overflow-hidden border-2 group hover:shadow-xl transition-all"
                style={{ borderColor: leader.color }}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: leader.color }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    {leader.logo_url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-lg">
                        <img
                          src={leader.logo_url}
                          alt={leader.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-white" style="background-color: ${leader.color}">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: leader.color }}>
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-100">1er Lugar</span>
                  </div>
                  <p className="text-2xl font-black text-slate-100 mb-1">{leader.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold" style={{ color: leader.color }}>{leader.votes} votos</p>
                    <span className="text-xs text-slate-400">({getPercentage(leader.votes)}%)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Second Place - Actualizado con glassmorphism */}
            {secondPlace.votes > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                // Aplicando glassmorphism
                className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-5 relative overflow-hidden border-2 group hover:shadow-xl transition-all"
                style={{ borderColor: secondPlace.color }}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: secondPlace.color }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    {secondPlace.logo_url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-lg">
                        <img
                          src={secondPlace.logo_url}
                          alt={secondPlace.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center" style="background-color: ${secondPlace.color}">
                                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: secondPlace.color }}>
                        <Medal className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-100">2do Lugar</span>
                  </div>
                  <p className="text-2xl font-black text-slate-100 mb-1">{secondPlace.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold" style={{ color: secondPlace.color }}>{secondPlace.votes} votos</p>
                    <span className="text-xs text-slate-400">({getPercentage(secondPlace.votes)}%)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Third Place - Actualizado con glassmorphism */}
            {thirdPlace.votes > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                // Aplicando glassmorphism
                className="bg-slate-900/70 backdrop-blur-sm rounded-xl p-5 relative overflow-hidden border-2 group hover:shadow-xl transition-all"
                style={{ borderColor: thirdPlace.color }}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: thirdPlace.color }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    {thirdPlace.logo_url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-lg">
                        <img
                          src={thirdPlace.logo_url}
                          alt={thirdPlace.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center" style="background-color: ${thirdPlace.color}">
                                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: thirdPlace.color }}>
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-100">3er Lugar</span>
                  </div>
                  <p className="text-2xl font-black text-slate-100 mb-1">{thirdPlace.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold" style={{ color: thirdPlace.color }}>{thirdPlace.votes} votos</p>
                    <span className="text-xs text-slate-400">({getPercentage(thirdPlace.votes)}%)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Chart Section - Actualizado con glassmorphism y pink/purple */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // Aplicando glassmorphism al loading state
            className="flex flex-col justify-center items-center h-96 bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl"
          >
            <Loader2 className="w-16 h-16 animate-spin text-pink-400 mb-4" />
            <p className="text-slate-300 text-sm">Cargando resultados...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            // Aplicando glassmorphism
            className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              {/* Icon Gradient - Actualizado a pink/purple */}
              <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">Gráfico de Resultados</h2>
                <p className="text-sm text-slate-400">Distribución de votos por partido</p>
              </div>
            </div>
            <ResultsChart parties={parties} />
          </motion.div>
        )}

        {/* Detailed Results Table - Actualizado con glassmorphism y pink/purple */}
        {!isLoading && sortedParties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            // Aplicando glassmorphism
            className="mt-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-pink-400" /> {/* Actualizado a pink-400 */}
              Ranking Completo
            </h2>
            <div className="space-y-3">
              {sortedParties.map((party, index) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  // Aplicando glassmorphism en la fila de la tabla
                  className="flex items-center gap-4 p-4 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-pink-500/50 transition-all group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm" style={{ backgroundColor: party.color, color: 'white' }}>
                    {index + 1}
                  </div>
                  {party.logo_url ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shadow-lg">
                      <img 
                        src={party.logo_url} 
                        alt={party.name} 
                        className="w-full h-full object-contain p-1" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-white font-bold text-xl" style="background-color: ${party.color}">
                              ${party.name[0]}
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: party.color }}
                    >
                      {party.name[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-100 text-lg">{party.name}</h3>
                    {party.slogan && (
                      <p className="text-xs text-slate-400 italic">{party.slogan}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: party.color }}>{party.votes}</p>
                    <p className="text-xs text-slate-400">{getPercentage(party.votes)}% del total</p>
                  </div>
                  <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getPercentage(party.votes)}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}