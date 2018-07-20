(function () {

    'use strict';
  
    module.exports = function () {
  
      this.Given(/^I am on the events page$/, function () {
        var self = this;
  
        return this.server.call('fixtures/reset').then(function() {
          return self.server.call('fixtures/seedData');
        });
      });
  
      this.When(/^I click on the claim $/, function () {
	browser.url('http://localhost:3000/#!/tab/events');
      });


      this.When(/^I press the claim Now button and my credits are zero $/, function () {
	
		if(updateClaims().claims==0){
	      console.log("FAIL!");
		}
      });
  
      this.Then(/^I should be asked to buy credits first/, function () {
		browser.url("http://localhost:3000/#!/tab/editProfile");
      });
  
    }
  })();