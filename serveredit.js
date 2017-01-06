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


app.post("/addUser", function(req, res) {

	var data = fs.readFileSync("users.json");

	initial = JSON.parse(data);

	user = req.body;
	    
	initial.push(user);
	    
	initial = JSON.stringify(initial);

	fs.writeFileSync("users.json", initial)

	console.log("User added\nResult : " + initial);

	res.end("User added\nResult : " +initial);

});


app.get("/users", function(req, res) {

	var data = fs.readFileSync("users.json");

	res.end(data);

});


app.delete("/deleteUser/:name", function(req, res) {

	var userName = req.params.name;

	var data = fs.readFileSync("users.json");

	data = JSON.parse(data);

	var update = data.filter(function(item) {

		return (item.name != userName);

	});

	if(data.length==update.length) {

		console.log("User not present in database");

		res.end("User not present in database");

	}

	else {

		update = JSON.stringify(update);

		fs.writeFile("users.json", update);
			
		console.log("User deleted");
		
		console.log("Result : " + update);
				
		res.end("User deleted \nResult : " + update);
				
	}

});


app.get("/getUser/:name", function(req, res) {

	var userName = req.params.name;

	var data = fs.readFileSync("users.json");

	data = JSON.parse(data);

	var update = data.filter(function(item) {

		return (item.name == userName);

	});

	update = JSON.stringify(update);

	if(update.length>2) {

		res.end(update);

	}

	else {

		res.end("User not present in the database");
				
		console.log("User not present in the database");

	}

});


app.put("/editUser/:name/:age", function(req, res) {

	var userName = req.params.name;

	var age = req.params.age;

	if(!isNaN(age)) {

		var data = fs.readFileSync("users.json");

		data = JSON.parse(data);

		var userEdit = data.filter(function(item) {

			return (item.name == userName);

		});

		if(userEdit.length>0) {

			var truncated = data.filter(function(item) {

				return (item.name != userName);

			});

			userEdit[0].age = age;

			truncated.push(userEdit[0]);

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

	else {

		console.log("Invalid age");

		res.end("Invalid age");

	}

});

 
var server = app.listen(3000, function () {
  
  var port = server.address().port
  
  console.log("Server listening at port : %s", port)

})