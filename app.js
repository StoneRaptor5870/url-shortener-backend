const express = require("express");
const cors = require("cors");
const shortid = require("shortid");
const Url = require("./url");
const { urlValidator } = require("./util");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/all", async (req, res) => {
  const urls = await Url.find();
  res.status(200).json({
    urls: urls,
  });
});

app.post("/short", async (req, res) => {
  const { originalUrl } = req.body;
  const base = `https://url-shortener-backend-lake.vercel.app`;

  const urlId = shortid.generate();
  if (urlValidator(originalUrl)) {
    try {
      let url = await Url.findOne({ originalUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          originalUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

app.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

app.use("/", async (req, res) => {
  res.send(
    `<h1>Welcome to url shortener api</h1><h4>add /all to the url to see all available database data.</h4>`
  );
});

module.exports = app;
