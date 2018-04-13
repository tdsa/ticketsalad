/*
* File Name: profile.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: profile controller handles all javascript associated with the profile html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.user = Meteor.user();

    }

  logout() //logs the user out (makes meteor.user = null)
  {
    Meteor.logout();

    if(!Meteor.user()) // checks if the user is logged out
    {
      
      this.user = null;
      this.$state.go('login');
    }
    
  }

  edit() // change view to the editProfile screen
  {
    this.$state.go('editProfile');
  }

  check() //Enforces authorised user
  {
    if(!Meteor.user())
    {
      window.location.href = '#/login';
      this.$state.go('login');
    }
  }
  
  buyCredits() // change view to the buyCrdits screen
  {
    this.$state.go('buyCredits');
  }

}
 
ProfileCtrl.$name = 'ProfileCtrl'; //To refer to the controller in scope
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config
