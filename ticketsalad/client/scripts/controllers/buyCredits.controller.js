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
import { Events, Notifications } from '../../../lib/collections';
import Moment from 'moment';

export default class BuyCreditsCtrl extends Controller {

    constructor()
    {
      super(...arguments);

      this.helpers({
        getUser()
        {
          this.user = Meteor.user();
        },
        checkUser()
        {
            if(Meteor.user() == null)
            {
                console.log("No user logged in!");
                this.$state.go('launch');
            }
        }
      });

      this.amount = 0;
    }

    exit()
    {
        this.$state.go('profile');
        this.amount = 0;
    }

    option(add)
    {
      console.log("Current amount: " + this.amount);
      console.log("Expected result: " + parseInt(this.amount) + add);
      this.amount = parseInt(this.amount) + add;
      console.log("Actual result: " + parseInt(this.amount));
    }

    pay()
    {
      this.total = 2*parseInt(this.amount);
      var userClaims = this.user.profile.credits;
      var userClaims = userClaims + parseInt(this.amount);
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});

      var notificationID = Notifications.insert({
        type: 'Personal',
        description: 'You have successfully purchased ' + this.amount + ' claims. Good luck!',
        picture: this.user.profile.picture,
        eventID: null,
        subscribedUsers: [this.user.username],
        timestamp: Moment().toDate(),
      });

      Meteor.users.update(this.user._id, {$push: {"profile.notifications": notificationID}});

      this.amount = 0;
      notificationID = null;
    }

    minus()
    {
      this.amount = parseInt(this.amount) - 10;
    }

    add()
    {
      this.amount = parseInt(this.amount) + 10;
    }
  }

BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];
