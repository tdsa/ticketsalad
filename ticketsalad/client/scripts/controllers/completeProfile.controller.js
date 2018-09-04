import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class CompleteProfileCtrl extends Controller {

    constructor() {
        super(...arguments);
        $(".completeDate").valueAsDate = new Date();
    }

    back()
    {
        this.email = null;
        this.dob = null;
        this.gender = null;
        this.resetAll();
        $(".check").prop('checked', false);
        this.$state.go('events');
    }

    finish()
    {
        this.agree = $(".check").is(':checked');

        if(this.email == null || this.dob == null || this.gender == null)
        {
            console.log("Missing details");
            $(".completeInstructions").text("Please enter all your details!").css("color", "red");
            return;
        }

        /*if(this.callMethod('emailBelongsToUser', this.email) == true)
        {
            console.log("Email already in use");
            $(".completeInstructions").text("This email address is already in use!").css("color", "red");
            return;
        }*/

        if(this.agree == false)
        {
            console.log("Not checked");
            $(".completeInstructions").text("Please agree to the Terms & Conditions!").css("color", "red");
            return;
        }

        var id = Meteor.userId();

        Meteor.users.update(id, {$set: {"profile.dob": this.dob}});
        Meteor.users.update(id, {$set: {"profile.gender": this.gender}});
        Meteor.users.update(id, {$set: {"profile.completed": 1}});

        this.callMethod('updateEmail', this.email);
        //this.callMethod('verifyEmailAddress');
        this.resetAll();
        this.$state.go('events');
    }

    resetAll()
    {
        $(".completeInstructions").text("Fill in your details to start claiming").css("color", "rgb(150, 196, 239)");
    }

    terms()
    {
        this.$state.go('termsConditions');
    }
}

CompleteProfileCtrl.$name = 'CompleteProfileCtrl'; //To refer to the controller in scope
CompleteProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
