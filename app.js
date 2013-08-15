#!/usr/bin/env node

var express = require("express");

var app = express();

app.use(express.bodyParser());
app.post('*', console.log);

app.listen(process.env.PORT);
