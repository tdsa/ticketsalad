/*
* File Name: Section1.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: Section1 controller handles all javascript associated with the Section1 html file.
all javascript functions along with the state controllers are placed here.
*/
import { Controller } from 'angular-ecmascript/module-helpers';
import { Section1 } from '../../../lib/collections';

export default class Section1Ctrl extends Controller 
{
    constructor() 
    {
        super(...arguments);
    }
  }



Section1Ctrl.$name = 'Section1Ctrl'; //To refer to the controller in scope
Section1Ctrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
