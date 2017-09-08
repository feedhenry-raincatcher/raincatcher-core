#!/usr/bin/env node

var ghpages = require('gh-pages');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
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
  .alias('o', 'org')
  .describe('org', 'github organization/user to target publication')
  .default('org', 'feedhenry-raincatcher')
  .argv;

// get version from lerna global version
var version = args.version || require(path.resolve(__dirname, '../lerna.json')).version;
var appName = args._[0];

var appInfo = require(path.join(__dirname, '/apps.json'));

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

var repo = path.join('git@github.com:' + args.org, target.repo);

var options = {
  branch: 'release-' + version,
  dotfiles: true,
  repo: repo,
  user: gitUser,
  message: "Release " + appName + " at version: " + version,
  push: args.push
};

// Use root's gitignore file over target's
// To have sane ignores while keeping the compiled JS output
fs.writeFileSync(path.join(target.path, '/.gitignore'),
  fs.readFileSync('.gitignore'));

console.info('Publishing contents of ' + target.path +
  ' to remote ' + repo);

ghpages.publish(target.path, options, function(err) {
  if (err) {
    return console.info("Finished with error", err);
  }
  // revert gitignore change
  exec('git checkout ' + target.path, function(err) {
    if(err) {
      return console.info("Finished with error", err);
    }
    console.info("Finished with success");
  });
});
