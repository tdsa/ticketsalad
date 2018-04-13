import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class SignupCtrl extends Controller {
  
  signup() {
    if (_.isEmpty(this.email)) return;
    if (_.isEmpty(this.name)) return;
    if (_.isEmpty(this.pass)) return;
 
      Accounts.createUser({
        email: this.email,
        password: this.pass,
        profile: this.name,
        credits: '0'
      });

      this.$state.go('tab.login', {
        username: this.user,
        email: this.email,
        password: this.pass,
        profile: this.name
      });
  }

}
 
SignupCtrl.$name = 'SignupCtrl';
SignupCtrl.$inject = ['$state', '$ionicPopup', '$log'];