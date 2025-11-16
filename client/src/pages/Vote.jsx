import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { ArrowLeft, Loader2, Clock, CheckCircle, AlertCircle, Shield, Lock, Users, Sparkles, X, Vote as VoteIcon, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PartyCard from "../components/voting/PartyCard";

export default function Vote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedParty, setSelectedParty] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
      
      // Cerrar modal inmediatamente
      setShowConfirmModal(false);
      
      // Pequeña pausa antes de mostrar éxito
      setTimeout(() => {
        setShowSuccess(true);
      }, 100);
      
      // Redirigir después de mostrar éxito
      setTimeout(() => {
        navigate("/");
      }, 2500);
    },
    onError: (error) => {
      console.error("Error al votar:", error);
      setShowConfirmModal(false);
      setSelectedParty(null);
      alert("Hubo un error al registrar tu voto. Intenta nuevamente.");
    }
  });

  const handleSelectParty = (party) => {
    if (voteLocked || voteMutation.isPending) return;
    setSelectedParty(party);
    setShowConfirmModal(true);
  };

  const handleConfirmVote = () => {
    if (selectedParty && !voteMutation.isPending) {
      voteMutation.mutate(selectedParty.id);
    }
  };

  const handleCancelVote = () => {
    setShowConfirmModal(false);
    setTimeout(() => {
      setSelectedParty(null);
    }, 300);
  };

  const progressPercent = voteLocked ? ((25 - countdown) / 25) * 100 : 0;

  // ========== MODAL DE CONFIRMACIÓN ==========
  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmModal && selectedParty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelVote}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-2 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            style={{ borderColor: selectedParty.color }}
          >
            {/* Glow effect de fondo */}
            <div 
              className="absolute inset-0 opacity-10 blur-3xl"
              style={{ backgroundColor: selectedParty.color }}
            />

            {/* Corner Decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl" style={{ borderColor: selectedParty.color }} />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl" style={{ borderColor: selectedParty.color }} />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCancelVote}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500/50 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header con gradiente */}
            <div 
              className="relative px-8 pt-8 pb-6 border-b border-slate-700/50"
              style={{
                background: `linear-gradient(135deg, ${selectedParty.color}15 0%, transparent 100%)`
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <VoteIcon className="w-6 h-6" style={{ color: selectedParty.color }} />
                <h2 className="text-2xl font-black text-slate-100">
                  Confirmar Voto
                </h2>
              </motion.div>
              <p className="text-slate-400 text-sm">
                ¿Estás seguro de que deseas votar por este partido?
              </p>
            </div>

            {/* Contenido del Modal */}
            <div className="relative p-8">
              {/* Indicador de carga dentro del modal */}
              {voteMutation.isPending && (
                <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-b-3xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" style={{ color: selectedParty.color }} />
                    <p className="text-slate-200 font-semibold">Registrando voto...</p>
                  </div>
                </div>
              )}

              {/* Logo del Partido - MÁS GRANDE */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-6 text-center"
              >
                <div className="relative inline-block">
                  {/* Glow effect detrás del logo */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-40"
                    style={{ backgroundColor: selectedParty.color }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {selectedParty.logo_url ? (
                    <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border-4 p-3" style={{ borderColor: selectedParty.color }}>
                      <img
                        src={selectedParty.logo_url}
                        alt={selectedParty.name}
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-5xl font-black rounded-xl" style="background: linear-gradient(135deg, ${selectedParty.color}35, ${selectedParty.color}15); color: ${selectedParty.color}">
                              ${selectedParty.name[0]}
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-40 h-40 mx-auto rounded-2xl flex items-center justify-center shadow-2xl text-white text-5xl font-black border-4"
                      style={{ 
                        background: `linear-gradient(135deg, ${selectedParty.color}45, ${selectedParty.color}25)`,
                        color: selectedParty.color,
                        borderColor: selectedParty.color
                      }}
                    >
                      {selectedParty.name[0]}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Información del Partido */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 mb-6"
              >
                {/* Nombre del Partido */}
                <div className="text-center">
                  <h3 
                    className="text-3xl font-black mb-2"
                    style={{ color: selectedParty.color }}
                  >
                    {selectedParty.name}
                  </h3>
                  
                  {/* Slogan */}
                  {selectedParty.slogan && (
                    <p className="text-lg font-semibold text-slate-300 italic mb-3">
                      "{selectedParty.slogan}"
                    </p>
                  )}

                  {/* Símbolo y Color */}
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                      <span className="text-slate-400">Símbolo:</span>
                      <span className="font-bold uppercase" style={{ color: selectedParty.color }}>
                        {selectedParty.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700">
                      <span className="text-slate-400">Color:</span>
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-slate-600"
                        style={{ backgroundColor: selectedParty.color }}
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {selectedParty.description && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-semibold text-slate-300">Descripción:</p>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed pl-6">
                      {selectedParty.description}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Advertencia */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-300 mb-1">
                      Importante
                    </p>
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                      Una vez confirmado, tu voto será registrado de forma anónima y no podrás cambiarlo.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Botones de Acción */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                {/* Botón Cancelar */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelVote}
                  className="flex-1 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-700 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-4 rounded-xl border border-slate-600 hover:border-slate-500 transition-all shadow-lg">
                    Cancelar
                  </div>
                </motion.button>

                {/* Botón Confirmar Voto */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmVote}
                  disabled={voteMutation.isPending}
                  className="flex-1 relative group overflow-hidden"
                >
                  <motion.div 
                    className="absolute inset-0 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: selectedParty.color }}
                  />
                  <div 
                    className="relative text-white font-bold py-4 rounded-xl shadow-xl border-2 transition-all flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: selectedParty.color,
                      borderColor: selectedParty.color
                    }}
                  >
                    {voteMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Votando...</span>
                      </>
                    ) : (
                      <>
                        <VoteIcon className="w-5 h-5" />
                        <span>Confirmar Voto</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>

              {/* Footer de Seguridad */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 pt-4 border-t border-slate-800"
              >
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Voto Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>100% Anónimo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verificable</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ========== PANTALLA DE ÉXITO ==========
  if (showSuccess && selectedParty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() * 3 + 2,
                height: Math.random() * 3 + 2,
                background: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#34d399' : '#22c55e',
              }}
              animate={{
                y: [0, -80, -150],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-20 min-h-screen flex items-center justify-center p-4"
        >
          <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/20 to-slate-900/90 backdrop-blur-2xl border border-green-500/30 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center">
            
            {/* Corner Decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>

            {/* Icono de éxito */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150"></div>
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 rounded-full w-28 h-28 md:w-32 md:h-32 mx-auto flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={2.5} />
              </div>
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
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg"></div>
                  <img
                    src={selectedParty.logo_url}
                    alt={selectedParty.name}
                    className="relative w-20 h-20 mx-auto rounded-xl object-cover shadow-lg bg-slate-800 p-2 border-2 border-green-400/50"
                  />
                </div>
              </motion.div>
            )}
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-green-900/30 backdrop-blur-xl border border-green-500/50 rounded-full px-6 py-3">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-500/50"
                ></motion.div>
                <p className="text-slate-100 text-sm font-bold">
                  Redirigiendo al inicio...
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== PANTALLA DE BLOQUEO POR TIEMPO ==========
  if (voteLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 80, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: Math.random() * 3 + 2,
                height: Math.random() * 3 + 2,
                background: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#f97316' : '#dc2626',
              }}
              animate={{
                y: [0, -80, -150],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative z-20 min-h-screen flex items-center justify-center p-4"
        >
          <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/20 to-slate-900/90 backdrop-blur-2xl border border-red-500/30 rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center">
            
            {/* Corner Decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-red-400 rounded-tl-2xl"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-orange-400 rounded-br-2xl"></div>

            {/* Icono de reloj */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150"></div>
              <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-full w-24 h-24 md:w-32 md:h-32 mx-auto flex items-center justify-center shadow-xl">
                <Clock className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-100">
              Ya se registró un voto
            </h2>
            <p className="text-slate-400 mb-6 text-base md:text-lg">
              Debes esperar antes de poder votar nuevamente
            </p>

            {/* Contador */}
            <div className="bg-gradient-to-br from-slate-900/80 to-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 mb-6">
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
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-base md:text-lg py-3 md:py-4 rounded-xl shadow-lg border border-red-500/50 group-hover:border-white/50 transition-all">
                Regresar al Inicio
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== PANTALLA PRINCIPAL DE VOTACIÓN ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-15"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 2,
              height: Math.random() * 3 + 2,
              background: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#818cf8',
            }}
            animate={{
              y: [0, -80, -150],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 md:mb-8"
          >
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="group relative mb-4 md:mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-purple-500/50 rounded-xl shadow-xl hover:shadow-purple-500/30 hover:border-purple-400 transition-all">
                <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-slate-100 font-semibold text-sm">Volver al Inicio</span>
              </div>
            </motion.button>

            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/20 to-slate-900/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl p-6 md:p-8 text-center"
            >
              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-2xl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Selecciona tu Partido
              </h1>
              <p className="text-center text-slate-400 text-base md:text-lg">
                Haz clic en la tarjeta del partido de tu preferencia
              </p>
              
              {/* Security Info */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-3 text-sm"
              >
                <div className="flex items-center gap-2 text-purple-400">
                  <Lock className="w-4 h-4" />
                  <span>Sistema Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span>Voto Anónimo</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Users className="w-4 h-4" />
                  <span>Confidencial</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-center items-center h-64 md:h-96"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-150"></div>
                <Loader2 className="relative w-12 h-12 md:w-16 md:h-16 animate-spin text-purple-400 mb-4" />
              </div>
              <p className="text-slate-400 text-lg">Cargando partidos...</p>
            </motion.div>
          ) : parties.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/20 to-slate-900/90 backdrop-blur-2xl border border-slate-700 rounded-2xl p-8 md:p-12 text-center"
            >
              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-slate-500 rounded-tl-2xl"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-slate-500 rounded-br-2xl"></div>

              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-300 mb-2">
                No hay partidos disponibles
              </h3>
              <p className="text-base md:text-lg text-slate-500 mb-6">
                No hay partidos disponibles para votar en este momento.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-all shadow-lg"
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
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { duration: 0.2 } 
                    }}
                  >
                    <PartyCard
                      party={party}
                      onVote={handleSelectParty}
                      isSelected={selectedParty?.id === party.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal />
    </div>
  );
}