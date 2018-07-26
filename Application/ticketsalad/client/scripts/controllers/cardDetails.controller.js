/*
* File Name: editProfile.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: editProfile controller handles all javascript associated with the editProfile html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class CardDetailsCtrl extends Controller {

    constructor() 
    {
        super(...arguments);

        this.helpers({
        getUser()
        {
            this.user = Meteor.user();          
        },
        checkUser()
        {
            if(Meteor.user() == null)
            {
                console.log("No user logged in!");
                this.$state.go('login');
            }
        }
        });
    }

    return()
    {
        this.$state.go('buyCredits');
    }
}
 
CardDetailsCtrl.$name = 'CardDetailsCtrl'; //To refer to the controller in scope
CardDetailsCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']; // Adds the controller to the routes config
