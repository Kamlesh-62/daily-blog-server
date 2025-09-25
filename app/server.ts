// Bootstrap HTTP server with typed middleware and routes.
import "dotenv/config"; // loads .env into process.env
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// -- Core middleware --
// URL-encoded
app.use(express.urlencoded({ extended: true }));
//  JSON
app.use(express.json());
//  Security
app.use(helmet());

//  CORS
const allowedOrigins: string[] = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};
app.use(cors(corsOptions));
//  Cookies
app.use(cookieParser());

// Routes
const prefix: string = process.env.PREFIX || "/api";
app.use(prefix, routes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const port: number = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}${prefix}`);
});
