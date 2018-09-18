/*
* File Name: bootstrap.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: bootstrap handles all javascript associated with creating a mongo collection
*/

//libs
import Moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Events, Notifications, Cards } from '../lib/collections';

Meteor.startup(function()
{
    process.env.MAIL_URL = 'smtp://tristan.jules:1009703Troy@smtp.gmail.com:587/'

    function generateCode()
    {
        var code = "";
        for (var index = 0; index < 6; index++)
        {
            var digit = Math.floor((Math.random() * 10));
            code += digit + "";
        }
        return code;
    }

    Events.remove({}); //clears the collection
});
