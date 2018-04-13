import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class BuyCreditsCtrl extends Controller {

    done()
  {
    this.$state.go('tab.profile');
  }
}
 
BuyCreditsCtrl.$name = 'BuyCreditsCtrl';
BuyCreditsCtrl.$inject = ['$state', '$ionicPopup', '$log'];