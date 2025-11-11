import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Vote, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-white opacity-5 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white opacity-5 rounded-full"
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 bg-white rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl"
            >
              <Vote className="w-20 h-20 text-purple-600" strokeWidth={2.5} />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-black mb-4 text-white"
            >
              Elecciones
              <br />
              <span className="text-yellow-300">Escolares 2024</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 font-light"
            >
              Tu voto construye el futuro de nuestra escuela
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Link to={createPageUrl("Vote")}>
                <Button
                  size="lg"
                  className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-2xl transform transition-all hover:scale-105 border-4 border-white/30"
                >
                  <Vote className="w-8 h-8 mr-3" />
                  Marcar Votación
                </Button>
              </Link>

              <Link to={createPageUrl("AdminLogin")}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 backdrop-blur-sm"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Acceso Administrador
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <div className="grid grid-cols-3 gap-6 text-white">
                <div>
                  <div className="text-3xl font-bold mb-1">🔒</div>
                  <p className="text-sm opacity-80">Votación Segura</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">👤</div>
                  <p className="text-sm opacity-80">100% Anónima</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">⚡</div>
                  <p className="text-sm opacity-80">Resultados Inmediatos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/70 mt-6 text-sm"
        >
          Sistema de Votación Escolar - Seguro y Confiable
        </motion.p>
      </motion.div>
    </div>
  );
}