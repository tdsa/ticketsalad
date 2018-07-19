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
  
  login() {
    if (_.isEmpty(this.username))
    {
      return;
    }
    if (_.isEmpty(this.pass)) return;
 
    Meteor.loginWithPassword(this.username, this.pass, function (err) 
    {
      if (!err) {
          console.log('I was called because authentication was a success');
          return;
      } else {
          console.log(err);
      }
    })

      this.$state.go('events');   
  }

  create()
  {
    this.$state.go('signup');
  }

  forgot()
  {
    this.$state.go('forgotPassword');
  }
}
 
LoginCtrl.$name = 'LoginCtrl';//To refer to the controller in scope
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
