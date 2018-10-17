/*
* File Name: events.controller.js
* Version 1.0
*
* Tribus Digita
* Ticket Salad
*
* Functional description: events controller handles all javascript associated with the events html file.
all javascript functions along with the state controllers are placed here.
*/
import { Controller } from 'angular-ecmascript/module-helpers';
import { Events, Notifications } from '../../../lib/collections';
import Moment from 'moment';
import { throws } from 'assert';
import anime from 'animejs'

export default class EventsCtrl extends Controller
{
    constructor()
    {
        super(...arguments);
        let ang = this;

        this.mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          direction: 'horizontal',
          slidesPerView: '1.5',
          centeredSlides: true,
          spaceBetween: 40,
          effect: 'coverflow',

          // If we need pagination
          pagination: {
            el: '.swiper-pagination',
          },

          coverflowEffect: {
            rotate: 30,
            slideShadows: false,
          },

          observer: true
        });

        this.titleIndex = 0;
        this.claimed = false;
        this.expanded = false;
        this.inFocusEvent = null;

        this.helpers({
          data() {
            return Events.find();
          },
          getUser(){
            this.user = Meteor.user();
          },
          checkUser()
          {
              if(Meteor.user() == null)
              {
                  console.log("No user logged in!");
                  this.$state.go('launch');
              }
          }
        });

        $("#hTitle").text(ang.data[0].name + ' - ' + ang.data[0].country + ' ' + ang.data[0].year);

        this.mySwiper.on('slideChange',

          function()
          {
            $("#hTitle").text(ang.data[this.realIndex].name + ' - ' + ang.data[this.realIndex].country + ' ' + ang.data[this.realIndex].year);
            $(".instruction").text("Enter a unique code...");
          }

        );

        $("input").keyup(function()
        {
          var tempCode = $(".overlay").val();

          for(var i = 1; i <= 6; i++)
          {
            if(tempCode[i - 1] != null)
            {
              $(".dg" + i).css("background-color", "rgb(255, 136, 120)");
              $(".idg" + i).css("background-color", "transparent");
            }
            else
            {
              $(".dg" + i).css("background-color", "rgb(235, 235, 235)");
              $(".idg" + i).css("background-color", "rgb(180, 182, 185)");
            }
          }
      });
    }

    expandEvent(mode)
    {
      if(mode == 1)
      {
        this.inFocusEvent = this.data[this.mySwiper.realIndex];
        var expPic = document.querySelector('#expandedPicture');
        expPic.src = this.inFocusEvent.picture;
        $('#expandedEvent').fadeIn(100);
        $('.swiper-container').fadeOut(100);
        $('#expandedEvent').addClass('expandCentre');
        this.expanded = true;
      }
      else
      {
        $('#expandedEvent').removeClass('expandCentre');
        $('#expandedEvent').fadeOut(200);
        $('.swiper-container').fadeIn(250);
        this.inFocusEvent = null;
        this.expanded = false;
      }
    }

    resetCode()
    {
      this.code = null;

      for(var i = 1; i <= 6; i++)
      {
        $(".dg" + i).css("background-color", "rgb(235, 235, 235)");
        $(".idg" + i).css("background-color", "rgb(180, 182, 185)");
      }
    }

    triggerCodeInput()
    {
      console.log("triggered");
      $('#codeInput').trigger('select1');
    }

    claim()
    {
      if(this.user.profile.completed == 0)
      {
        console.log("User has not completed profile!");
        this.openPopUp()
        return;
      }
      var claimIndex = this.mySwiper.realIndex;

      if(this.claimed == true)
      {
        this.reset();
        return;
      }

      var eventFocus = this.data[this.mySwiper.realIndex];
      var userClaims = this.user.profile.credits;
      var eventCost = eventFocus.claims;

      if(eventFocus.claimed == 1)
      {
        console.log("Event already claimed");
        $(".instruction").text("This package has already been claimed!");
        this.resetCode();
        return;
      }

      if(this.code == null)
      {
        console.log("No code entered");
        $(".instruction").text("Enter a code to claim!");
        return;
      }

      console.log("Users balance: " + userClaims);

      if(eventCost > userClaims)
      {
        console.log("Insufficient funds");
        $(".instruction").text("You don't have enough claims!");
        this.resetCode();
        return;
      }

      console.log("User has enough");

      userClaims = userClaims - eventCost;
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});
      userClaims = this.user.profile.credits;
      var dbCode = this.data[claimIndex].code;

      console.log("Debiting users claims balance by " + eventCost);
      console.log("Users new balance: " + userClaims);

      if(!this.data[claimIndex].subscribedUsers.includes(this.user._id))
      {
        Events.update(this.data[claimIndex]._id, {$push: {"subscribedUsers": this.user._id}});
      }

      if(dbCode != this.code)
      {
        console.log("Incorrect code");
        $(".instruction").text("Nope, that's not the one. Try again!");
        this.resetCode();
        return;
      }

      console.log("Correct code");

      $(".instruction").text("Yep, that's the one. Well done!");

      Events.update(this.data[claimIndex]._id,{$set: {"claimed": 1, "winner": this.user}});
      Meteor.users.update(this.user._id, {$push: {"profile.tickets": this.data[claimIndex]._id}});
      this.currentIndex = claimIndex;
      this.win();

      console.log("Correct code");
      console.log(Meteor.user().profile.name + " has won the package");

      this.notify();
    }

    win()
    {
      for(var i = 1; i <= 6; i++)
      {
        $(".dg" + i).css("background-color", "rgb(109, 249, 115)");
        $(".idg" + i).css("background-color", "transparent");
      }

      $(".greenWin").css("background-color", "rgb(109, 249, 115)");
      $(".filler").css("background-color", "rgb(109, 249, 115)");
      $(".eventsHeader").css("background-color", "rgb(109, 249, 115)");
      $("#hTitle").css("color", "white");
      $(".greenWin").css("z-index", 3);
      $(".claimBtnText").text("Great, Got It");
      this.claimed = true;

      var index = this.mySwiper.realIndex;

      var emailText = "Congratulations, you just won " + this.data[index].tickets + " tickets to " + this.data[index].name + ' - ' + this.data[index].country + ' ' + this.data[index].year;

      Meteor.call(
        'sendEmail',
        'bob@example.com',
        'Congratulations from TicketSalad!',
        emailText
      );
    }

    notify()
    {
      var tempIndex = this.mySwiper.realIndex;

      var notificationID = Notifications.insert(
      {
        type: 'Personal',
        description: 'You won ' + this.data[tempIndex].tickets + ' tickets to ' + this.data[tempIndex].name + ' - ' + this.data[tempIndex].country + ' ' + this.data[tempIndex].year + '. \n Congratulations!',
        picture: this.user.profile.picture,
        eventID: this.data[tempIndex]._id,
        subscribedUsers: [this.user.username],
        timestamp: Moment().toDate(),
      });

      Meteor.users.update(this.user._id, {$push: {"profile.notifications": notificationID}});

      notificationID = Notifications.insert(
      {
        type: 'Global',
        description: '@' + this.user.username + ' just took home ' + this.data[tempIndex].tickets + ' tickets to ' + this.data[tempIndex].name + ' - ' + this.data[tempIndex].country + ' ' + this.data[tempIndex].year + '.',
        picture: this.user.profile.picture,
        eventID: this.data[tempIndex]._id,
        subscribedUsers: this.data[tempIndex].subscribedUsers,
        timestamp: Moment().toDate(),
      });

      var subUsers = this.data[tempIndex].subscribedUsers

      for(var i = 0; i < subUsers.length; i++)
      {
        if(subUsers[i] != this.user._id)
        {
          Meteor.call('addNotification', subUsers[i], notificationID)
        }
      }

      notificationID = null;
      console.log("Added notification");
    }

    reset()
    {
      $(".greenWin").css("background-color", "white");
      $(".filler").css("background-color", "white");
      $(".eventsHeader").css("background-color", "white");
      $("#hTitle").css("color", "rgb(64, 64, 64)");
      $(".greenWin").css("z-index", 1);
      $(".claimBtnText").text("Claim");
      this.claimed = false;
      this.resetCode();
      return;
    }

    openPopUp()
    {
      //anime({targets: '#completeDetailsPopUp', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
      $('#completeDetailsPopUp').addClass('slideMenuBottom');
      $('#eventsContainer').addClass('blur');
    }

    closePopUp()
    {
      //anime({targets: '#completeDetailsPopUp', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
      $('#completeDetailsPopUp').removeClass('slideMenuBottom');
      $('#eventsContainer').removeClass('blur');
    }

    completeDetails()
    {
      this.closePopUp();
      this.$state.go("completeProfile");
    }

    goTo(destination)
    {
      this.closeMenu()
      this.$state.go(destination);
    }

    openMenu()
    {
      $('#eventMenuSlide').addClass('slideMenuBottom');
      $('#eventsContainer').addClass('blur');
    }

    closeMenu()
    {
      $('#eventMenuSlide').removeClass('slideMenuBottom');
      $('#eventsContainer').removeClass('blur');
    }

    openSearch()
    {
      this.closeMenu();
      //anime({targets: '#eventsSearchModal', bottom: 0, duration: 500, easing: 'easeInOutQuad'});
      $('#eventsSearchModal').addClass('slideMenuBottom');
    }

    closeSearch()
    {
      $('#eventsSearchModal').removeClass('slideMenuBottom');
      //anime({targets: '#eventsSearchModal', bottom: '-100%', duration: 500, easing: 'easeInOutQuad'});
    }

    findItem(event)
    {
      this.closeSearch();
      this.closeMenu();

      var index = null;

      for(var i = 0; i < this.data.length; i++)
      {
        if(this.data[i]._id == event._id)
        {
            index = i;
        }
      }

      this.mySwiper.slideTo(index);
    }
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
