/*
* File Name: Activity.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: Activity controller handles all javascript associated with the Activity html file.
all javascript functions along with the state controllers are placed here.
*/
import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ActivityCtrl extends Controller {
    
    constructor() {
        super(...arguments);
    }

    exit()
    {
        this.$state.go('events');
    }
}
 
ActivityCtrl.$name = 'ActivityCtrl'; //To refer to the controller in scope
ActivityCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config