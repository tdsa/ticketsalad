(function () {

    'use strict';
  
    module.exports = function () {
  
      this.Given(/^I am an existing user$/, function () {
        var self = this;
  
        return this.server.call('fixtures/reset').then(function() {
          return self.server.call('fixtures/seedData');
        });
      });
  
      this.And(/^$ given I am on the profile page /, function () {
	browser.url('http://localhost:3000/#!/tab/profile');
      });


      this.When(/^I press the logout button $/, function () {
		if(browser.url('http://localhost:3000/#!/tab/profile'))
	      {
		      console.log("Could not logout");
	      }
	      else if(browser.url('http://localhost:3000/#!/login'))
	      {
		      console.log("Logout Successful");
	      }
      });
  
      this.If(/^I press buy credits after logout /, function () {
		if(browser.click('input[class="ui blue button"]'))
		{
			console.log("You need to log in first");
		}
		      
      });
  
    }
  })();