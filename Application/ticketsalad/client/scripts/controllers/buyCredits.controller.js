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
        data() {
          return Meteor.user().profile.cards;
        }
      });

      var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
    
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      })
    }

    done() //Takes a user back to their profile page
    {
      this.$state.go('tab.profile');
        
    }

    addCard() //Takes a user back to their profile page
    {
      this.$state.go('tab.newCard');
        
    }
  }
 
BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];