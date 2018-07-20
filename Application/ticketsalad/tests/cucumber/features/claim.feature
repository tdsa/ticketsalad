Feature: Claim

When I am logged in
I should be able to see events page
And I should be able to claim event
But when credits are zero 
I should be requested to buy more credits

Background:
    Given I am on events page
    when I click on claim I should navigate to "event"

@dev
Scenario: Claiming ticket
    when I press the Claim Now button
    But my credits are zero
    Then I should be asked to buy credits first
    

    
