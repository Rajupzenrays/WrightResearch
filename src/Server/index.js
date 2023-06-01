const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const snowflake = require("snowflake-sdk");
const app = express();

app.use(express.json());
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.static("public"));

const con = snowflake.createConnection({
   account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
});

con.connect((err, conn) => {
  if (err) {
    console.log("Error in connection:", err);
  } else {
    console.log("Connected to Snowflake");
  }
});

app.post("/createRichText", (req, res) => {
  const { title, writerName, writerAddress, text } = req.body;
  const sql =
    "INSERT INTO RICHTEXT (title, writerName, writerAddress, text) VALUES (?, ?, ?, ?)";
  const binds = [title, writerName, writerAddress, text];

  con.execute({
    sqlText: sql,
    binds: binds,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.json({ Error: "Error executing query" });
      }
      console.log("Rows inserted:", rows);
      return res.json({ Status: "Success" });
    },
  });
});

app.listen(8082, () => {
  console.log("Server running on port 8082");
});
