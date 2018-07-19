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
import { Events } from '../../../lib/collections';

export default class EventsCtrl extends Controller 
{
    constructor() 
    {
        super(...arguments);

        this.mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          direction: 'horizontal',
          slidesPerView: '1.4',
          centeredSlides: true,
          spaceBetween: 25,
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

        this.currentIndex = 0;
        
        this.helpers({
          data() {
            return Events.find();
          },

          getUser()
          {
            this.user = Meteor.user();
          },
        });

        this.mySwiper.on('slideChange', function() {$(".instruction").text("Enter a unique code...");});

        $("input").keyup(function()
        {
          var tempCode = $(".overlay").val();

          for(i = 1; i <= 6; i++)
          {
            if(tempCode[i - 1] != null)
            {
              $(".dg" + i).css("background-color", "rgb(230, 148, 115)");
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

    goTo(destination)
    {
      $(".modal").modal("hide");
      this.$state.go(destination);
    }

    closeMenu()
    {
      $(".modal").modal("hide");
    }

    check()
    {
      if(!Meteor.user())
      {
        window.location.href = '#/login';
        this.$state.go('login');
      }

    }

    resetCode()
    {
      this.code = null;

      for(i = 1; i <= 6; i++)
      {
        $(".dg" + i).css("background-color", "rgb(235, 235, 235)");
        $(".idg" + i).css("background-color", "rgb(180, 182, 185)");
      }
    }

    claim()
    {
      Meteor.users.update(this.user._id, {$set: {"profile.credits": 5}});
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
        console.log("Please enter a code");
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

      console.log("Enough");

      userClaims = userClaims - eventCost;
      Meteor.users.update(this.user._id, {$set: {"profile.credits": userClaims}});
      userClaims = this.user.profile.credits;
      var dbCode = this.data[this.mySwiper.realIndex].code;

      if(dbCode != this.code)
      {
        console.log("Incorrect code, try again!");
        $(".instruction").text("Nope, that's not the one. Try again!");
        this.resetCode();
        return;
      }
      $(".instruction").text("Yep, that's the one. Well done!");
      
      Events.update(this.data[this.mySwiper.realIndex]._id,{$set: {"claimed": 1, "winner": this.user}});
      this.resetCode();
      this.currentIndex = this.mySwiper.realIndex;
      this.win();
      console.log("Congratulations! you won, your balance is now " + userClaims);
    }

    win()
    {
      $(".greenWin").css("background-color", "rgb(182, 234, 130)");
      $(".filler").css("background-color", "rgb(182, 234, 130)");
      $(".eventsHeader").css("background-color", "rgb(182, 234, 130)");
      $(".eventTitle").css("color", "white");
      $(".greenWin").css("z-index", 3);
    }

    /*showClaimModal()
    {
      if(Meteor.user().profile.completed)
      {
        if(Meteor.user().profile.credits >= this.focusevent.credits)
        {
          $('#claim').modal(
            {
              onHide: function()
              {
                console.log('hidden');
                $('#success_modal, #failure_modal').addClass('hidden')
              }
            }).modal('show');
        }else
        {
          this.topUpAlert();
        }
      }else
      {
        console.log(this);
        this.completeProfile();
      }
      
    }

    topUpAlert()
    {
      $('#insufficient').modal("show");
    }

    buyClaims()
    {
      $(".modal").modal("hide");
      this.$state.go('tab.eventCredits');
    }

    focusEvent(event)
    {
      console.log(event);
      this.focusevent = event;
    }

    claimEvent()
    {
      console.log("Completed");
      console.log(Meteor.user().profile.completed);
      $("#success_modal, #failure_modal").addClass("hidden");
      if(typeof this.focusevent !== 'undefined')
      {
        console.log("Claim: ");
        console.log(this.focusevent);
        console.log("Code: " + this.claimCode);
        Meteor.users.update(Meteor.userId(), {$inc: {"profile.credits": 0-this.focusevent.credits}});
        var claimEvent = this.focusevent;
        if(claimEvent.code == this.claimCode)
        {
          console.log(Meteor.user());
          var user = Meteor.user();
          Events.update(
            claimEvent._id,
            {
              $set: {"claimed": 1, "winner": user}
            }
          );
          console.log("New Event list:");
          console.log(Events.find());
          $("#success_modal").removeClass("hidden");

        }else
        {
          Events.update(
            claimEvent._id,
            {
              $inc: {"claims": 1}
            }
          );
          $("#failure_modal").removeClass("hidden");
        }
      }
    }
    
    completeProfile()
    {
      $(".modal").modal("hide");
      this.$state.go('tab.completeProfile');
    }
    openClaim(event)
    {
      console.log("openclaim");
      this.focusEvent(event);
      this.showClaimModal();
    }*/
  }



EventsCtrl.$name = 'EventsCtrl'; //To refer to the controller in scope
EventsCtrl.$inject = ['$state', '$ionicPopup', '$log'];// Adds the controller to the routes config
