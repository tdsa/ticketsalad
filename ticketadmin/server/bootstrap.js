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

Meteor.startup(function()
{
    process.env.MAIL_URL = 'smtp://tristan.jules:1009703Troy@smtp.gmail.com:587/'
});
