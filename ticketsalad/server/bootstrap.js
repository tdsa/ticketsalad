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
        claims: 4,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 2,
        about: "Tomorrowland is an electronic dance music festival held in Boom, Belgium. Tomorrowland was first held in 2005, and has since become one of the world's largest and most notable music festivals. It now stretches over 2 weekends and usually sells out in minutes.",
        subscribedUsers: [],

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
        about: "Rocking the Daisies is Cape Town's biggest outdoor gathering, and it's become one of the highlights of the festival calendar. The event takes place on the stunning Cloof Wine Estate, just outside Darling, about an hour's drive from Cape Town.",
        subscribedUsers: [],
    },
    {
        name: 'Oppi Koppi',
        city: 'Johannesburg',
        country: 'South Africa',
        picture: 'img/oppi.png',
        year: '2018',
        from: '5 Aug 2018',
        to: 'Oct 7, 2018',
        webpage: 'https://rockingthedaisies.com/',
        credits: '5',
        description: '',
        claims: 3,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 2,
        about: "OppiKoppi is a music festival held in the Limpopo Province of South Africa, near the mining town of Northam. The festival started off focusing mostly on rock music, but gradually added more genres and now plays host to a complete mixed bag of genres.",
        subscribedUsers: [],
    },
    {
        name: 'Holi Festival of Color',
        city: 'Mumbai',
        country: 'India',
        picture: 'img/holi.jpg',
        year: '2019',
        from: '4 March 2019',
        to: 'Oct 7, 2018',
        webpage: 'https://rockingthedaisies.com/',
        credits: '5',
        description: '',
        claims: 1,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 2,
        about: "Holi is an ancient Hindu religious festival which has become popular with non-Hindus in many parts of South Asia, as well as people of other communities outside Asia. In addition to India and Nepal, the festival is celebrated by Indian subcontinent diaspora in countries such as Jamaica.",
        subscribedUsers: [],
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
        claims: 3,
        code: generateCode(),
        claimed: 0,
        winner: null,
        tickets: 1,
        about: "In The City was started in 2012 by Seed Experiences, the same company responsible for the Cape Town festival Rocking The Daisies. As such, both of the festivals have shared headlining acts since In The City's inception in 2012 and the first year's edition hosted Bloc Party as its international headlining act.",
        subscribedUsers: [],
    }];

    events.forEach((event) => {
        const eventId = Events.insert(event); //Inserts into collections
    });

    Cards.remove({});

    const cards = [
    {
        name: 'MR TJA JOSEPH',
        number: "1234567812345678",
        date: "08/2018",
        cvc: "123",
        type: "visa",
        picture: "img/visa.png",
    },
    {
        name: 'MISS L BURRELL',
        number: "1234567812341123",
        date: "06/2019",
        cvc: "123",
        type: "master",
        picture: "img/master.png",
    }
  ];

    cards.forEach((card) => {
        const cardId = Cards.insert(card); //Inserts into collections
    });
});
