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
      }
    });

    }

  save()
  {
    if(this.username != null)
    {
      Accounts.setUsername(this.user.userId, this.username);
    }
    if(this.email != null)
    {
      var email = this.email;
      //Meteor.methods(addNewEmail(this.user.userId, email));
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
