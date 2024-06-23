const express = require("express");

const app = express();
app.use(express.json());

const port = 3000;

app.use("/", (req, res) => {
  res.status(200).send({ msg: "ok" });
});

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
