import Moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Events } from '../lib/collections';
 
Meteor.startup(function() 
{
    Events.remove({});
    const events = [
    {
        name: 'Tomorrowland',
        picture: 'img/TL.jpg',
        date: 'July 2018',
        claims: 75
    },
    {
        name: 'Rocking The Daisies',
        picture: 'img/RTD.jpg',
        date: 'October 2018',
        claims: 52
    },
    {
        name: 'In The City',
        picture: 'img/ITC.png',
        date: 'August 2018',
        claims: 35
    }];

    events.forEach((event) => {
        const eventId = Events.insert(event);
    });

    //db.users.update({},{$set : {"new_field":1}},false,true)

    /*db.users.aggregate([
        {
          $addFields: {
            claims
          }
        }]);*/
});
