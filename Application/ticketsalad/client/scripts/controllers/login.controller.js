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
    Meteor.logout();
    console.log(Meteor.user());
  }

  login() 
  {
    if(this.username == null || this.pass == null)
    {
      console.log("Missing details");
      $(".loginInstructions").text("Please enter your details!").css("color", "red");
      return;
    }

    console.log(Meteor.user());
 
    if(Meteor.user() == null)
    {
      Meteor.loginWithPassword(this.username, this.pass, function (err) 
      {
        if (!err) {
            console.log('I was called because authentication was a success');
            
        } else {
            console.log(err);
            $(".loginInstructions").text(err).css("color", "red");
        }
      })
    }
    else
    {
      this.resetAll();
      this.$state.go('events');
    }

    console.log(Meteor.user());
  }

  create()
  {
    this.$state.go('signup');
  }

  forgot()
  {
    this.$state.go('forgotPassword');
  }

  resetAll()
  {
    $(".loginInstructions").text("Create an account to continue").css("color", "rgb(150, 196, 239)");
  }
}
 
LoginCtrl.$name = 'LoginCtrl';//To refer to the controller in scope
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
