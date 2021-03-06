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
    console.log("User should be logged out");
    console.log("Current user: " + Meteor.user());
  }

  login()
  {
    let ang = this;

    if(this.username == null || this.pass == null)
    {
      console.log("Missing details, don't allow log in");

      if(this.username == null)
      {
        $(".loginUsr").addClass("error");
      }

      if(this.pass == null)
      {
        $(".loginPass").addClass("error");
      }

      return;
    }

    firebase.auth().signInWithEmailAndPassword(this.username, this.pass).then(function()
    {
      ang.resetAll();
      //this.user = 1;
      ang.$state.go('events');
    }).catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      console.log(errorMessage);
      $(".loginInstructions").text(errorMessage).css("color", "red");
    });
  }

  resetAll()
  {
    $(".loginInstructions").text("Sign in to continue").css("color", "rgb(150, 196, 239)");
  }
}

LoginCtrl.$name = 'LoginCtrl';//To refer to the controller in scope
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
