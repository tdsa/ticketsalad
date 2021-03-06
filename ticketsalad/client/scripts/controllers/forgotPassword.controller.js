/*
* File Name: forgotPassword.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: forgotPassword controller handles all javascript associated with the forgotPassword html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Accounts } from 'meteor/accounts-base'

export default class ForgotPasswordCtrl extends Controller {
    constructor() {
        super(...arguments);
    }

    exit()
    {
        this.$state.go('login');
    }

    reset()
    {
        Accounts.forgotPassword(this.email);
        this.email = null;
        this.$state.go('login');
    }
}

ForgotPasswordCtrl.$name = 'ForgotPasswordCtrl'; //To refer to the controller in scope
ForgotPasswordCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config
