import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { ArrowLeft, Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PartyCard from "../components/voting/PartyCard";

export default function Vote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedParty, setSelectedParty] = useState(null);
  const [voteLocked, setVoteLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: parties = [], isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
  });

  useEffect(() => {
    const lastVoteTime = localStorage.getItem("lastVoteTime");
    if (lastVoteTime) {
      const timeSinceVote = Date.now() - parseInt(lastVoteTime);
      if (timeSinceVote < 25000) {
        setVoteLocked(true);
        const remaining = Math.ceil((25000 - timeSinceVote) / 1000);
        setCountdown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (voteLocked && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setVoteLocked(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voteLocked, countdown]);

  const voteMutation = useMutation({
    mutationFn: (partyId) => partiesApi.vote(partyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      localStorage.setItem("lastVoteTime", Date.now().toString());
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const handleVote = (party) => {
    if (voteLocked || voteMutation.isPending) return;
    setSelectedParty(party);
    voteMutation.mutate(party.id);
  };

  const progressPercent = voteLocked ? ((25 - countdown) / 25) * 100 : 0;

  // Pantalla de éxito
  if (showSuccess && selectedParty) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-green-700/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center"
        >
          {/* Icono de éxito */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={2.5} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-100"
          >
            ¡Voto Registrado!
          </motion.h2>
          
          {selectedParty.logo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <img
                src={selectedParty.logo_url}
                alt={selectedParty.name}
                className="w-20 h-20 mx-auto rounded-xl object-cover shadow-lg bg-slate-800 p-2 border-2"
                style={{ borderColor: selectedParty.color }}
              />
            </motion.div>
          )}
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl font-bold mb-2 text-green-400"
          >
            {selectedParty.name}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-400 text-base md:text-lg"
          >
            Gracias por tu participación en las elecciones
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-6 border-t border-slate-700"
          >
            <p className="text-sm text-slate-500">
              Redirigiendo al inicio...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Pantalla de bloqueo por tiempo
  if (voteLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-orange-600/20 to-red-700/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center"
        >
          {/* Icono de reloj */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Clock className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
            Ya se registró un voto
          </h2>
          <p className="text-slate-400 mb-6 text-base md:text-lg">
            Debes esperar antes de poder marcar votación nuevamente
          </p>

          {/* Contador */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
            <div className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {countdown}
            </div>
            <p className="text-slate-400 font-semibold mb-4">segundos restantes</p>
            
            {/* Barra de progreso */}
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full py-3 md:py-4 text-base md:text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl transition-all shadow-lg border border-red-500/30"
          >
            Regresar al Inicio
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Pantalla principal de votación
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
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
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
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
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 md:mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="mb-4 md:mb-6 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 hover:border-purple-500/50 transition-all text-slate-200 font-medium shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </motion.button>

            {/* Title Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Selecciona tu Partido
              </h1>
              <p className="text-center text-slate-400 text-base md:text-lg">
                Haz clic en la tarjeta del partido de tu preferencia
              </p>
              
              {/* Info adicional */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-sm text-slate-500">
                <AlertCircle className="w-4 h-4" />
                <span>Tu voto es anónimo y confidencial</span>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 md:h-96">
              <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-purple-400 mb-4" />
              <p className="text-slate-400 text-lg">Cargando partidos...</p>
            </div>
          ) : parties.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-300 mb-2">
                No hay partidos disponibles
              </h3>
              <p className="text-base md:text-lg text-slate-500">
                No hay partidos disponibles para votar en este momento.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-all"
              >
                Volver al Inicio
              </motion.button>
            </motion.div>
          ) : (
            // Grid de Partidos
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {parties.map((party, index) => (
                  <motion.div
                    key={party.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PartyCard
                      party={party}
                      onVote={handleVote}
                      isSelected={selectedParty?.id === party.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Loading Overlay durante votación */}
          {voteMutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl"
              >
                <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-slate-100">Registrando tu voto...</p>
                <p className="text-sm text-slate-400 mt-2">Por favor espera</p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}