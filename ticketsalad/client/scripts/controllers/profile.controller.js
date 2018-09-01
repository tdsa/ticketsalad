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
import { Controller } from 'angular-ecmascript/module-helpers';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);
    
    this.helpers({
      getUser(){
        this.user = Meteor.user();
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

    }

  logout() //logs the user out (makes meteor.user = null)
  {
    Meteor.logout();
    
    this.user = null;
    this.$state.go('launch');
  }

  editProfile() // change view to the editProfile screen
  {
    this.$state.go('editProfile');
  }

  check() //Enforces authorised user
  {
    if(!Meteor.user())
    {
      window.location.href = '#/launch';
      this.$state.go('launch');
    }
  }
  
  buyCredits() // change view to the buyCrdits screen
  {
    this.$state.go('buyCredits');
  }

  goTo(destination)
  {
    $(".profileModal").modal("hide");

    if(destination == "search")
    {
      $('.eventsSearch').modal({inverted: true}).modal('setting', 'transition', 'fade up').modal('show');
      destination = "events";
    }
    this.$state.go(destination);
  }

  closeMenu()
  {
    $(".profileModal").modal("hide");
  }

  updatePicture () 
  {
    MeteorCameraUI.getPicture({ width: 300, height: 300 }, (err, data) => {
      if (err) return this.handleError(err);
 
      this.callMethod('updatePicture', data, (err) => {
        //this.handleError(err);
      });
    });
  }

  handleError(err) {
    if (err.error == 'cancel') return;
  }
}
 
ProfileCtrl.$name = 'ProfileCtrl'; //To refer to the controller in scope
ProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']; // Adds the controller to the routes config
