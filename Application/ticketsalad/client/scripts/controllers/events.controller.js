/*
* File Name: events.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: events controller handles all javascript associated with the events html file.
all javascript functions along with the state controllers are placed here.
*/
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller 
{
    constructor() 
    {
        super(...arguments);
        
        this.helpers({
          data() {
            return Events.find();
          }
        });
    }


    focusEvent(event)
    {
      console.log(event);
      this.focusevent = event;
    }

    check()
  {
    if(!Meteor.user())
    {
      window.location.href = '#/login';
      this.$state.go('login');
    }
  }

}
EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope

