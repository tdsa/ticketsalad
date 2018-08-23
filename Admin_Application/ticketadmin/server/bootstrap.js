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
    if(Meteor.users.findOne({ "username" : "TristanJules"}) == null)
    {
        Accounts.createUser({
            username: "TristanJules",
            email: "tristan.jules@gmail.com",
            password: "1009703Troy",
            profile: {
                firstname: "Tristan",
                lastname: "Jules",
                isAdmin: 1
            }
        });
    }
});
