import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class LoginCtrl extends Controller 
{
  
  login() {
    if (_.isEmpty(this.email)) return;
    if (_.isEmpty(this.pass)) return;
 
    Meteor.loginWithPassword(this.email, this.pass, function (err) {
      if (!err) {
          console.log('I was called because authentication was a success');
          return;
      } else {
          console.log(err);
      }
      })

      if(Meteor.user())
      {
        this.view();
      }     
  }

  view()
  {
    this.$state.go('tab.events');
  }

  create()
  {
    this.$state.go('signup');
  }
}
 
LoginCtrl.$name = 'LoginCtrl';
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];
