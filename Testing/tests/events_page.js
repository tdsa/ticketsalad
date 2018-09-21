test = {
    'Claim with no code' : function(browser)
    {
        browser
            .click(".eventsClaimBtn")
            .assert.containsText('.instruction', 'Enter a code to claim!')
            .pause(500)
    },
    'Click on event' : function(browser)
    {
        browser
            .click(".swiper-slide")
            .pause(500)
            .click("#expandedEvent")
            .pause(500)
    },
    /*'Swipe event' : function(browser)
    {
        browser
            .moveTo(".swiper-slide")
            .mouseButtonDown()
            .moveTo(null, -100, 0)
            .mouseButtonUp()
    },*/
    'Click with code entered' : function(browser)
    {
        browser
            .click("#codeInput")
            .keys("1")
            .keys("2")
            .keys("3")
            .keys("4")
            .keys("5")
            .keys("6")
            .click(".eventsClaimBtn")
            .pause(500)
            .verify.containsText('.instruction', 'Nope, that\'s not the one.')
            .click("#codeInput")
            .keys("1")
            .keys("2")
            .keys("3")
            .keys("4")
            .keys("5")
            .keys("6")
            .click(".eventsClaimBtn")
            .pause(500)
            .verify.containsText('.instruction', 'You don\'t have enough claims')
    }
};