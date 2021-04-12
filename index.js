const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello Programmer");
});

app.post("/addAppointment", (req, res) => {
  const appointment = req.body;
  appointmentCollection.insertOne(appointment).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.listen(process.env.PORT || port);
