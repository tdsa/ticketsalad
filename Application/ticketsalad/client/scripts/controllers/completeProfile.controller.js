import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class CompleteProfileCtrl extends Controller {

    constructor() {
        super(...arguments);
    }

    back()
    {
        this.email = null;
        this.dob = null;
        this.gender = null;
        this.resetAll();
        this.$state.go('signup');
    }

    signUp()
    {
        this.agree = $(".check").is(':checked');

        if(this.email == null || this.dob == null || this.gender == null)
        {
            console.log("Missing details");
            $(".completeInstructions").text("Please enter all your details!").css("color", "red");
            return;
        }

        if(this.agree == false)
        {
            console.log("Not checked");
            $(".completeInstructions").text("Please agree to the Terms & Conditions!").css("color", "red");
            return;
        }

        var id = Meteor.userId();

        Meteor.users.update(id, {$set: {"profile.dob": this.dob}});
        Meteor.users.update(id, {$set: {"profile.gender": this.gender}});

        Meteor.users.update(id, {$set: {"profile.completed": true}});

        this.callMethod('updateEmail', this.email);

        //this.callMethod('verifyEmailAddress', id);        
        this.resetAll();
        this.$state.go('events');
    }
    
    resetAll()
    {
        $(".completeInstructions").text("Create an account to continue").css("color", "rgb(150, 196, 239)");
    }

    terms()
    {
        this.$state.go('termsConditions');
    }
}

CompleteProfileCtrl.$name = 'CompleteProfileCtrl'; //To refer to the controller in scope
CompleteProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
