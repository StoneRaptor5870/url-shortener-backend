const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// start server

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() =>
    // console.log(con.connections);
    console.log("DB connection successful")
  );

const app = require("./app.js");

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
