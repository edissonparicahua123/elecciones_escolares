import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { partiesApi } from "../api/partiesApi";
import { CheckCircle, Home } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full"
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle className="w-20 h-20 text-green-500" />
          </motion.div>
          <h1 className="text-5xl font-black mb-2">¡Voto Registrado!</h1>
          <p className="text-2xl text-green-100">
            Gracias por participar en las elecciones
          </p>
        </div>

        <div className="p-8">
          {votedParty && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-8 rounded-2xl border-4 flex items-center gap-6"
              style={{
                borderColor: votedParty.color,
                backgroundColor: `${votedParty.color}10`,
              }}
            >
              {votedParty.logo_url && (
                <img
                  src={votedParty.logo_url}
                  alt={votedParty.name}
                  className="w-24 h-24 rounded-xl object-cover shadow-lg bg-white p-2"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg text-gray-600 mb-2">Has votado por:</h3>
                <h2
                  className="text-4xl font-black"
                  style={{ color: votedParty.color }}
                >
                  {votedParty.name}
                </h2>
                {votedParty.slogan && (
                  <p className="text-gray-600 italic mt-2 text-lg">
                    "{votedParty.slogan}"
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Tu voto ha sido registrado exitosamente
              </h3>
              <p className="text-gray-600 text-lg">
                Tu participación es importante para el futuro de nuestra escuela
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⏳</div>
              <div className="flex-1">
                <p className="font-bold text-yellow-900 text-lg mb-1">
                  Importante
                </p>
                <p className="text-yellow-800">
                  Si deseas votar nuevamente, deberás esperar 25 segundos desde
                  tu último voto
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-6 h-6" />
            Regresar al Inicio
          </button>

          <div className="mt-6 p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              📊 Los resultados se mantienen confidenciales durante el proceso de
              votación
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}