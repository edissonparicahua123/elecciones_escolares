import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PartyCard from "../components/voting/PartyCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function Vote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedParty, setSelectedParty] = useState(null);
  const [voteLocked, setVoteLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: parties, isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: () => base44.entities.Party.list(),
    initialData: [],
  });

  useEffect(() => {
    const lastVoteTime = localStorage.getItem("lastVoteTime");
    if (lastVoteTime) {
      const timeSinceVote = Date.now() - parseInt(lastVoteTime);
      if (timeSinceVote < 25000) {
        setVoteLocked(true);
        const remaining = Math.ceil((25000 - timeSinceVote) / 1000);
        setCountdown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (voteLocked && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setVoteLocked(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voteLocked, countdown]);

  const voteMutation = useMutation({
    mutationFn: async (party) => {
      await base44.entities.Party.update(party.id, {
        votes: party.votes + 1,
      });
      return party;
    },
    onSuccess: (party) => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      localStorage.setItem("lastVoteTime", Date.now().toString());
      setShowSuccess(true);
      
      // Redirigir al home después de 2 segundos
      setTimeout(() => {
        navigate(createPageUrl("Home"));
      }, 2000);
    },
  });

  const handleVote = (party) => {
    if (voteLocked || voteMutation.isPending) return;
    setSelectedParty(party);
    voteMutation.mutate(party);
  };

  const progressPercent = voteLocked ? ((25 - countdown) / 25) * 100 : 0;

  // Pantalla de éxito temporal
  if (showSuccess && selectedParty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl"
          >
            <CheckCircle className="w-20 h-20 text-white" strokeWidth={3} />
          </motion.div>
          
          <h2 className="text-4xl font-black mb-4 text-gray-800">
            ¡Voto Registrado!
          </h2>
          
          {selectedParty.logo_url && (
            <div className="mb-4">
              <img
                src={selectedParty.logo_url}
                alt={selectedParty.name}
                className="w-20 h-20 mx-auto rounded-xl object-cover shadow-lg bg-white p-2 border-2"
                style={{ borderColor: selectedParty.color }}
              />
            </div>
          )}
          
          <p className="text-2xl font-bold mb-2" style={{ color: selectedParty.color }}>
            {selectedParty.name}
          </p>
          
          <p className="text-gray-600 text-lg">
            Gracias por tu participación
          </p>
        </motion.div>
      </div>
    );
  }

  // Pantalla de bloqueo por tiempo
  if (voteLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-gray-800">
            Ya se registró un voto
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Debes esperar antes de poder marcar votación nuevamente
          </p>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 mb-6">
            <div className="text-6xl font-black mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {countdown}
            </div>
            <p className="text-gray-700 font-semibold">segundos restantes</p>
            <Progress value={progressPercent} className="h-3 mt-4" />
          </div>

          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Regresar al Inicio
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            className="mb-4 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <h1 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Selecciona tu Partido
            </h1>
            <p className="text-center text-gray-600 text-lg">
              Haz clic en el logo del partido de tu preferencia
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        ) : parties.length === 0 ? (
          <Alert className="bg-white">
            <AlertDescription className="text-center text-lg">
              No hay partidos disponibles para votar en este momento.
            </AlertDescription>
          </Alert>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {parties.map((party, index) => (
                <motion.div
                  key={party.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PartyCard
                    party={party}
                    onVote={handleVote}
                    isSelected={selectedParty?.id === party.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {voteMutation.isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-xl font-semibold">Registrando tu voto...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}