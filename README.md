# mocha-sauce-notifying-reporter

Reporter plugin for the mocha test runner (on node) that jobUpdate's Sauce Labs with suite pass/fail at the end of a run.

[![NPM version](http://badge.fury.io/js/mocha-sauce-notifying-reporter.png)](https://npmjs.org/package/mocha-sauce-notifying-reporter "View this project on NPM")
[![Dependency Status](https://david-dm.org/gleneivey/mocha-sauce-notifying-reporter.png?theme=shields.io)](https://david-dm.org/gleneivey/mocha-sauce-notifying-reporter)
[![Development Dependency Status](https://david-dm.org/gleneivey/mocha-sauce-notifying-reporter/dev-status.png?theme=shields.io)](https://david-dm.org/gleneivey/mocha-sauce-notifying-reporter#info=devDependencies)

This is a plugin for the JavaScript test runner [mocha](http://mochajs.org/),
developed for running tests under [node.js](http://nodejs.org/) that are
using browsers at [Sauce Labs](https://saucelabs.com/).  It watches for
mocha's test `end` event, then looks at the count of failed test cases
that were run.  It then uses
[`jobUpdate` in the Sauce Labs API](https://docs.saucelabs.com/reference/rest-api/#update-job)
to tell Sauce Labs whether the test run passed or failed.  If the
number of failures counted by mocha's base reporter is zero, then
it sends `passed: true` to Sauce Labs, otherwise `passed: false`.

##Usage

###Installation

Include `mocha-sauce-notifying-reporter` in your `package.json` as you
normally would, either by editing or

```bash
npm install mocha-sauce-notifying-reporter --save-dev
```

###Invoking mocha

You can then use the reporter by specifying it when you invoke mocha.
For example, on the command line:

```bash
mocha --reporter mocha-sauce-notifying-reporter
```

Unlike most reporters, this one *produces no text output of its own*
&mdash; it only sends notifications to Sauce Labs.  Assuming that you'd
also like some other kind(s) of output from your test runs, you can
invoke it along with other reporter(s) using the NPM
[`mocha-multi`](https://github.com/glenjamin/mocha-multi).  After
installing `mocha-multi`, that might look something like this on the
command line:

```bash
export multi='spec=- mocha-sauce-notifying-reporter=-'
mocha --reporter mocha-multi
```

###Integrating With Your Tests

The reporter automatically gets the count of failed test cases from
`mocha` &mdash; that's the great thing about it being a reporter.
However, it also needs information in order to communicate with your
account at Sauce Labs and to identify the particular Sauce job
that corresponds to your test run, so that the test results go to the
right place.

For Sauce Labs access credentials, `mocha-sauce-notifying-reporter`
reads the environment variables `SAUCE_USERNAME` and
`SAUCE_ACCESS_KEY`.  These are the same environment variables that
are read by the [`Sauce Connect`](https://docs.saucelabs.com/reference/sauce-connect/)
secure tunneling tool, and you've likely already established a
means for setting them in your testing environment(s).

To identify the Sauce Labs `jobId` for your test run, the
reporter expects your infrastructure to have placed the tests'
WebDriver session ID into the environment variable `SAUCE_SESSION_ID`
before the test run ends.  Sauce Labs is organized so that the
same identifier is used as the WebDriver session ID (which you
should be able to obtain through whichever WebDriver protocol
library you are using to execute tests), and as Sauce's
REST API `jobId`, and as the unique per-test identifier in URLs
for Sauce Labs' web UI.

For example, this snippet of JavaScript code uses the
[`selenium-webdriver.js`](https://www.npmjs.org/package/selenium-webdriver)
library, and could be inserted in your tests immediately
after you make your connection to Sauce Labs and have a
`driver` object:

```JavaScript
driver.getSession().then(function (session) {
  process.env.SAUCE_SESSION_ID = session.getId();
});

```

