import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

export default function PartyCard({ party, onVote, isSelected }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative group h-full"
    >
      {/* Efecto de borde circular animado */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `conic-gradient(from 0deg, ${party.color}40, ${party.color}80, ${party.color}40, ${party.color}20, ${party.color}40)`,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute inset-[2px] rounded-xl bg-slate-900/95 backdrop-blur-lg"></div>
      </div>

      {/* Efecto de brillo al hover */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${party.color}15 0%, transparent 70%)`
        }}
      />
      
      <div
        onClick={() => onVote(party)}
        className={`relative cursor-pointer overflow-hidden transition-all duration-300 h-full rounded-xl backdrop-blur-lg ${
          isSelected
            ? "shadow-xl scale-[1.02]"
            : "hover:shadow-lg"
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 50%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(100, 100, 100, 0.2)'
        }}
      >
        <div
          className="relative h-full"
          style={{
            background: `linear-gradient(135deg, ${party.color}08 0%, ${party.color}03 50%, transparent 100%)`,
          }}
        >
          {/* Logo Section */}
          <div className="p-5 text-center h-full flex flex-col">
            {/* Party Logo */}
            {party.logo_url ? (
              <motion.div 
                className="relative mx-auto mb-5"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                {/* Efecto de brillo detrás del logo */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-30"
                  style={{ backgroundColor: party.color }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative w-28 h-28 mx-auto rounded-xl overflow-hidden shadow-lg bg-slate-900/80 border border-slate-600/30">
                  <img
                    src={party.logo_url}
                    alt={party.name}
                    className="w-full h-full object-contain p-2.5"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-3xl font-black rounded-xl" style="background: linear-gradient(135deg, ${party.color}25, ${party.color}08); color: ${party.color}">
                          ${party.name[0]}
                        </div>
                      `;
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="w-28 h-28 mx-auto mb-5 rounded-xl flex items-center justify-center shadow-lg text-white text-3xl font-black border border-slate-600/30"
                style={{ 
                  background: `linear-gradient(135deg, ${party.color}35, ${party.color}15)`,
                  color: party.color 
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                {party.name[0]}
              </motion.div>
            )}

            {/* Party Name */}
            <motion.h3
              className="text-xl font-bold mb-3 text-slate-100"
              style={{ 
                textShadow: `0 0 20px ${party.color}60`
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {party.name}
            </motion.h3>

            {/* Slogan */}
            {party.slogan && (
              <motion.p 
                className="text-sm font-medium text-slate-300 mb-3 italic leading-tight flex-grow-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                "{party.slogan}"
              </motion.p>
            )}

            {/* Description */}
            {party.description && (
              <motion.p 
                className="text-slate-400 text-xs leading-relaxed mb-5 flex-grow px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {party.description}
              </motion.p>
            )}

            {/* Vote Button Area */}
            <motion.div 
              className="mt-auto pt-3 border-t border-slate-700/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  isSelected 
                    ? 'text-white shadow-md' 
                    : 'text-slate-300 hover:text-white'
                }`}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${party.color}, ${party.color}DD)`
                    : `linear-gradient(135deg, ${party.color}20, ${party.color}10)`,
                  border: `1px solid ${isSelected ? party.color : party.color + '40'}`
                }}
                whileHover={{ 
                  scale: 1.03,
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Seleccionado</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Votar por este partido</span>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Selected Indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/20"
              style={{ 
                background: `linear-gradient(135deg, ${party.color}, ${party.color}DD)`
              }}
            >
              <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
          )}

          {/* Efecto de partículas circulares en el borde */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: '0%',
                  left: `${(i * 12.5)}%`,
                  width: 3,
                  height: 3,
                  backgroundColor: party.color,
                }}
                animate={{
                  y: [0, 200, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}