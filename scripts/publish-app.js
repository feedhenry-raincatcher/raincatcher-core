#!/usr/bin/env node

var ghpages = require('gh-pages');
var path = require('path');
var fs = require('fs');
var args = require('yargs')
  .boolean('p')
  .default('p', false)
  .alias('p', 'push')
  .describe('p', 'Push changes to remote repository, i.e. do an actual publish')
  .alias('v', 'version')
  .describe('v', 'semver version to publish the app as')
  .demandOption(['p'])
  .demandCommand(1)
  .usage('Usage: $0 <app name> -p ')
  .argv;

// Debug tooling
process.env.NODE_DEBUG = 'gh-pages';

// get version from lerna global version
var version = args.version || require(path.resolve(__dirname, '../lerna.json')).version;
var appName = args._[0];

var appInfo = {
  server: {
    path: 'demo/server',
    repo: 'git@github.com:feedhenry-templates/wfm-server.git'
  },
  mobile: {
    path: 'demo/mobile',
    repo: 'git@github.com:feedhenry-templates/wfm-portal.git'
  },
  portal: {
    path: 'demo/portal',
    repo: 'git@github.com:feedhenry-templates/wfm-mobile.git'
  },
};

var target = appInfo[appName];

if(!target || !fs.existsSync(target.path)) {
  console.error('module ' + appName + ' not found!');
}

var options = {
  branch: version,
  dotfiles: true,
  //Only add, and never remove existing files
  add: true,
  remote: 'origin',
  repo: target.repo,
  user: { name: "Wojciech Trocki", email: "wtrocki@redhat.com" },
  tag: 'release-' + appName + "-" + version,
  // Commit message
  message: "Release " + appName + " at version: " + version,
  // Do not push (we will need to review and run tests before)
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
