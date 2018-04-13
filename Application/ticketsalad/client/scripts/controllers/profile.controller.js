import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);

    if(Meteor.user())
    {
      this.name = Meteor.user().profile;
    }
  }

  logout() {
    Meteor.logout();

    if(!Meteor.user())
    {
      this.$state.go('tab.login');
    }
    
  }

  edit()
  {
    this.$state.go('editProfile');
  }

  check()
  {
    if(!Meteor.user())
    {
      this.$state.go('tab.login');
    }
  }
  
}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
