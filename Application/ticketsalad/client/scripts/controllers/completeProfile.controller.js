import { _ } from 'meteor/underscore';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class CompleteProfileCtrl extends Controller {

    constructor() {
        super(...arguments);
    }
    update()
    {
        var completedProfile = true;
        if(this.name != null)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.name": this.name}});
        }else
        {
            completedProfile = false;
        }
        if(this.surname != null)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.surname": this.surname}});
        }else
        {
            completedProfile = false;
        }
        if(this.number != null)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.cell": this.number}});
        }else
        {
            completedProfile = false;
        }
        if(this.genderM === true)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.gender": "Male"}});
        }
        if(this.genderF === true)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.gender": "Female"}});
        }
        if(this.genderF !== true && this.genderM !== true)
        {
            completedProfile = false;
        }
        if(this.idRadio === true)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.idType": "ID"}});
        }
        if(this.passportRadio === true)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.idType": "Passport"}});
        }

        if(this.idRadio !== true && this.passportRadio !== true)
        {
            completedProfile = false;
        }

        if(this.id != false)
        {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.id": this.id}});
        }else
        {
            completedProfile = false;
        }
        
        Meteor.users.update(Meteor.userId(), {$set: {"profile.completed": completedProfile}});
        this.$state.go("tab.events");
    }


}

CompleteProfileCtrl.$name = 'CompleteProfileCtrl'; //To refer to the controller in scope
CompleteProfileCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
