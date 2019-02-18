const path = require("path");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fetch = require("node-fetch");

const port = 8001;
const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost",
    credentials: true,
  }),
);

app.use("/graphql", (req, res) => {
  console.log(req.headers["Cookies"]);

  fetch
    .default("https://api.barbra.io/graphql", {
      method: "POST",
      headers: {
        origin: "https://barbra.io/",
        Cookies: req.headers["Cookies"],
      },
      body: req,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      res.send(data);
    });
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
