import { Meteor } from 'meteor/meteor';
import { Events, Notifications, Cards } from '../lib/collections';
import { Email } from 'meteor/email'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({

    updatePicture(data)
    {
        if (!Meteor.user()._id) {
          throw new Meteor.Error('not-logged-in',
            'Must be logged in to update his picture.');
        }

        return Meteor.users.update(Meteor.user()._id, { $set: { 'profile.picture': data } });
    },

    updateEmail(newEmail)
    {
        Meteor.users.update(Meteor.user()._id, { $set: { 'email': newEmail } });
    },

    updateUsername(newUser)
    {
        Meteor.users.update(Meteor.user()._id, { $set: { 'username': newUser } });
    },

    verifyEmailAddress()
    {
        Accounts.sendVerificationEmail(Meteor.user()._id);
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
    
    emailBelongsToUser(email)
    {
      if(Accounts.findUserByEmail(email) != null)
      {
        return true;
      }

      return false;
    }
});
