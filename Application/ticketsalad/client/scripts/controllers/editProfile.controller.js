import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class EditProfileCtrl extends Controller {

    done()
  {
    this.$state.go('tab.profile');
  }
}
 
EditProfileCtrl.$name = 'EditProfileCtrl';
EditProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];
