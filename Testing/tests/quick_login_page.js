test = {
  'Navigate to Login': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('.launchButton.in')
      .pause(500)
      .assert.title("Log In")
      .waitForElementVisible('.loginDetails', 4000)
      .pause(1000);
  },
  'Valid Login Attempt': function (browser) {
    browser
      .setValue('input[type=user]', browser.globals.username)
      .setValue('input[type=password]', browser.globals.password)
      .pause(100)
      .click('.buttonLogIn')
      //.click('.buttonLogIn')
      .pause(2000)
      .assert.title("Events")
      .pause(1000);
  }
};