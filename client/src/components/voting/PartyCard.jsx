import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function PartyCard({ party, onVote, isSelected }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        onClick={() => onVote(party)}
        className={`cursor-pointer overflow-hidden transition-all duration-300 h-full ${
          isSelected
            ? "ring-4 ring-offset-4 shadow-2xl scale-105"
            : "hover:shadow-2xl"
        }`}
        style={{
          borderColor: party.color,
          borderWidth: "4px",
          ringColor: isSelected ? party.color : "transparent"
        }}
      >
        <div
          className="relative"
          style={{
            background: `linear-gradient(135deg, ${party.color}20 0%, ${party.color}05 100%)`
          }}
        >
          {/* Logo Section */}
          <div className="p-8 text-center">
            {party.logo_url ? (
              <div className="w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg bg-white">
                <img
                  src={party.logo_url}
                  alt={party.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : (
              <div
                className="w-40 h-40 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg text-white text-6xl font-black"
                style={{ backgroundColor: party.color }}
              >
                {party.name[0]}
              </div>
            )}

            <h3 className="text-3xl font-black mb-2" style={{ color: party.color }}>
              {party.name}
            </h3>

            {party.slogan && (
              <p className="text-lg font-semibold text-gray-700 mb-3 italic">
                "{party.slogan}"
              </p>
            )}

            {party.description && (
              <p className="text-gray-600 text-base leading-relaxed px-4">
                {party.description}
              </p>
            )}
          </div>

          {/* Vote indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: party.color }}
            >
              <span className="text-2xl text-white">✓</span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}