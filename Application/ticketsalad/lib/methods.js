import { Meteor } from 'meteor/meteor';
import { Events, Notifications } from '../lib/collections';
 
Meteor.methods({
    updatePicture(data) 
    {
        /*if (!this.userId) {
          throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his picture.');
        }*/
     
        check(data, String);
     
        return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
    },

    updateEmail(newEmail)
    {
        Meteor.users.update(this.userId, { $set: { 'email': newEmail } });
    },

    updateUsername(newUser)
    {
        Meteor.users.update(this.userId, { $set: { 'username': newUser } });
    },

    verifyEmailAddress(id)
    {
        Accounts.sendVerificationEmail(id);
    },

    getEmail()
    {
        return Meteor.user().email;
    }
});
