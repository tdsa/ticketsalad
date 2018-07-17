import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class SignupCtrl extends Controller {
  
  signup() {
    if (_.isEmpty(this.email)) return;
    if (_.isEmpty(this.pass)) return;
 
      Accounts.createUser({
        email: this.email,
        password: this.pass,
        profile: 
        {
          completed: false,
          credits: 0
        }
      });

      this.$state.go('login', {
        email: this.email,
        password: this.pass
      });
  }

  login()
  {
    this.$state.go('login');
  }


  gotoTC()
  {
    this.$state.go('termsConditions');
  }

}
 
SignupCtrl.$name = 'SignupCtrl'; //To refer to the controller in scope
SignupCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
