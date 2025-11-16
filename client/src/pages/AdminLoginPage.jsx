import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ADMIN_PASSWORD = 'admin2025';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    // CAMBIO: Fondo más oscuro y con textura
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Orbs - Pink/Purple theme */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          // CAMBIO: Orb morado más intenso
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          // CAMBIO: Orb rosa/azul
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
          // CAMBIO: Orb índigo
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

      {/* Floating Particles - CAMBIO: partículas rosas para ser más llamativo */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.8, 0],
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

      {/* Login Card - CAMBIO: Se añadió backdrop-blur y sombra más marcada */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/70 p-8 max-w-md w-full"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </motion.button>

        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="relative w-20 h-20 mx-auto mb-6"
        >
          {/* CAMBIO: Se mejoró el gradiente del ícono y el glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl blur-xl opacity-60"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border border-pink-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Title - CAMBIO: Gradiente de título más vibrante */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-2"
        >
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Acceso Administrativo
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-400 text-center mb-8 text-sm"
        >
          Ingresa tu contraseña para acceder al panel de control
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert - CAMBIO: Fondo más oscuro y con más contraste */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-900/70 border border-red-700 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">
                  Contraseña incorrecta
                </p>
                <p className="text-red-400 text-xs mt-1">
                  Verifica tu contraseña e inténtalo de nuevo.
                </p>
              </div>
            </motion.div>
          )}

          {/* Password Input - CAMBIO: Focus Ring Rosa */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                // CLASES MEJORADAS: Focus pink-500
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 text-slate-100 placeholder-slate-400 transition-all"
                autoFocus
              />
            </div>
          </motion.div>

          {/* Submit Button - CAMBIO: Gradiente Pink/Purple */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full relative group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all border border-pink-500/50">
              <Lock className="w-4 h-4" />
              Ingresar al Panel
            </div>
          </motion.button>
        </form>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 pt-6 border-t border-slate-800"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Acceso protegido y cifrado</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}