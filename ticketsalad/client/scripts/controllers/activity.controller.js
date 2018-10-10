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
import { Events, Notifications } from '../../../lib/collections';
import Moment from 'moment';

export default class ActivityCtrl extends Controller {

    constructor() {
        super(...arguments);

        this.contains = 0;

        this.helpers({
            getUser()
            {
                this.user = Meteor.user();
                console.log(this.user);
            },
            checkUser()
            {
                if(Meteor.user() == null)
                {
                    console.log("No user logged in!");
                    this.$state.go('launch');
                }
            },
            updateNotifications()
            {
                return Notifications.find({$or: [{_id: {$in: Meteor.user().profile.notifications}}, {type: 'Event Added'}]});
            },
        });
    }

    clearNotifications()
    {
      var notID = Meteor.user().profile.notifications;

      for(var i = 0; i < notID.length; i++)
      {
        Notifications.remove(notID[i]);
      }
    }

    exit()
    {
        this.$state.go('events');
    }

    getColor(notification)
    {
        if(notification.type == 'Personal')
        {
            return {color: 'rgb(99, 200, 242)'}
        }
        else
        {
            return {color: 'rgb(177, 177, 177)'}
        }
    }
}

ActivityCtrl.$name = 'ActivityCtrl'; //To refer to the controller in scope
ActivityCtrl.$inject = ['$state', '$ionicPopup', '$log']; // Adds the controller to the routes config
