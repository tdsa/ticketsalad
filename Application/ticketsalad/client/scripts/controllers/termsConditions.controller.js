/*
* File Name: editProfile.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: editProfile controller handles all javascript associated with the editProfile html file.
all javascript functions along with the state controllers are placed here.
*/
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class TermsConditionsCtrl extends Controller {

   constructor()
   {
      super(...arguments);
   }

}
 
TermsConditionsCtrl.$name = 'TermsConditionsCtrl'; //To refer to the controller in scope
TermsConditionsCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config