<<<<<<< HEAD
import Moment from 'moment';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Events.find();
      }
    });

  }

  createNew()
  {
    console.log("new");
    this.$state.go('tab.newEvent');
    console.log("gone");
  }

  loadEvent(event)
  {
    console.log("Loading event");
    Session.set("editEvent",event);
  }
}

EventsCtrl.$name = 'EventsCtrl';
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];
=======
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
import { Events, Notifications } from '../../../lib/collections';
import Moment from 'moment';

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
          
        this.focusEvent = this.data[0];
        this.open = 0;
        this.user = Meteor.user();
    }

    uploadImage()
    {
      
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
        Events.insert(
            {
                name: this.name,
                city: this.city,
                country: this.country,
                picture: 'img/TL.jpg',
                year: this.yearFrom,
                from: this.dayFrom.toString() + ' ' + this.monthFrom.toString() + ' ' + this.yearFrom.toString(),
                to: this.dayTo.toString() + ' ' + this.monthTo.toString() + ' ' + this.yearTo.toString(),
                claims: this.claims,
                code: this.generateCode(),
                claimed: 0,
                winner: null,
                tickets: this.tickets,
                about: this.about,
                subscribedUsers: [], 
            }
        );

        Notifications.insert(
            {
                type: 'Event Added',
                description: 'New event available now. \n\n' + this.name + ' - ' + this.country + ' ' + this.yearFrom,
                picture: 'img/TL.jpg',
                eventID: null,
                subscribedUsers: [],
                timestamp: Moment().toDate(),
            }
        );

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

    logout()
    {
        Meteor.logout();
        this.user = null;
        this.$state.go('login');
    }
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
>>>>>>> feature/iOS_Platform
