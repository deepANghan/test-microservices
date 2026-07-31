import express, { type Request, type Response } from "express";
import { handleProxy } from "./proxy.js";

const app = express();
const PORT = 3000;

app.use("/api", handleProxy);

app.listen(PORT, () => console.log(`API-GATEWAY running ON ${PORT}`));