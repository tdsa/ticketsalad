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

  constructor() {
    super(...arguments);

    this.helpers({
      getUser(){
        this.user = Meteor.user();
        console.log(this.user);
      },
      checkUser()
      {
          if(Meteor.user() == null)
          {
              console.log("No user logged in!");
              this.$state.go('launch');
          }
      }
    });

      this.email = this.callMethod('getEmail');
    }

  save()
  {
    if(this.username != null)
    {
      this.callMethod('updateUsername', this.username);
    }
    if(this.email != null)
    {
      this.callMethod('updateEmail', this.email);
    }
    if(this.passNew1 != null && this.passNew2 != null && this.passOld != null)
    {
      if(this.passNew1 == this.passNew2)
      {
        Accounts.changePassword(this.passOld, this.passNew1, console.log(Error));
      }
    }
    this.$state.go('profile');
  }
}
 
EditProfileCtrl.$name = 'EditProfileCtrl'; //To refer to the controller in scope
EditProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']; // Adds the controller to the routes config
