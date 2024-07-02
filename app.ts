import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { publishToService2 } from "./app/services/service";
import { task_model } from "./app/models/task";
import { connectDB } from "./app/services/mongoConnector";

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

app.get("/products", (req: Request, res: Response) => {
  res.json({ data: [{ id: 1, name: "product 1" }] });
});

app.get("/tasker", async (req: Request, res: Response) => {
  await task_model.create({ payload: "oops " + new Date().valueOf() });
  res.json({ msg: "seeded" });
});

const currentEnv = process.env.NODE_ENV;

if (currentEnv != "test") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
