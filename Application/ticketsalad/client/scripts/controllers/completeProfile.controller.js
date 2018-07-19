import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class CompleteProfileCtrl extends Controller {

    constructor() {
        super(...arguments);
    }

    back()
    {
        this.$state.go('signup');
    }

    signUp()
    {
        var id = Meteor.userId();
        var emailTemp = this.email;

        if(emailTemp != null)
        {
            //Meteor.call('addNewEmail', emailTemp);
        }
        else
        {
            return;
        }

        if(this.dob != null)
        {
            Meteor.users.update(id, {$set: {"profile.dob": this.dob}});
        }
        else
        {
            return;
        }

        if(this.gender != null)
        {
            Meteor.users.update(id, {$set: {"profile.gender": this.gender}});
        }
        else
        {
            return;
        }

        Meteor.users.update(id, {$set: {"profile.completed": true}});
        
        this.$state.go('login');
    }
}

CompleteProfileCtrl.$name = 'CompleteProfileCtrl'; //To refer to the controller in scope
CompleteProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
