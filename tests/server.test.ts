import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

import request from "supertest";
import app from "../app";

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  // await mongoose.connect(process.env.MONGODB_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  // await mongoose.connection.close();
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
