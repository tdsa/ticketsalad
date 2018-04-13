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
import { Events } from '../lib/collections';
 
Meteor.startup(function() 
{
    Events.remove({}); //clears the collection

    const events = [
    {
        name: 'Tomorrowland',
        city: 'Boom',
        country: 'Belgium',
        picture: 'img/TL.jpg',
        from: 'Jul 21, 2018',
        to: 'Jul 29, 2018',
        webpage: 'https://www.tomorrowland.com/en/festival/welcome',
        credits: '15',
        description: '',
        claims: 75
    },
    {
        name: 'Rocking The Daisies',
        city: 'New York',
        country: 'America',
        picture: 'img/RTD.jpg',
        from: 'Oct 5, 2018',
        to: 'Oct 7, 2018',
        webpage: 'https://rockingthedaisies.com/',
        credits: '5',
        description: '',
        claims: 52
    },
    {
        name: 'In The City',
        city: 'Moscow',
        country: 'Russia',
        picture: 'img/ITC.png',
        from: 'Oct 7, 2018',
        to: 'Oct 9, 2018',
        webpage: 'http://inthecityjhb.co.za/',
        credits: '5',
        description: '',
        claims: 35
    }];

    events.forEach((event) => {
        const eventId = Events.insert(event); //Inserts into collections
    });
});
