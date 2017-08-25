#!/usr/bin/env node

var ghpages = require('gh-pages');
var path = require('path');
var fs = require('fs');
var args = require('yargs')
  .boolean('p')
  .default('push', false)
  .alias('p', 'push')
  .describe('p', 'Push changes to remote repository, i.e. do an actual publish')
  .alias('v', 'version')
  .describe('v', 'semver version to publish the app as, defaults to the version in lerna.json')
  .alias('u', 'user')
  .describe('u', 'Git user')
  .alias('e', 'email')
  .describe('e', "Git user's email")
  .demandCommand(1)
  .usage('Usage: $0 <app name>')
  .argv;

// Debug tooling
process.env.NODE_DEBUG = 'gh-pages';

// get version from lerna global version
var version = args.version || require(path.resolve(__dirname, '../lerna.json')).version;
var appName = args._[0];

var appInfo = require('./apps.json');

// gh-branch's default, should pick from local machine's git config
var gitUser = null;
if (args.user && args.email) {
  gitUser = {
    user: args.user,
    email: args.email
  };
}

var target = appInfo[appName];

if(!target || !fs.existsSync(target.path)) {
  console.error('module ' + appName + ' not found!');
}

var options = {
  branch: version,
  dotfiles: true,
  remote: 'origin',
  repo: target.repo,
  user: gitUser,
  tag: 'release-' + appName + "-" + version,
  message: "Release " + appName + " at version: " + version,
  push: args.push
};

console.info('Publishing contents of ' + target.path +
  ' to remote ' + target.repo);

ghpages.publish(target.path, options, function(err) {
  if (err) {
    console.info("Finished with error ", err);
  } else {
    console.info("Finished with success ");
  }
});
