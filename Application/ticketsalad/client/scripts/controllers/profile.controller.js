import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);
    //this.name = "";
  }

  logout() {
    Meteor.logout();

    if(!Meteor.user())
    {
      this.instance = null;
      this.$state.go('login');
    }
    
  }

  edit()
  {
    this.$state.go('editProfile');
  }

  reload()
  {
    if(Meteor.user())
    {
      this.name = Meteor.user().profile;
    }

    console.log(this.name);
  }

  check()
  {
    if(!Meteor.user())
    {
      window.location.href = '#/login';
      this.$state.go('login');
    }
  }
  
}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
