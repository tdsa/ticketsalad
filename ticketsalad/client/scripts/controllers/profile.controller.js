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
import anime from 'animejs'

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

  openPopUp()
  {
    anime({targets: '#completeDetailsPopUpProfile', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
    $('#profileContainer').addClass('blur');
  }

  closePopUp()
  {
    anime({targets: '#completeDetailsPopUpProfile', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    $('#profileContainer').removeClass('blur');
  }

  completeDetails()
  {
    this.closePopUp();
    this.$state.go("completeProfile");
  }

  buyCredits() // change view to the buyCrdits screen
  {
    if(this.user.profile.completed == 0)
    {
      console.log("User has not completed profile!");
      this.openPopUp()
      return;
    }

    this.$state.go('buyCredits');
  }

  goTo(destination)
  {
    this.closeMenu()

    if(destination == "search")
    {
      $('eventsSearchModal').addClass('slideUpMenuHide');
      destination = "events";
    }

    this.$state.go(destination);
  }

  openMenu()
  {
    anime({targets: '#profileMenu', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
    $('#profileContainer').addClass('blur');
  }

  closeMenu()
  {
    anime({targets: '#profileMenu', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    $('#profileContainer').removeClass('blur');
  }

  openHowItWorks()
  {
    anime({targets: '#howItWorksModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
  }

  closeHowItWorks()
  {
    anime({targets: '#howItWorksModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
  }

  openContactUs()
  {
    anime({targets: '#contactUsModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
  }

  closeContactUs()
  {
    anime({targets: '#contactUsModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
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
