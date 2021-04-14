const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const fileUpload = require("express-fileupload");
const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@socialbuddy.vddzz.mongodb.net/${process.env.DB_NAMe}?retryWrites=true&w=majority`;

const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("doctors"));
app.use(fileUpload());

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

  const doctorCollection = client
    .db(`${process.env.DB_NAMe}`)
    .collection(`${process.env.DB_CLT_DOCTOR}`);

  app.post("/addAppointment", (req, res) => {
    const appointment = req.body;
    console.log(appointment);
    appointmentCollection.insertOne(appointment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/appointmentsByDate", (req, res) => {
    const date = req.body;
    const email = req.body.email;
    doctorCollection.find({ email: email }).toArray((err, doctors) => {
      const filter = { date: date.date };
      if (doctors === 0) {
        filter.email = email;
      }
      appointmentCollection.find(filter).toArray((err, documents) => {
        res.send(documents);
      });
    });
  });

  app.get("/appointments", (req, res) => {
    appointmentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // app.post("/addADoctor", (req, res) => {
  //   const file = req.files.file;
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   const newImg = file.data;
  //   const encImg = newImg.toString("base64");

  //   var image = {
  //     contentType: file.mimetype,
  //     size: file.size,
  //     img: Buffer.from(encImg, "base64"),
  //   };

  //   doctorCollection.insertOne({ name, email, image }).then((result) => {
  //     res.send(result.insertedCount > 0);
  //   });
  // });
  app.post("/addADoctor", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    file.mv(
      (`${__dirname}/doctors/${file.name}`,
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ msg: "Field to upload" });
        }
        doctorCollection
          .insertOne({ name, email, img: file.name })
          .then((result) => {
            res.send(result.insertedCount > 0);
          });
        // return res.send({name:file.name, path:`${file.name}`})
      })
    );
  });

  app.get("/doctors", (req, res) => {
    doctorCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/isDoctor", (req, res) => {
    const email = req.body.email;
    doctorCollection.find({ email: email }).toArray((err, doctors) => {
      res.send(doctors.length > 0);
      console.log(doctors);
    });
  });
});

app.listen(process.env.PORT || port);
