import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class LoginCtrl extends Controller 
{
  
  login() {
    if (_.isEmpty(this.email)) return;
    if (_.isEmpty(this.pass)) return;
 
      Accounts.loggingIn({
        email: this.email,
        password: this.pass,
      });

      this.$state.go('tab.events');
  }
}
 
LoginCtrl.$name = 'LoginCtrl';
LoginCtrl.$inject = ['$state', '$ionicPopup', '$log'];
