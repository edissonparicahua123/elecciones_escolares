const API_URL = import.meta.env.VITE_API_URL || 'https://civil-claude-control-asistencia-d373fc26.koyeb.app/api';

export const partiesApi = {
  // Obtener todos los partidos
  getAll: async () => {
    const response = await fetch(`${API_URL}/parties`);
    if (!response.ok) throw new Error('Error al obtener partidos');
    return response.json();
  },

  // Obtener un partido por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/parties/${id}`);
    if (!response.ok) throw new Error('Partido no encontrado');
    return response.json();
  },

  // Crear un nuevo partido
  create: async (partyData) => {
    const response = await fetch(`${API_URL}/parties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyData),
    });
    if (!response.ok) throw new Error('Error al crear partido');
    return response.json();
  },

  // Actualizar un partido
  update: async (id, partyData) => {
    const response = await fetch(`${API_URL}/parties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyData),
    });
    if (!response.ok) throw new Error('Error al actualizar partido');
    return response.json();
  },

  // Eliminar un partido
  delete: async (id) => {
    const response = await fetch(`${API_URL}/parties/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar partido');
    return response.json();
  },

  // Registrar un voto
  vote: async (id) => {
    const response = await fetch(`${API_URL}/vote/${id}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Error al registrar voto');
    return response.json();
  },

  // Resetear votos
  resetVotes: async (id) => {
    const response = await fetch(`${API_URL}/parties/${id}/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Error al resetear votos');
    return response.json();
  },
};