#!/usr/bin/env node

var path = require("path"),
    slug = require("speakingurl"),
    child = require("child_process"),
    util = require("util"),
    fs = require("fs");

var relocations = {};

if (fs.existsSync('relocations.json')) {
  relocations = require("./relocations");
}

module.main = exports.main = main = function(args, cb) {
  var workdir = path.join(__dirname, 'work', slug(args.from)).substring(1 + __dirname.length);
  var source = util.format("ssh://hg@bitbucket.org/%s", args.from);
  var target = function(e) {
    var to = relocations[e] || e;
    return util.format("git+ssh://git@github.com/%s.git", to);
  }(args.to);

  if (! fs.existsSync(workdir)) {
    var cmd = util.format("hg clone %s %s", source, workdir);
  } else {
    cmd = util.format("cd %s ; hg pull -u %s", workdir, source);
  }

  child.exec(cmd, function(error, stdout, stderr) {
    if (error) {
      cb(error);
    }
    cmd = util.format("cd %s ; hg bookmark -f -r default master ; hg push %s", workdir, target);
    child.exec(cmd, function(error, stdout, stderr) {
      if (error) {
        cb(error);
      } else {
        cb(null, { workdir: workdir, from: source, to: target });
      }
    });
  });
}

if (require.main == module) {
  main({ from: "ingenieux/cedarhero", to: "ingenieux/cedarhero" }, console.log);
}
