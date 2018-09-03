import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class SignupCtrl extends Controller {

  next()
  {
    let ang = this;

    if(this.username == null || this.pass1 == null || this.pass2 == null || this.first == null || this.last == null)
    {
      console.log("Missing details");
      $(".instructions").text("Please enter all your details!").css("color", "red");
      return;
    }

    if(Meteor.users.findOne({username: this.username}) != null)
    {
      console.log("Username taken");
      $(".usr").css("color", "red");
      $(".instructions").text("Username taken!").css("color", "red");
      return;
    }

    if(this.pass1 != this.pass2)
    {
      console.log("Passwords do not match");
      $(".pass").css("color", "red");
      $(".instructions").text("Passwords do not match!").css("color", "red");
      return;
    }

    Accounts.createUser({
      username: this.username,
      password: this.pass1,
      profile:
      {
        firstname: this.first,
        lastname: this.last,
        picture: 'img/user.png',
        completed: 0,
        credits: 0,
        tickets: [],
        isAdmin: 0,
        subscribedEvents: [],
        notifications: [],
        cards: [],
      }
    }, function (err) {
      if (!err) {
          console.log('User ' + this.username + ' successful');
          return;
      } else {
          console.log(err);
      }
    });

    Meteor.loginWithPassword(this.username, this.pass1, function (err) {
      if (!err) {
        ang.login();
        ang.$state.go('events');
      }
      else {
        console.log(err);
      }
    })
  }

  login()
  {
    this.username = null;
    this.first = null;
    this.last = null;
    this.pass1 = null;
    this.pass2 = null;
    this.resetAll();
  }

  resetAll()
  {
    $(".usr").css("color", "black");
    $(".pass").css("color", "black");
    $(".instructions").text("Create an account to continue").css("color", "rgb(150, 196, 239)");
  }

  gotoTC()
  {
    this.$state.go('termsConditions');
  }

}

SignupCtrl.$name = 'SignupCtrl'; //To refer to the controller in scope
SignupCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
