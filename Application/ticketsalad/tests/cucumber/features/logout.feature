Feature: Logout

If I am logged in
I want to be able to logout

Background:
	Given I am an existing user
	And given I am on the profile page "/profile"
	
	
@dev
Scenario: Logging out
	When I press logout button then I should navigate to "/login"
	If I press  buy credits after logout then I should be asked to log in
	
	