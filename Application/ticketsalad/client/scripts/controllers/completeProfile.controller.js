import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class CompleteProfileCtrl extends Controller {

    constructor() {
        super(...arguments);
        console.log(user.profile.firstname);
    }

    signUp()
    {
        user.email = this.email;
        user.profile.dob = this.dob;
        user.profile.gender = this.gender;
        user.profile.completed = true;

        Accounts.createUser({
            username: user.username,
            password: '1234',
            email: user.email,
            profile: 
            {
                firstname: user.first,
                lastname: user.last,
                completed: user.completed,
                credits: 0,
                dob: user.dob,
                gender: user.gender
            }
            });

        this.$state.go('login');
    }
}

CompleteProfileCtrl.$name = 'CompleteProfileCtrl'; //To refer to the controller in scope
CompleteProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
