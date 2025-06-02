import express from "express";
import "dotenv/config";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

// Instanciar express en la constante app
const app = express();

// Creación del puerto por defecto
const port = process.env.PORT || 3000;

// Conexión a la base de datos
connectDb();

// Configuración para procesar los datos en JSON
app.use(express.json());

// Configuración para leer los datos enviados en formato json
app.use(express.urlencoded({ extended: true }));

// Configuración para acceder a las cookies
app.use(cookieParser());

// Configurar el CORS para permitir el frontend
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Definir las rutas que va a utilizar la app
app.use("/api", userRoutes);
app.use("/api", expenseRoutes);

// Conexión de la app al puerto definido anteriormente
app.listen(port, () => {
  console.log("Running on port", port);
});
