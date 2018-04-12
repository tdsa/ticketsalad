import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);

    if(Meteor.user() != null)
    {
      this.name = Meteor.user().profile;
    }
    
  }

  logout() {
    Meteor.logout((err) => {
      if (err) return this.handleError(err);
      this.$state.go('tab.login');
    })
  }

  edit()
  {
    this.$state.go('editProfile');
  }

  
}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
