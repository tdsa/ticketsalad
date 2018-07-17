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

      this.mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
    
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },

        observer: true
      });

      this.helpers({
        data() {
          return Meteor.user().profile.cards;
        },
      });
    }

    buyMore()
    {
      if(this.claims != 0)
      {
        var newCredits = parseInt(Meteor.user().profile.credits);
        newCredits += parseInt(this.claims);
        Meteor.users.update(Meteor.userId(), {$set: {"profile.credits": newCredits}});
      }
    }

    addCard() //Takes a user back to their profile page
    {
      this.$state.go('tab.newCard');
        
    }

    updateClaims()
    {
     
      this.claims = this.amount*5;
      
    }

    updateRands()
    {    
      this.amount = this.claims/5;
    }
  }
 
BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];