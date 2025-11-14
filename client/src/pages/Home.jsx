import React from "react";
import { Link } from "react-router-dom";
import { Vote, Shield, CheckCircle, Lock, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
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
        {[...Array(20)].map((_, i) => (
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

      {/* Admin button - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-50"
      >
        <Link to="/admin-login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-full shadow-lg hover:shadow-purple-500/20 hover:bg-slate-700 hover:border-purple-500/50 transition-all text-slate-200 text-sm font-medium"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Admin</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            {/* Logo/Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: 0.2
              }}
              className="inline-block mb-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-slate-900 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700">
                  <Vote className="w-20 h-20 text-purple-400" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-200">
                Elecciones
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Escolares 2024
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-lg text-slate-300 mb-2"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <p className="font-medium">Tu voz construye el futuro</p>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>
          </motion.div>

          {/* Features Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <Lock className="w-7 h-7" />,
                title: "Seguro",
                description: "Sistema protegido y encriptado",
                color: "from-purple-600 to-purple-700",
                borderColor: "border-purple-500"
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Anónimo",
                description: "Privacidad total garantizada",
                color: "from-blue-600 to-indigo-600",
                borderColor: "border-blue-500"
              },
              {
                icon: <CheckCircle className="w-7 h-7" />,
                title: "Confiable",
                description: "Resultados verificables en tiempo real",
                color: "from-green-600 to-emerald-700",
                borderColor: "border-green-700"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="bg-slate-900 backdrop-blur-xl border border-slate-700 rounded-2xl p-7 text-center shadow-xl hover:shadow-purple-500/10 hover:border-slate-600 transition-all">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Vote Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="max-w-md mx-auto mb-10"
          >
            <Link to="/vote">
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl py-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all border border-purple-500/30 hover:border-purple-400/50">
                  <Vote className="w-7 h-7" strokeWidth={2.5} />
                  <span>Votar Ahora</span>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Info Cards Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-5 text-center">
              <p className="text-purple-400 text-sm font-semibold mb-1">Sistema Seguro</p>
              <p className="text-slate-400 text-xs">Tecnología de encriptación avanzada</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-5 text-center">
              <p className="text-blue-400 text-sm font-semibold mb-1">Votación Anónima</p>
              <p className="text-slate-400 text-xs">Tu identidad permanece confidencial</p>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-full px-6 py-3 mb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-slate-300 text-sm font-medium">
                Sistema Activo
              </p>
            </div>
            <p className="text-slate-500 text-xs">
              Todos los votos son anónimos y confidenciales · Elecciones Escolares 2024
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}