/*
* File Name: buyCredits.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: buyCredits controller handles all javascript associated with the buyCredits html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class BuyCreditsCtrl extends Controller {

    constructor() 
    {
      super(...arguments);

      this.helpers({
        getUser()
        {
          console.log("Current loaded");
          console.log(this.user);
          console.log("Current logged");
          console.log(Meteor.user());
          this.user = Meteor.user();
          console.log("New loaded");
          console.log(this.user);
          
        }
      });

      this.amount = 0;
    }

    exit()
    {
        this.$state.go('profile');
    }

    option(add)
    {
      console.log("Current amount: " + this.amount);
      console.log("Amount to add: " + add);
      console.log("Expected result: " + this.amount + add);
      this.amount = this.amount + add;
      console.log("Actual result: " + this.amount);
    }

    pay()
    {
      this.total = 2*this.amount;
      var userClaims = this.user.profile.credits;
      var userClaims = userClaims + this.amount;
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});
    }

    minus()
    {
      this.amount = this.amount - 10;
    }

    add()
    {
      this.amount = this.amount + 10;
    }
  }
 
BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];