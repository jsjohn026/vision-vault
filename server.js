import express from "express";
import cors from "cors";
import "dotenv/config"
import path from "path"
import { fileURLToPath } from "url"
const app = express()
const PORT = process.env.PORT || 8000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY

app.use(express.static(path.join(__dirname, '.', 'dist'),{
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    }
  }
}));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '.', "dist", "index.html"));
});

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user", 
        content: req.body.message
      }],
      max_tokens: 100,
    })
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const data = await response.json()
    res.send(data)
  } catch (error) {
    console.error(error)
  }
})

app.listen(PORT, "0.0.0.0", () => console.log('Your server is running on PORT ' + PORT))