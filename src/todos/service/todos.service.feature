Feature: find todos
	As another client of the todos-apis-nestjs api
	When i call the todos service
	I want to retrieve all todos with the findAll method or the find method

Scenario: Valid request to find all todos
	Given a todos service
	When the controler invokes this method
	Then the service responds an array of x elements
