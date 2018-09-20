module.exports = {
    'Prepare Browser Window' : function (browser)
    {
      browser
        .resizeWindow(375, 700)
        .pause(100)
        .resizeWindow(375, 700)
        .pause(100)
        .setWindowPosition(700,200)
        .pause(100);
    },
    'Navigate to Login' : function (browser) 
    {
      browser
        .url('http://localhost:3000')
        .waitForElementVisible('body', 1000)
        .click('.launchButton.in')
        .pause(500)
        .assert.title("Log In")
        .waitForElementVisible('.loginDetails', 4000)
        .pause(1000);
    },
    'Empty Login' : function(browser)
    {
      browser
      .setValue('input[type=user]', '')
      .setValue('input[type=password]', '')
      .click('.buttonLogIn')
      .pause(1000)
      .assert.containsText('.loginInstructions', 'Please enter your details!');

    },
    'No Pass Login' : function(browser)
    {
      browser
      .setValue('input[type=user]', 'adhgfadshgfjasgjdgf')
      .setValue('input[type=password]', '')
      .click('.buttonLogIn')
      .pause(1000)
      .assert.containsText('.loginInstructions', 'Please enter your details!');

    },
    'No User Login' : function(browser)
    {
      browser
      .setValue('input[type=user]', '')
      .setValue('input[type=password]', 'ajdsfjasjdfhgjhasg')
      .click('.buttonLogIn')
      .pause(1000)
      .assert.containsText('.loginInstructions', 'User not found');

    },
    'Incorrect Login' : function(browser)
    {
      browser
      .setValue('input[type=user]', 'asdjfhjklashdfjkhaisudhf')
      .setValue('input[type=password]', 'fhdhgfeuiuuiisdjifhskdjhiwkjd')
      .click('.buttonLogIn')
      .pause(1000)
      .expect.element('.loginInstructions').to.have.css('color').which.equals('rgba(255, 0, 0, 1)');
    },
    'Navigate To Sign Up' : function(browser)
    {
      browser
      .click('span[href="#/signup"]')
      .pause(500)
      .assert.title("Sign Up")
      .assert.containsText('.instructions', 'Create an account')
      .click('span[href="#/login"]')
      .pause(500);
      
    },
    'Forgot my Password' : function(browser)
    {
      browser
      .waitForElementVisible('span[href="#/forgotPassword"]', 1000)
      .click('span[href="#/forgotPassword"].link')
      .pause(500)
      .assert.title("Reset Password")
      .assert.containsText('.forgotPasswordHeaderMsg', "Enter your email to continue")
      .click('img[href="#/login"]')
      .pause(500);
    },
    'Valid Login Attempt' : function(browser)
    {
      browser
      .setValue('input[type=user]', browser.globals.username)
      .setValue('input[type=password]', browser.globals.password)
      .pause(100)
      .click('.buttonLogIn')
      //.click('.buttonLogIn')
      .pause(2000)
      .assert.title("Events");
    },
    'Finished' : function(browser){
      browser.end();
    }
  };