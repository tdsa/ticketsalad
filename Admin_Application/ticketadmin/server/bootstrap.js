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
<<<<<<< HEAD
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
});
=======
 
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
>>>>>>> feature/iOS_Platform
