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
    //Meteor.users.update({}, {$set : { "services.resume.loginTokens" : [] }}, {multi:true});
    this.$state.go('tab.login');
  }

  edit()
  {
    this.$state.go('editProfile');
  }

  
}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
