export const validateParty = (req, res, next) => {
  const { name, color } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ 
      error: "El nombre del partido es requerido" 
    });
  }

  if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
    return res.status(400).json({ 
      error: "El color debe ser un código hexadecimal válido (ej: #FF0000)" 
    });
  }

  next();
};

export const validateVote = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ 
      error: "ID del partido es requerido" 
    });
  }

  next();
};