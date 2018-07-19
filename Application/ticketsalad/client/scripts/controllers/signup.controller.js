import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class SignupCtrl extends Controller {
  
  next() {
    if (_.isEmpty(this.username)) return;
    if (_.isEmpty(this.pass1)) return;
    if (_.isEmpty(this.pass2)) return;
    if (_.isEmpty(this.first)) return;
    if (_.isEmpty(this.last)) return;

    Accounts.createUser({
      username: this.username,
      password: this.pass1,
      profile: 
      {
        firstname: this.first,
        lastname: this.last,
        completed: false,
        credits: 0,
      }
    }, function (err) {
      if (!err) {
          console.log('I was called because creation was a success');
          return;
      } else {
          console.log(err);
      }
    });

    console.log(this.username + " " + this.pass1);

    Meteor.loginWithPassword(this.username, this.pass1, function (err) {
      if (!err) {
          console.log('I was called because authentication was a success');
          return;
      } else {
          console.log(err);
      }
    })

    this.$state.go('completeProfile');
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
