First of all create user using sign up as voter or asn an admin

Voter
1. Will log in using the aadhar number and password.
2. In order to change the password you will have to login and take the token and then pass that token as a BEREARER TOKEN to the update the password.
3. In order to see the profile you will have to login and then take that token and pass that token in the authorization as a bearer token and then view your profile.

Admin
1. If you want to add an candidate then you must pass the token which is having the rule as an admin and then pass the data as per the schema in the database in the body of the post request.
2. Similarly if you want to update the data of the candidate then you must pass the token which is having the admin as a role and then update the data in the body of the post request.
3. If you want to delete the candidates from the list then you must pass the token as an admin in the authorization and then run the delete request from the postman.

Vote
Login -> get the token
hit the voting route -> put the id to whome you want to vote.
the vote will be counted.

