import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import ResultsChart from "../components/admin/ResultsChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SYMBOLS = ["sol", "agua", "tierra", "aire", "fuego", "estrella"];

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    symbol: "sol",
    color: "#3B82F6",
    description: "",
  });

  const { data: parties, isLoading } = useQuery({
    queryKey: ["parties"],
    queryFn: () => base44.entities.Party.list("-votes"),
    initialData: [],
  });

  const createPartyMutation = useMutation({
    mutationFn: (partyData) => base44.entities.Party.create(partyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      setShowAddParty(false);
      setNewParty({ name: "", symbol: "sol", color: "#3B82F6", description: "" });
    },
  });

  const deletePartyMutation = useMutation({
    mutationFn: (partyId) => base44.entities.Party.delete(partyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const resetVotesMutation = useMutation({
    mutationFn: async (partyId) => {
      await base44.entities.Party.update(partyId, { votes: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  const exportToCSV = () => {
    const totalVotes = parties.reduce((sum, p) => sum + p.votes, 0);
    const headers = ["Partido", "Símbolo", "Votos", "Porcentaje"];
    const rows = parties.map((party) => {
      const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) : 0;
      return [party.name, party.symbol, party.votes, `${percentage}%`];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      `Total de Votos,,,${totalVotes}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `resultados-votacion-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllVotes = () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas resetear todos los votos? Esta acción no se puede deshacer."
      )
    ) {
      parties.forEach((party) => {
        resetVotesMutation.mutate(party.id);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Home"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Salir del Panel
          </Button>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-blue-100 text-lg">
              Gestiona partidos, visualiza resultados y exporta datos
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={exportToCSV}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar a Excel
              </Button>
              <Button
                onClick={resetAllVotes}
                variant="outline"
                className="bg-red-500 text-white border-red-600 hover:bg-red-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resetear Todos los Votos
              </Button>
              <Dialog open={showAddParty} onOpenChange={setShowAddParty}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Partido
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Partido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nombre del Partido</Label>
                      <Input
                        value={newParty.name}
                        onChange={(e) =>
                          setNewParty({ ...newParty, name: e.target.value })
                        }
                        placeholder="Ej: Partido del Sol"
                      />
                    </div>
                    <div>
                      <Label>Símbolo</Label>
                      <Select
                        value={newParty.symbol}
                        onValueChange={(value) =>
                          setNewParty({ ...newParty, symbol: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SYMBOLS.map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol.charAt(0).toUpperCase() + symbol.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Color (Hex)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={newParty.color}
                          onChange={(e) =>
                            setNewParty({ ...newParty, color: e.target.value })
                          }
                          className="w-20 h-10"
                        />
                        <Input
                          value={newParty.color}
                          onChange={(e) =>
                            setNewParty({ ...newParty, color: e.target.value })
                          }
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={newParty.description}
                        onChange={(e) =>
                          setNewParty({ ...newParty, description: e.target.value })
                        }
                        placeholder="Breve descripción del partido"
                      />
                    </div>
                    <Button
                      onClick={() => createPartyMutation.mutate(newParty)}
                      className="w-full"
                      disabled={!newParty.name || createPartyMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Crear Partido
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <ResultsChart parties={parties} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Partidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parties.map((party) => (
                <div
                  key={party.id}
                  className="flex items-center justify-between p-4 rounded-lg border-2"
                  style={{ borderColor: party.color, backgroundColor: `${party.color}10` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: party.color }}
                    >
                      {party.symbol[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{party.name}</h3>
                      <p className="text-sm text-gray-600">
                        {party.votes} votos | Símbolo: {party.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetVotesMutation.mutate(party.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar ${party.name}? Esta acción no se puede deshacer.`
                          )
                        ) {
                          deletePartyMutation.mutate(party.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}