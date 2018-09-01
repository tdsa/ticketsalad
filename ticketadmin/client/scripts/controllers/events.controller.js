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

        let ang = this;
        this.imageURL = null;

        this.helpers({
            data() {
              return Events.find();
            },
            getUser() {
                this.user = Meteor.user();
            },
            checkUser()
            {
                var user = firebase.auth().currentUser;
                if (user)
                {
                // User is signed in.
                } else
                {
                  this.$state.go('login');
                }
            }
          });

        this.focusEvent = this.data[0];
        this.open = 0;
        this.user = Meteor.user();

        $('#fileInput').change(function()
        {
            console.log("Here");
            var preview = document.querySelector('#uploadImage');
            var file    = document.querySelector('input[type=file]').files[0];
            var reader  = new FileReader();

            reader.addEventListener("load", function ()
            {
              preview.src = reader.result;
              ang.imageURL = reader.result;
            }, false);

            if (file)
            {
              reader.readAsDataURL(file);
            }
        });
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

    deleteEvent(id)
    {
        Events.remove(id);
        $('#viewEvent').modal('hide');
    }

    addNewEvent()
    {
        if(!this.checkInputs())
        {
            return;
        }

        Events.insert(
            {
                name: this.name,
                city: this.city,
                country: this.country,
                picture: this.imageURL,
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

        var notificationID = Notifications.insert(
            {
                type: 'Event Added',
                description: 'New event available now. \n\n' + this.name + ' - ' + this.country + ' ' + this.yearFrom,
                picture: this.imageURL,
                eventID: null,
                subscribedUsers: [],
                timestamp: Moment().toDate(),
            }
        );

        /*for(var tempUser in Meteor.users.find())
        {
            Meteor.users.update(tempUser._id, {$push: {"profile.notifications": notificationID}});
        }*/
        
        this.name = null;
        this.city = null;
        this.country = null;
        this.claims = null;
        this.tickets = null;
        this.about = null;
        this.tempEvent = null;
        this.imageURL = null;
        this.dayFrom = null;
        this.monthFrom = null;
        this.yearFrom = null;
        this.dayTo = null;
        this.monthTo = null;
        this.yearTo = null;

        document.querySelector('#uploadImage').src = "/img/placeholder.png";

        $('#addEvent').modal('hide');
    }

    checkInputs()
    {
      var filled = true;

      if(this.name == null)
      {
        $('#name').addClass("error");
        filled = false;
      }
      if(this.dayFrom == null)
      {
        $('#df').addClass("error");
        filled = false;
      }
      if(this.monthFrom == null)
      {
        $('#mf').addClass("error");
        filled = false;
      }
      if(this.yearFrom == null)
      {
        $('#yf').addClass("error");
        filled = false;
      }
      if(this.dayTo == null)
      {
        $('#dt').addClass("error");
        filled = false;
      }
      if(this.monthTo == null)
      {
        $('#mt').addClass("error");
        filled = false;
      }
      if(this.yearTo == null)
      {
        $('#yt').addClass("error");
        filled = false;
      }
      if(this.city == null)
      {
        $('#city').addClass("error");
        filled = false;
      }
      if(this.country == null)
      {
        $('#country').addClass("error");
        filled = false;
      }
      if(this.claims == null)
      {
        $('#cost').addClass("error");
        filled = false;
      }
      if(this.tickets == null)
      {
        $('#tickets').addClass("error");
        filled = false;
      }
      if(this.about == null)
      {
        $('#about').addClass("error");
        filled = false;
      }

      return filled;
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
      let ang = this;
        firebase.auth().signOut().then(function()
        {
          ang.$state.go('login');
        }).catch(function(error)
        {
          console.log(error);
        });
    }
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
