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
import anime from 'animejs'

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
          return Cards.find({_id: {$in: Meteor.user().profile.cards}});
        }
      });

      this.amount = 0;
      this.inProgress = false;
      this.cardID = null;
    }

    exit()
    {
      this.amount = 0;
      this.$state.go('profile');
    }

    setZero()
    {
      if(this.amount == null || this.amount == "")
      {
        this.amount = 0;
      }
    }

    option(add)
    {
      this.setZero()
      this.amount = parseInt(this.amount) + parseInt(add);
    }

    minus()
    {
      this.setZero()
      this.amount = parseInt(this.amount) - 10;
    }

    add()
    {
      this.setZero()
      this.amount = parseInt(this.amount) + 10;
    }

    showCreditCards()
    {
      if(parseInt(this.amount) == 0 || this.amount == null || this.amount == "")
      {
        return;
      }

      anime({targets: '#creditCardsModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
      this.inProgress = true;
    }

    exitCreditCards()
    {
      anime({targets: '#creditCardsModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    }

    addNewCard()
    {
      anime({targets: '#addCardModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
    }

    editCard(card)
    {
      this.editName = card.name;
      this.editNumber = card.number;
      this.editDate = card.date;
      this.editCvc = card.cvc;
      this.cardID = card._id;
      this.cardNumber = this.editNumber;
      this.name = this.editName;
      this.cvc = this.editCvc;
      this.expiry = this.editDate;

      anime({targets: '#editCardModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
    }

    exitAddNewCard()
    {
      this.name = null;
      this.cardNumber = null;
      this.date = null;
      this.cvc = null;
      this.cardID = null;
      this.expiry = null;
      anime({targets: '#addCardModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    }

    exitEditCard()
    {
      this.editName = null;
      this.editNumber = null;
      this.editDate = null;
      this.editCvc = null;
      this.name = null;
      this.cardNumber = null;
      this.date = null;
      this.cvc = null;
      this.cardID = null;
      this.expiry = null;
      anime({targets: '#editCardModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    }

    deleteEditCard() {

      if(this.cardID != null)
      {
        Cards.remove(this.cardID);
      }

      this.exitEditCard();
    }

    finishAddCard(mode)
    {
      if(this.cardNumber == null)
      {
        $(".cardInstructions").text("Please enter your card number!").css("color", "red");
        return;
      }
      if(this.cardNumber.length != 16)
      {
        $(".cardNumber").css("color", "red");
        $(".cardInstructions").text("Your card number must be 16 digits!").css("color", "red");
        return;
      }
      if(this.name == null)
      {
        $(".cardInstructions").text("Please enter your name!").css("color", "red");
        return;
      }
      if(this.expiry == null)
      {
        $(".cardInstructions").text("Please enter the expiry date!").css("color", "red");
        return;
      }
      if(this.cvc == null)
      {
        $(".cardInstructions").text("Please enter your CVC number!").css("color", "red");
        return;
      }
      if(this.cvc.length != 3)
      {
        $(".cardCVC").css("color", "red");
        $(".cardInstructions").text("Your CVC must be 3 digits!").css("color", "red");
        return;
      }

      var cardType = null;
      var cardPic = null;
      var first = parseInt(this.cardNumber.charAt(0));
      var second = parseInt(this.cardNumber.charAt(0) + this.cardNumber.charAt(1));

      if(first == 4)
      {
        cardType = "visa";
        cardPic = "img/visa.png";
      }
      else if(second >= 51 && second <= 55)
      {
        cardType = "master"
        cardPic = "img/master.png";
      }
      else
      {
        $("#cardNumber").css("color", "red");
        $(".cardInstructions").text("Your card number is incorrect!").css("color", "red");
        return
      }

      var cardID = Cards.insert(
      {
        name: this.name,
        number: this.cardNumber,
        date: this.expiry,
        cvc: this.cvc,
        type: cardType,
        picture: cardPic,
      });

      Meteor.users.update(this.user._id, {$push: {"profile.cards": cardID}});

      if(mode == 2)
      {
        this.deleteEditCard()
        this.exitEditCard()
      }
      else
      {
        this.exitAddNewCard()
      }
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

    resetCardFields()
    {
      $(".cardCVC").css("color", "black");
      $(".cardNumber").css("color", "black");
      $(".cardInstructions").text("");
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
  }

BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];
