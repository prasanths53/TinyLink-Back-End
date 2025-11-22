const express = require( "express");
const cors=require("cors")
const linksRouter=require("../routes/links")
const redirectRouter=require("../routes/redirect")
const healthRouter=require("../routes/health")

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/links", linksRouter);
app.use("/healthz", healthRouter);
app.use("/", redirectRouter);

module.exports = app;