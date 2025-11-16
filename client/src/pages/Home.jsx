import React from "react";
import { Link } from "react-router-dom";
import { Vote, Shield, CheckCircle, Lock, Users, Sparkles, ArrowRight, Code } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "react-lottie-player";

// Importa tus archivos JSON
import robotAnimation from "../assets/lotties/robot.json";
import votoAnimation from "../assets/lotties/voto.json";

export default function Home() {
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

      {/* ========== LOTTIE IZQUIERDA - ROBOT ========== */}
      <motion.div
        initial={{ opacity: 0, x: -80, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          delay: 0.6, 
          duration: 1,
          type: "spring",
          stiffness: 100
        }}
        className="hidden lg:block absolute left-6 top-1/3 -translate-y-1/2 z-10"
      >
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
        
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-pink-500/30 to-purple-600/40 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-slate-900/30 backdrop-blur-lg rounded-2xl p-3 border border-purple-500/20 shadow-2xl">
              <Lottie
                loop
                animationData={robotAnimation}
                play
                style={{ width: 280, height: 280 }}
              />
            </div>

            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* ========== LOTTIE DERECHA - VOTO ========== */}
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          delay: 0.8, 
          duration: 1,
          type: "spring",
          stiffness: 100
        }}
        className="hidden lg:block absolute right-6 top-1/3 -translate-y-1/2 z-10"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="relative"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-cyan-500/30 to-blue-600/40 rounded-2xl blur-xl"></div>
            
            <div className="relative bg-slate-900/30 backdrop-blur-lg rounded-2xl p-3 border border-blue-500/20 shadow-2xl">
              <Lottie
                loop
                animationData={votoAnimation}
                play
                style={{ width: 280, height: 280 }}
              />
            </div>

            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Admin button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="absolute top-6 right-6 z-50"
      >
        <Link to="/admin-login">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative flex items-center gap-2 px-5 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-purple-500/50 rounded-full shadow-xl hover:shadow-purple-500/30 hover:border-purple-400 transition-all">
              <Shield className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-slate-100 font-semibold text-sm">Admin Panel</span>
            </div>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12 lg:px-8">
        <div className="max-w-5xl w-full">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Logo/Badge */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 120,
                damping: 15,
                delay: 0.2
              }}
              className="inline-block mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-2xl scale-150"
                ></motion.div>

                <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-purple-500/30">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Vote className="w-16 h-16 text-purple-400 drop-shadow-2xl" strokeWidth={1.5} />
                  </motion.div>
                </div>

                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-purple-400 rounded-tl-2xl"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight"
            >
              <motion.span 
                className="block bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 drop-shadow-2xl"
              >
                Elecciones Escolares 2025
              </motion.span>
              <motion.span 
                className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-2xl mt-2"
              >
                Inka Garsaliso De La Vega
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 backdrop-blur-xl rounded-full border border-purple-500/30 shadow-xl"
            >
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <p className="text-base md:text-lg font-bold text-slate-100">
                Tu voz construye el futuro
              </p>
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </motion.div>
          </motion.div>

          {/* Features Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <Lock className="w-7 h-7" />,
                title: "Ultra Seguro",
                description: "Sistema protegido y encriptado",
                color: "from-purple-600 via-purple-700 to-purple-800",
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "100% Anónimo",
                description: "Privacidad total garantizada",
                color: "from-blue-600 via-indigo-600 to-blue-700",
              },
              {
                icon: <CheckCircle className="w-7 h-7" />,
                title: "Verificable",
                description: "Resultados en tiempo real",
                color: "from-green-600 via-emerald-600 to-green-700",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.9 + index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 } 
                }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300`}></div>
                
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700 group-hover:border-slate-600 rounded-2xl p-6 text-center shadow-xl transition-all duration-300">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} mb-4 text-white shadow-lg transition-all`}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <h3 className="text-xl font-black text-slate-100 mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Vote Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6, type: "spring" }}
            className="max-w-xl mx-auto mb-10"
          >
            <Link to="/vote">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative group overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-xl opacity-60"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-200%', '200%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                ></motion.div>

                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-black text-xl md:text-2xl py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all border border-purple-400/50 group-hover:border-white/50">
                  <Vote className="w-7 h-7" strokeWidth={2.5} />
                  <span>Votar Ahora</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </motion.div>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Info Cards Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-5 text-center shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <p className="text-purple-400 text-base font-bold mb-1 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Sistema Seguro
              </p>
              <p className="text-slate-300 text-xs">Tecnología de encriptación avanzada</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-5 text-center shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <p className="text-blue-400 text-base font-bold mb-1 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Votación Anónima
              </p>
              <p className="text-slate-300 text-xs">Tu identidad permanece confidencial</p>
            </motion.div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-900/90 to-green-900/30 backdrop-blur-xl border border-green-500/50 rounded-full px-6 py-3 mb-3 shadow-lg shadow-green-500/10"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-500/50"
              ></motion.div>
              <p className="text-slate-100 text-sm font-bold">
                Sistema Activo
              </p>
            </motion.div>
            
            <p className="text-slate-300 text-sm font-medium max-w-xl mx-auto leading-relaxed mb-6">
              Todos los votos son anónimos y confidenciales · Elecciones Escolares 2025
            </p>

            {/* Developer Credit Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-8 pt-6 border-t border-slate-700/50"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl border border-slate-600/40 rounded-full px-6 py-3 shadow-lg"
              >
                <Code className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 leading-tight">Desarrollado por</p>
                  <p className="text-sm font-bold text-slate-200 leading-tight">
                    Edisson Ronald Paricahua Calla
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-black"
                >
                  FS
                </motion.div>
              </motion.div>
              
              <p className="text-xs text-slate-300 mt-3 font-semibold">
                Full Stack Developer
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}