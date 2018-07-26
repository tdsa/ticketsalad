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
            },
            getUser() {
                this.user = Meteor.user();
            }
          });
          
        this.focusEvent = this.data[0];
        this.open = 0;
        this.user = Meteor.user();
    }

    openNav() 
    {
        if(this.open == 0)
        {
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("content").style.marginLeft = "250px";
            this.open = 1;
            return;
        }

        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("content").style.marginLeft = "0";
        this.open = 0;
        return;
    }
    
    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("content").style.marginLeft = "0";
    }

    viewEvent(index)
    {
        this.focusEvent = this.data[index];
        $('#viewEvent').modal('show');
    }

    addEvent()
    {
        $('#addEvent').modal('show');
    }

    addNewEvent()
    {
        this.year = this.dateFrom.toString().substr(11, 14);
        this.start = this.dateFrom.toString().substr(4, 14);
        this.end = this.dateTo.toString().substr(4, 14);

        this.tempEvent = {
            name: this.name,
            city: this.city,
            country: this.country,
            picture: 'img/TL.jpg',
            year: this.year,
            from: this.start,
            to: this.end,
            claims: this.claims,
            code: this.generateCode(),
            claimed: 0,
            winner: null,
            tickets: this.tickets,
            about: this.about  
        };

        Events.insert(this.tempEvent);
        this.name = null;
        this.city = null;
        this.country = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.claims = null;
        this.tickets = null;
        this.about = null;
        this.tempEvent = null;
    }

    generateCode()
    {
        var code = "";
        for (var index = 0; index < 6; index++) 
        {
            var digit = Math.floor((Math.random() * 10));
            code += digit + "";
        }
        return code;
    }
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
