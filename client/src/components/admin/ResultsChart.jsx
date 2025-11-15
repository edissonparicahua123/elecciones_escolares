import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, PieChart } from "lucide-react";

export default function ResultsChart({ parties }) {
  const chartData = parties.map((party) => ({
    name: party.name,
    votos: party.votes,
    color: party.color,
  }));

  const totalVotes = parties.reduce((sum, party) => sum + party.votes, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"></div>
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              background: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#818cf8',
            }}
            animate={{
              y: [0, -30, -60],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border-b border-slate-700/50 p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Resultados de Votación
              </h2>
              <motion.p 
                className="text-slate-300 mt-2 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Users className="w-4 h-4 text-blue-400" />
                Total de votos:{" "}
                <span className="font-bold text-lg text-white">{totalVotes}</span>
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-600/50"
            >
              <PieChart className="w-4 h-4 text-green-400" />
              <span className="text-slate-200 text-sm">En tiempo real</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Gráfico */}
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#D1D5DB' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#D1D5DB' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage =
                      totalVotes > 0
                        ? ((data.votos / totalVotes) * 100).toFixed(1)
                        : 0;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border"
                        style={{ borderColor: data.color + '40' }}
                      >
                        <p className="font-bold text-lg mb-2" style={{ color: data.color }}>
                          {data.name}
                        </p>
                        <div className="space-y-1">
                          <p className="text-slate-300 text-sm">
                            Votos: <span className="font-semibold text-white">{data.votos}</span>
                          </p>
                          <p className="text-slate-300 text-sm">
                            Porcentaje:{" "}
                            <span className="font-semibold text-white">{percentage}%</span>
                          </p>
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#D1D5DB', marginTop: 20 }}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <Bar 
                dataKey="votos" 
                name="Votos" 
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Tarjetas de resultados */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {parties.map((party, index) => {
              const percentage =
                totalVotes > 0
                  ? ((party.votes / totalVotes) * 100).toFixed(1)
                  : 0;
              return (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  className="relative p-4 rounded-xl backdrop-blur-lg border transition-all duration-300 group overflow-hidden"
                  style={{
                    borderColor: party.color + '40',
                    background: `linear-gradient(135deg, ${party.color}10, ${party.color}05)`,
                  }}
                >
                  {/* Efecto de brillo al hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${party.color}15 0%, transparent 70%)`
                    }}
                  />

                  <h4 
                    className="font-bold text-lg mb-2 relative z-10" 
                    style={{ color: party.color }}
                  >
                    {party.name}
                  </h4>
                  <p className="text-2xl font-bold text-white relative z-10">
                    {party.votes}
                  </p>
                  <p className="text-sm text-slate-400 relative z-10">
                    {percentage}% del total
                  </p>

                  {/* Barra de progreso */}
                  <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer informativo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 pt-4 border-t border-slate-700/50 text-center"
          >
            <p className="text-slate-400 text-sm">
              Sistema de votación seguro y transparente • Actualizado en tiempo real
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}