test = {
    'Claim with no code' : function(browser)
    {
        browser
            .click(".eventsClaimBtn")
            .assert.containsText('.instruction', 'Enter a code to claim!')
    }
};