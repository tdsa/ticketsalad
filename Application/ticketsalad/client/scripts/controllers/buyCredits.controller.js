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
      $('#fullpage').fullpage({
        verticalCentered: false,
        crollOverflow: false
    });
    }

    done() //Takes a user back to their profile page
    {
      this.$state.go('tab.profile');
        
    }

    add() //Takes a user back to their profile page
    {
      this.$state.go('tab.newCard');
        
    }
  }
 
BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];