import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { publishToService2 } from "./app/services/service";
import { task_model } from "./app/models/task";
import { connectDB } from "./app/services/mongoConnector";
import { product_model } from "./app/models/product";
import router from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 4000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Publisher server");
});

app.get("/pub", (req: Request, res: Response) => {
  publishToService2();
  res.send("Pub server");
});

app.get("/products", async (req: Request, res: Response) => {
  connectDB();
  const products: any = await product_model.find();

  res.json({ data: [...products] });
});

app.post("/products", async (req: Request, res: Response) => {
  connectDB();
  const { price, name } = req.body;

  if (!price || !name) {
    res.status(422).json({ msg: "Both price and name is required" });
    return;
  }

  let createdProduct = new product_model();
  createdProduct.name = name;
  createdProduct.price = price;

  let savedProduct: any = await createdProduct.save();

  res.status(201).json({ data: savedProduct?._doc });
});

app.get("/tasker", async (req: Request, res: Response) => {
  await task_model.create({ payload: "oops " + new Date().valueOf() });
  res.json({ msg: "seeded" });
});

app.use("/", router);

const currentEnv = process.env.NODE_ENV;

if (currentEnv != "test") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
