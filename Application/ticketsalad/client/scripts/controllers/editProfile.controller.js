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
 
export default class EditProfileCtrl extends Controller {

    done()
  {
    this.$state.go('tab.profile');
  }
}
 
EditProfileCtrl.$name = 'EditProfileCtrl'; //To refer to the controller in scope
EditProfileCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config
