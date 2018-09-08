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
import anime from 'animejs'

export default class LaunchCtrl extends Controller
{
  constructor()
  {
    super(...arguments);
    Meteor.logout();
    console.log("User should be logged out");
    console.log("Current user: " + Meteor.user());
    anime({targets: '#titleTop', left: '15%', duration: 1000, easing: 'easeInOutQuad'});
    anime({targets: '#titleBottom', right: '15%', duration: 500, delay: 500, easing: 'easeInOutQuad'});
  }

  openHowItWorks()
  {
    anime({targets: '#howItWorksModalLaunch', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
  }

  closeHowItWorks()
  {
    anime({targets: '#howItWorksModalLaunch', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
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
