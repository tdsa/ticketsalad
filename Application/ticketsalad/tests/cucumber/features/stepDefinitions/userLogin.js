(function () {

    'use strict';
  
    module.exports = function () {
      this.Given(/^I am an existing user$/, function () {
        var self = this;
  
        return this.server.call('fixtures/reset').then(function() {
          return self.server.call('fixtures/seedData');
        });
      });
      
      
      this.Given(/^I navigate to "([^"]*)"$/, function (relativePath) {
  // Write code here that turns the phrase above into concrete actions
	  /* var query = 'SELECT * FROM rss WHERE url="http://localhost:3000/login' + location + '_' + u + '.xml"';
	    var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000); 
	   var url='http://localhost:3000/login' + + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster; 
	return this.client.
	    url(url.resolve(process.env.ROOT_URL, relativePath)).
	    waitForExist('h1');*/
	    browser.url('http://localhost:3000/#!/login');
    });
      
      this.When(/^I enter my email "([^"]*)" and password "([^"]*)"$/, function (email, password) {
       // return this.client.
          //setValue("[name='email']", email).
          //setValue("[name='password']", password);
	      
	var email=$('.input');
	email.setValue('abc@gmail.com');
	    
	var password =$('.input');
	password.setValue('123');	    
	    //callback.pending();
	console.log(email.getValue());
	console.log(password.getValue());  
	      
      });
  
      this.When(/^I press the login button$/, function () {
        return this.client.
          //submitForm('form');
	      browser.click('input[type="submit"]');
      });
  
      this.Then(/^I should see the events page$/, function () {
        return this.client.
          waitForExist('.jumbotron').
          getText('h1').should.become('Events');
      });
  
    }
  })();