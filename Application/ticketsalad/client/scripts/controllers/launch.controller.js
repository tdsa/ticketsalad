/*
* File Name: Launch.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: Launch controller handles all javascript associated with the Launch html file. 
all javascript functions along with the state controllers are placed here. Launch also handles the process of correctly 
logging a user into the app and letting all other views show.

*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class LaunchCtrl extends Controller 
{
  constructor() 
  {
    super(...arguments);
    Meteor.logout();
    console.log("User should be logged out");
    console.log("Current user: " + Meteor.user());
  }

  signIn()
  {
      this.$state.go('login');
  }

  signUp()
  {
      this.$state.go('signup');
  }
}
 
LaunchCtrl.$name = 'LaunchCtrl';//To refer to the controller in scope
LaunchCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
