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
import { Events, Notifications, Cards } from '../../../lib/collections';
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
        },
        getCards()
        {
          return Cards.find();
        }
      });

      this.amount = 0;
      this.inProgress = false;
    }

    exit()
    {
        this.$state.go('profile');
        this.amount = 0;
    }

    option(add)
    {
      console.log("Current amount: " + parseInt(this.amount));
      console.log("Expected result: " + (parseInt(this.amount) + parseInt(add)));
      this.amount = parseInt(this.amount) + parseInt(add);
      console.log("Actual result: " + parseInt(this.amount));
    }

    showCreditCards()
    {
      $('#creditCardsModal').addClass('slideUpMenuHide');
      this.inProgress = true;
    }

    exitCreditCards()
    {
      $('#creditCardsModal').removeClass('slideUpMenuHide');
    }

    addNewCard()
    {
      $('#addCardModal').addClass('slideUpMenuHide');
    }

    exitAddNewCard()
    {
      $('#addCardModal').removeClass('slideUpMenuHide');
    }

    finishAddCard()
    {
      if(this.cardNumber == null)
      {
        console.log("Error, no account number");
        return;
      }
      if(this.name == null)
      {
        console.log("Error, no name");
        return;
      }
      if(this.expiry == null)
      {
        console.log("Error, no expiry date given");
        return;
      }
      if(this.cvc == null)
      {
        console.log("Error, no cvc");
        return;
      }

      var cardType = null;
      var cardPic = null;

      if(this.cardNumber.substr(0) == '4')
      {
        cardType = "visa";
        cardPic = "img/visa.png";
      }
      else if(parseInt(this.cardNumber.substr(0,1)) >= 51 || parseInt(this.cardNumber.substr(0,1)) <= 55)
      {
        cardType = "master"
        cardPic = "img/master.png";
      }
      else
      {
        console.log("Error, card number incorrect");
        return;
      }

      Cards.insert(
      {
        name: this.name,
        number: this.cardNumber,
        date: this.expiry,
        cvc: this.cvc,
        type: cardType,
        picture: cardPic,
      });

      this.exitAddNewCard()
    }

    completePurchase()
    {
      if(this.inProgress == true)
      {
        this.pay();
      }

      this.inProgress = false;
      this.exitCreditCards();
    }

    pay()
    {
      this.total = 2*parseInt(this.amount);
      var userClaims = this.user.profile.credits;
      var userClaims = parseInt(userClaims) + parseInt(this.amount);
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
