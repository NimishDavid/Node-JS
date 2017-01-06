// ==========================Frameworks=================================

var express = require('express');

var app = express();

var fs = require("fs");

var bodyparser = require("body-parser");

var initial;

var user;


app.use(bodyparser.urlencoded({

	extended : "true"

}));


app.use(bodyparser.json());

// ======================================================================


app.post("/addUser", function(req, res) { // Append user object.

	var data = fs.readFileSync("users.json");

	initial = JSON.parse(data);

	user = req.body;
	    
	initial.push(user);
	    
	initial = JSON.stringify(initial);

	fs.writeFileSync("users.json", initial)

	console.log("User added\nResult : " + initial);

	res.end("User added\nResult : " +initial);

});


app.get("/users", function(req, res) { // View full list of user objects.

	var data = fs.readFileSync("users.json");

	res.end(data);

});


app.delete("/deleteUser/:name", function(req, res) {  // Delete user.

	var userName = req.params.name;

	var data = fs.readFileSync("users.json");

	data = JSON.parse(data);

	var update = data.filter(function(item) {  // Get all users excluding the one to be deleted.

		return (item.name != userName);

	});

	if(data.length==update.length) { // If original data and excluded list data are same length, user is not present in the file.

		console.log("User not present in database");

		res.end("User not present in database");

	}

	else {  // Overwrite the file with the excluded list.

		update = JSON.stringify(update);

		fs.writeFile("users.json", update);
			
		console.log("User deleted");
		
		console.log("Result : " + update);
				
		res.end("User deleted \nResult : " + update);
				
	}

});


app.get("/getUser/:name", function(req, res) { // Get a user record.

	var userName = req.params.name;

	var data = fs.readFileSync("users.json");

	data = JSON.parse(data);

	var update = data.filter(function(item) { // Get the searched object.

		return (item.name == userName);

	});

	update = JSON.stringify(update);

	if(update.length>2) { // User is present.

		res.end(update);

	}

	else { // User is not present in the file.

		res.end("User not present in the database");
				
		console.log("User not present in the database");

	}

});


app.put("/editUser/:name/:age", function(req, res) { // Edit a user's age.

	var userName = req.params.name;

	var age = req.params.age;

	if(!isNaN(age) && age > 0) { // Check if age is a valid number.

		var data = fs.readFileSync("users.json");

		data = JSON.parse(data);

		var userEdit = data.filter(function(item) {

			return (item.name == userName);

		});

		if(userEdit.length>0) {  // User is present.

			var truncated = data.filter(function(item) { // Truncate the searched user from list.

				return (item.name != userName);

			});

			userEdit[0].age = age; // Edit age property.

			truncated.push(userEdit[0]); // Push edited user record in to the truncated records array.

			truncated = JSON.stringify(truncated);


			fs.writeFileSync("users.json", truncated);

			console.log("User details edited\nResult : " + truncated);

			res.end("User details edited\nResult : " +truncated);

		}

		else {

			res.end("User not present in the database");
					
			console.log("User not present in the database");

		}

	}

	else { // Age is invalid.

		console.log("Invalid age");

		res.end("Invalid age");

	}

});

 
var server = app.listen(3000, function () { // Start server.
  
  var port = server.address().port
  
  console.log("Server listening at port : %s", port)

});