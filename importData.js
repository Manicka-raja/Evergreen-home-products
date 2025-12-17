const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("./schemas/tourschema");
dotenv.config({ path: "./config.env" });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/devdata.json`, "utf-8")
);

const DB = process.env.CONNECTION_STRING;
mongoose
  .connect(DB)
  .then(() => console.log("db connected successful"))
  .catch((err) => console.log("there is error in connecting db", err));

const importdata = async () => {
  try {
    const data = await Tour.create(tours);
    console.log("data imported successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deletedata = async () => {
  try {
    await Tour.deleteMany();
    console.log("data deleted successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importdata();
} else if (process.argv[2] === "--delete") {
  deletedata();
}
console.log(process.argv);
