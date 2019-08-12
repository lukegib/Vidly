# Vidly
Vidly is a RESTful service (API) built using Node.js, Express.js, and MongoDB. It mimicks a system used by a movie rental company. It was completed through the course [Node.js: The Complete Guide to Build RESTful APIs](https://www.udemy.com/nodejs-master-class/ "Node.js: The Complete Guide to Build RESTful APIs") by Mosh Hamedani.

## What I learned
- All about the Node Module System 
- How to use Node Package Manager
- How to build Restful API's using Express
- What middleware is, how it works and how to create middleware and implement ones by third parties.
- The difference between syncronous and asyncronous javascript, and how to use async functions in javascript.
- Using CRUD operations, and creating schemas and models in MongoDB
- Authentication and Authorization in Node and MongoDB. This included creating a user model in MongoDB, hashing passwords and using JSON Web Tokens.
- How to handle and log errors.
- How to carry out unit and integration tests.
- How to implement Test-Driven-Developmet
- Using heroku and MongoDB in the cloud.

## How to use Vidly
As I have yet to implement a UI, Vidly is not the easiest to use. It requires the use of an application like Postman for Chrome. 

#### creating a new user
To create a new user we need to to first naviagte to /api/users. From here we can post a new user via raw JSON in the body.

The user needs to have the following format:
```json
{
	"name": "name example",
	"email": "example@email.com",
	"password": "password"
}
```

Now you should see a success status and you're new users email and name!

#### logging in
To login we need to navigate to the api/auth route. We enter the username and password via raw JSON in the body and post it.

```json
{
	"username": "willchange",
	"password": "password"
}
```

This will return an auth token which is needed for the next section. So for now we copy the token and paste it into the following location:


#### viewing your profile
Now that we have our x-auth-token we can navigate to the route /api/users/me to see the current logged in user.
####CRUD operations on movies/genres/customers/rentals etc.
Now that we are all set up we can preform CRUD opertions on all the routes. Here are some examples...
###### Posting a new genre
Navingating to /api/genres and using the following model we can post a new genre.
```json
{
	"genre": "genre name"
}
```
###### Getting all customers
This is the simplist operation as it only requires going to /api/movies and calling the GET request

###### Deleting a movie
Using one of the movie ID's we recieved through the above operation we navigate to /api/movies/themovieIDhere. We then send the DELETE request to remove it from the database.

######Updating a customers information
To update a customer information we grab their id and navigate to /api/customers/customersID and we send a PUT request with the updated information as raw JSON in the body. The JSON will be formatted the same as below...
```json
{
	"isGold": true,
	"name": "name name",
	"phone": "12345"
}
```

