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
 
export default class NewCardCtrl extends Controller {

    constructor()
    {
        super(...arguments);
    }
  }
 
NewCardCtrl.$name = 'NewCardCtrl';
NewCardCtrl.$inject = ['$state', '$ionicPopup', '$log'];