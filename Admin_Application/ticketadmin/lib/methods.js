import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';
 
Meteor.methods({
    updatePicture(data) {
        if (!this.userId) {
          throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his picture.');
        }
     
        check(data, String);
     
        return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
    },

    addNewEmail: function(email) {
        'use strict';
        Accounts.addEmail(Meteor.userId(), email);
        Accounts.sendVerificationEmail(Meteor.userId(), email);
        return true;
    },

    userIsAdmin: function(username) {
        if(Accounts.findUserByUsername(username).profile.isAdmin == 1)
        {
            console.log("User is admin!");
            return true;
        }

        return false;
    },
});