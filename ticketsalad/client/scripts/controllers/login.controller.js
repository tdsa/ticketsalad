/*
* File Name: login.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: login controller handles all javascript associated with the login html file.
all javascript functions along with the state controllers are placed here. login also handles the process of correctly
logging a user into the app and letting all other views show.

*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class LoginCtrl extends Controller
{
  constructor()
  {
    super(...arguments);
  }

  login()
  {
    let ang = this;

    if(this.username == null || this.pass == null)
    {
      console.log("Missing details, don't allow log in");
      $(".loginInstructions").text("Please enter your details!").css("color", "red");
      return;
    }

    Meteor.loginWithPassword(this.username, this.pass, function (err)
    {
      if (!err) {
          ang.clearInputs();
          ang.resetAll();
          ang.$state.go('events');
      } else {
          console.log(err);
          $(".loginInstructions").text(err).css("color", "red");
      }
    })
  }

  create()
  {
    this.clearInputs();
    this.resetAll();
    this.$state.go('signup');
  }

  forgot()
  {
    this.clearInputs();
    this.resetAll();
    this.$state.go('forgotPassword');
  }

  clearInputs()
  {
    this.username = null;
    this.pass = null;
  }

  resetAll()
  {
    $(".loginInstructions").text("Sign in to continue").css("color", "rgb(150, 196, 239)");
  }
}

LoginCtrl.$name = 'LoginCtrl';//To refer to the controller in scope
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
