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

    claimEvent()
    {
      $("#success_modal, #failure_modal").addClass("hidden");
      if(typeof this.focusevent !== 'undefined')
      {
        console.log("Claim: ");
        console.log(this.focusevent);
        console.log("Code: " + this.claimCode);
        var claimEvent = this.focusevent;
        if(claimEvent.code == this.claimCode)
        {
          console.log(Meteor.user());
          var user = Meteor.user();
          Events.update(
            claimEvent._id,
            {
              $set: {"claimed": 1, "winner": user}
            }
          );
          console.log("New Event list:");
          console.log(Events.find());
          $("#success_modal").removeClass("hidden");

        }else
        {
          Events.update(
            claimEvent._id,
            {
              $inc: {"claims": 1}
            }
          );
          $("#failure_modal").removeClass("hidden");
        }
      }
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

