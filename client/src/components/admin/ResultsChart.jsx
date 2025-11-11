import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultsChart({ parties }) {
  const chartData = parties.map(party => ({
    name: party.name,
    votos: party.votes,
    color: party.color
  }));

  const totalVotes = parties.reduce((sum, party) => sum + party.votes, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-2xl">Resultados de Votación</CardTitle>
        <p className="text-gray-600 mt-2">Total de votos: <span className="font-bold text-lg">{totalVotes}</span></p>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = totalVotes > 0 ? ((data.votos / totalVotes) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border-2" style={{ borderColor: data.color }}>
                      <p className="font-bold" style={{ color: data.color }}>{data.name}</p>
                      <p className="text-sm">Votos: <span className="font-semibold">{data.votos}</span></p>
                      <p className="text-sm">Porcentaje: <span className="font-semibold">{percentage}%</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="votos" name="Votos" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {parties.map((party) => {
            const percentage = totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(1) : 0;
            return (
              <div
                key={party.id}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: party.color, backgroundColor: `${party.color}10` }}
              >
                <h4 className="font-bold text-lg mb-1" style={{ color: party.color }}>
                  {party.name}
                </h4>
                <p className="text-2xl font-bold">{party.votes}</p>
                <p className="text-sm text-gray-600">{percentage}% del total</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}