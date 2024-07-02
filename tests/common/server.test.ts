import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { connectDB } from "../../app/services/mongoConnector";

require("dotenv").config();

beforeAll(async () => {
  await connectDB();
});

/* Connecting to the database before each test. */
beforeEach(async () => {});

/* Closing database connection after each test. */
afterEach(async () => {
  // await mongoose.connection.close();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET / Main root", () => {
  it("should return HTTP_OK status code", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /products", () => {
  it("Get Products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("POST /products", () => {
  it("Create new product with valid input", async () => {
    const dummyProduct = {
      name: "Product 1",
      is_active: true,
      price: 100
    };

    const res = await request(app)
      .post("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(dummyProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data.name).toEqual(dummyProduct.name);
  });

  it("Create new product with invalid input", async () => {
    const dummyProduct = {
      name: "Invalid Product 1"
    };

    const res = await request(app)
      .post("/products")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(dummyProduct);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty("msg");
    await mongoose.connection.dropCollection("products");
  });
});
