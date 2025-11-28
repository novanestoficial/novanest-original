import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/produtos", async (req, res) => {
  try {
    const response = await axios.get("https://api.yampi.com.br/v1/products", {
      headers: {
        "Authorization": `Bearer ${process.env.YAMPI_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.listen(3000, () => console.log("API rodando na porta 3000"));
