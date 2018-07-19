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
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class termsConditionsCtrl extends Controller {

    gotoLogin()
  {

    this.$state.go('login');
  }

}
 
termsConditionsCtrl.$name = 'termsConditionsCtrl'; //To refer to the controller in scope
termsConditionsCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']; // Adds the controller to the routes config