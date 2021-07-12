// From https://angular.io/guide/testing#configure-cli-for-ci-testing-in-chrome
const config = require('./protractor.conf').config;

config.chromeDriver = '/usr/bin/chromedriver';

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;
