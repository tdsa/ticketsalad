import { Meteor } from 'meteor/meteor';
import { Events, Notifications } from '../lib/collections';
import { Email } from 'meteor/email'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  
    updatePicture(data)
    {
        if (!this.userId) {
          throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his picture.');
        }

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
        Accounts.sendVerificationEmail(Meteor.userId());
    },

    getEmail()
    {
        return Meteor.user().email;
    },

    sendEmail(from, subject, text) {
        var to = Meteor.user().email
        this.unblock();
        Email.send({ to, from, subject, text });
    },


});
