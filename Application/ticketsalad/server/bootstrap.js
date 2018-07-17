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

    function generateCode()
    {
        var code = "";
        for (var index = 0; index < 5; index++) 
        {
            var digit = Math.floor((Math.random() * 10));
            code += digit + "";
        }
        //Console.log(code);
        return code;
    }
    Events.remove({}); //clears the collection

    const events = [
    {
        name: 'Tomorrowland',
        city: 'Boom',
        country: 'Belgium',
        picture: 'img/TL.jpg',
        year: '2018',
        from: '21 July 2018',
        to: 'Jul 29, 2018',
        webpage: 'https://www.tomorrowland.com/en/festival/welcome',
        credits: '15',
        description: '',
        claims: 1,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 2,
    },
    {
        name: 'Rocking The Daisies',
        city: 'New York',
        country: 'America',
        picture: 'img/RTD.jpg',
        year: '2018',
        from: '5 Oct 2018',
        to: 'Oct 7, 2018',
        webpage: 'https://rockingthedaisies.com/',
        credits: '5',
        description: '',
        claims: 1,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 4,
    },
    {
        name: 'In The City',
        city: 'Moscow',
        country: 'Russia',
        picture: 'img/ITC.png',
        year: '2018',
        from: '7 Oct 2018',
        to: 'Oct 9, 2018',
        webpage: 'http://inthecityjhb.co.za/',
        credits: '5',
        description: '',
        claims: 1,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 1,
    }];

    events.forEach((event) => {
        const eventId = Events.insert(event); //Inserts into collections
    });
});
