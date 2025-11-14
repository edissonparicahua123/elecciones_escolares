import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { CheckCircle, Home, Sparkles, Info, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Confirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partyId = searchParams.get("partyId");

  const { data: parties = [] } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
  });

  const votedParty = parties.find((p) => p.id === partyId);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Orbs - Purple/Blue theme */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.8, 0],
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

      {/* Floating Sparkles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 bg-slate-900 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center relative overflow-hidden">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            className="relative w-28 h-28 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-full blur-lg"></div>
            <div className="relative w-full h-full bg-slate-900/90 backdrop-blur-xl border-2 border-purple-400/30 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-5xl font-black mb-3"
          >
            ¡Voto Registrado!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-slate-100"
          >
            Gracias por participar en las elecciones
          </motion.p>
        </div>

        <div className="p-8 space-y-6">
          {/* Voted Party Card */}
          {votedParty && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="p-6 rounded-xl border-2 bg-slate-800 flex items-center gap-6 shadow-lg transition-all"
              style={{
                borderColor: votedParty.color,
                backgroundColor: `${votedParty.color}15`,
              }}
            >
              {votedParty.logo_url && (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  src={votedParty.logo_url}
                  alt={votedParty.name}
                  className="w-20 h-20 rounded-lg object-cover shadow-lg bg-slate-900 p-2 border border-slate-700"
                />
              )}
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="text-sm font-medium text-slate-300 mb-2"
                >
                  Has votado por:
                </motion.h3>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                  className="text-3xl font-black text-white mb-1"
                  style={{ color: votedParty.color }}
                >
                  {votedParty.name}
                </motion.h2>
                {votedParty.slogan && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    className="text-slate-400 italic text-sm"
                  >
                    "{votedParty.slogan}"
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-3"
            >
              ✅
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-xl font-bold text-slate-100 mb-2"
            >
              Tu voto ha sido registrado exitosamente
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="text-slate-300 text-sm"
            >
              Tu participación es importante para el futuro de nuestra escuela
            </motion.p>
          </motion.div>

          {/* Warning Message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="bg-yellow-900/50 border border-yellow-700 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0 mt-0.5"
              >
                <Clock className="w-5 h-5 text-yellow-300" />
              </motion.div>
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="font-semibold text-yellow-300 text-sm mb-1"
                >
                  Importante
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                  className="text-yellow-300 text-sm"
                >
                  Si deseas votar nuevamente, deberás esperar 25 segundos desde tu último voto
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Return Home Button */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-4 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all border border-purple-500/50">
              <Home className="w-5 h-5" />
              Regresar al Inicio
            </div>
          </motion.button>

          {/* Info Footer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Info className="w-4 h-4 text-purple-400" />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.5 }}
                className="text-sm font-medium text-slate-300"
              >
                Confidencialidad
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.5 }}
              className="text-xs text-slate-400"
            >
              Los resultados se mantienen confidenciales durante el proceso de votación
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}