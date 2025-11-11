import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Elecciones Escolares funcionando");
});

app.listen(3001, () => {
  console.log("Servidor Backend corriendo en http://localhost:3001");
});
