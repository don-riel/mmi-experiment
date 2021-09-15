const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const create_csv_writer = require("csv-writer").createObjectCsvWriter;

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "mmi",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// GET method route
var result_header = [
  { id: "task1", title: "Task 1" },
  { id: "task2", title: "Task 2" },
  { id: "task3", title: "Task 3" },
  { id: "task4", title: "Task 4" },
  { id: "task5", title: "Task 5" },
  { id: "task6", title: "Task 6" },
];
//get mouse time results
app.get("/results/mouse", function (req, res) {
  db.select("*")
    .from("mouse")
    .then((response) => {
      const mouse_results = [];
      response.forEach((res) => mouse_results.push(res));
      const csv_writer = create_csv_writer({
        path: "mouse.csv",
        header: result_header,
      });
      csv_writer.writeRecords(mouse_results);

      res.send([response]);
    })
    .catch(() => {
      res.send("Failed to fetch data");
    });
});

//get touchpad time results
app.get("/results/touchpad", function (req, res) {
  db.select("*")
    .from("touchpad")
    .then((response) => {
      const touchpad_results = [];
      response.forEach((res) => touchpad_results.push(res));
      const csv_writer = create_csv_writer({
        path: "touchpad.csv",
        header: result_header,
      });
      csv_writer.writeRecords(touchpad_results);

      res.send([response]);
    })
    .catch(() => {
      res.send("Failed to fetch data");
    });
});
//get touchscreen time results
app.get("/results/touchscreen", function (req, res) {
  db.select("*")
    .from("touchscreen")
    .then((response) => {
      const touchscreen_results = [];
      response.forEach((res) => touchscreen_results.push(res));
      const csv_writer = create_csv_writer({
        path: "touchscreen.csv",
        header: result_header,
      });
      csv_writer.writeRecords(touchscreen_results);
      res.send([response]);
    })
    .catch(() => {
      res.send("Failed to fetch data");
    });
});

//download .csv files
app.get("/results/download/:type", function (req, res) {
  const { type } = req.params;
  res.download(`${type}.csv`);
});

// POST method route
//register a result
app.post("/register", function (req, res) {
  const { inputDevice, task1, task2, task3, task4, task5, task6 } = req.body;
  const structure = {
    task1: task1,
    task2: task2,
    task3: task3,
    task4: task4,
    task5: task5,
    task6: task6,
  };
  try {
      db(inputDevice)
        .insert(structure)
        .then((response) => {
          if (response) {
            res.send({ msg: "true" });
          }
        });

    // if (inputDevice === "mouse") {
    //   db("mouse")
    //     .insert(structure)
    //     .then((response) => {
    //       if (response) {
    //         res.send({ msg: "true" });
    //       }
    //     });
    // } else if (inputDevice === "touchpad") {
    //   db("touchpad")
    //     .insert(structure)
    //     .then((response) => {
    //       if (response) {
    //         res.send({ msg: "true" });
    //       }
    //     });
    // } else {
    //   db("touchscreen")
    //     .insert(structure)
    //     .then((response) => {
    //       if (response) {
    //         res.send({ msg: "true" });
    //       }
    //     });
    // }
  } catch (error) {
    res.send({ msg: "false" });
  }
});

app.listen("4000", () => {
  console.log("server running on port 4000");
});
