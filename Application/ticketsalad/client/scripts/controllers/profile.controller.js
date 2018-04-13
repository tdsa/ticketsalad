import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.user = Meteor.user();
    
    //this.ready(this.reload);
    //console.log(this);
    }

  logout() {
    Meteor.logout();

    if(!Meteor.user())
    {
      
      this.user = null;
      //this = null;
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
      this.user = Meteor.user();
    }

    console.log(this.user);
  }

  check()
  {
    if(!Meteor.user())
    {
      window.location.href = '#/login';
      this.$state.go('login');
    }
  }
  
  buyCredits()
  {
    this.$state.go('buyCredits');
  }

}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
