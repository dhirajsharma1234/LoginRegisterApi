require("dotenv").config();
const conn = require("./db/conn");
const express = require("express");
const app = express();
const route = require("./router/route");
const port = 8000 || process.env.PORT;

app.use(express.json());

app.use("/student", route);

app.listen(port, () => {
  console.log(`Our app is listening to the port ${port}`);
});
