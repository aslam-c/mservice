import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { publishToService2 } from "./app/services/service";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Publisher server");
});

app.get("/pub", (req: Request, res: Response) => {
  publishToService2();
  res.send("Pub server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
