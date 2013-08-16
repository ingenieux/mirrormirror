#!/usr/bin/env node

var express = require("express");

var app = express();

app.use(express.methodOverride());
app.use(express.query());
app.use(express.bodyParser());

app.get('/status', function(req, res) {
  res.json(200, { status: 'ok' });
});

app.post('/hooks/bitbucket', function(req, res) {
  var payload = JSON.parse(req.body.payload);
  var mirror = require("./mirror");

  var repo = function(u) {
    return u.slice(1, -1 + u.length);
  }(payload.repository.absolute_url);

  mirror.main({ from: repo, to: repo }, function(error, data) {
    if (error) {
      res.json(500, { status: 'fail', error: error });
    } else {
      res.json(200, { status: 'ok', data: data });
    }
  });
});

app.use(express.errorHandler());

var port = process.env.PORT || 8000;

app.listen(port);

console.log("Listening on port %d", port);
