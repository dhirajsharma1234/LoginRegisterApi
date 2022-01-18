const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log(`database is connected to nodejs ..........`);
  })
  .catch((err) => {
    console.log(err);
  });
