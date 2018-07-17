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
        console.log("Current loaded");
        console.log(this.user);
        console.log("Current logged");
        console.log(Meteor.user());
        this.user = Meteor.user();
        console.log("New loaded");
        console.log(this.user);
      }
    });

    }

    done()
  {
    if(this.name != null)
    {
      Meteor.users.update(Meteor.userId(), {$set: {"profile.name": this.name}});
    }
    if(this.surname != null)
    {
      Meteor.users.update(Meteor.userId(), {$set: {"profile.surname": this.surname}});
    }
    if(this.email != null)
    {
    }
    if(this.cell != null)
    {
      Meteor.users.update(Meteor.userId(), {$set: {"profile.cell": this.cell}});
    }

    this.name = this.surname = this.email = this.cell = null;
    this.$state.go('tab.profile');
  }

  updatePicture () {
    MeteorCameraUI.getPicture({ width: 60, height: 60 }, (err, data) => {
      if (err) return this.handleError(err);
 
      this.$ionicLoading.show({
        template: 'Updating picture...'
      });
 
      this.callMethod('updatePicture', data, (err) => {
        this.$ionicLoading.hide();
        this.handleError(err);
      });
    });
  }

  handleError(err) {
    if (err.error == 'cancel') return;
}
}
 
EditProfileCtrl.$name = 'EditProfileCtrl'; //To refer to the controller in scope
EditProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']; // Adds the controller to the routes config
