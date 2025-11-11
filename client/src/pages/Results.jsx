import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { ArrowLeft, Users, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";

export default function Results() {
  const navigate = useNavigate();

  const { data: parties = [], isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: partiesApi.getAll,
    refetchInterval: 3000,
  });

  const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
  const leader = parties.reduce(
    (max, p) => (p.votes > max.votes ? p : max),
    { votes: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="mb-6 px-4 py-2 border-2 border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-12 h-12" />
              <div>
                <h1 className="text-4xl font-bold">Resultados en Vivo</h1>
                <p className="text-blue-100 text-lg">
                  Actualización automática cada 3 segundos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">Total de Votos</span>
                </div>
                <p className="text-4xl font-bold">{totalVotes}</p>
              </div>

              {leader.votes > 0 && (
                <div
                  className="rounded-xl p-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: `${leader.color}40`,
                    border: `2px solid ${leader.color}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🏆</span>
                    <span className="text-sm font-medium">Partido Líder</span>
                  </div>
                  <p className="text-2xl font-bold">{leader.name}</p>
                  <p className="text-sm opacity-90">{leader.votes} votos</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ResultsChart parties={parties} />
          </motion.div>
        )}
      </div>
    </div>
  );
}