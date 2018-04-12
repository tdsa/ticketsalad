import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class SignupCtrl extends Controller {
  constructor() {
    super(...arguments);
  }
}
 
SignupCtrl.$name = 'SignupCtrl';
SignupCtrl.$inject = ['$state', '$ionicPopup', '$log'];
