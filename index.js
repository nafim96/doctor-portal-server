const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@socialbuddy.vddzz.mongodb.net/${process.env.DB_NAMe}?retryWrites=true&w=majority`;

const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", (req, res) => {
  res.send("Hello Programmer");
});

client.connect((err) => {
  const appointmentCollection = client
    .db(`${process.env.DB_NAMe}`)
    .collection(`${process.env.DB_CLT_NAME}`);

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection
      .find({ date: date.date })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/appointments", (req, res) => {
    appointmentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || port);
