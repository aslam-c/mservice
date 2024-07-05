import { Request, Response } from "express";
const express = require("express");
const router = express.Router();

router.get("/s3-upload", (req: Request, res: Response) => {
  res.status(200).json({ msg: "s3" });
});

export default router;
