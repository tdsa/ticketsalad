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
    }
});
