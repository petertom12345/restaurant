var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongodbURL = 'mongodb://restaurantdb123:asd123456asd@ds057944.mongolab.com:57944/restaurants';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function Restaurant(building,lon,lat,street,zipcode,borough,cuisine,name,restaurant_id) {
	function Address(building,lon,lat,street,zipcode) {
		this.building = building;
		this.coord = [];
		this.coord.push(lon);
		this.coord.push(lat);
		this.street = street;
		this.zipcode = zipcode;
	}
	this.address = new Address(building,lon,lat,street,zipcode);
	this.borough = borough;
	this.cuisine = cuisine;
	this.grades = [];
	this.name = name;
	this.restaurant_id = restaurant_id;
}

var insertRestaurant = function(db, r, callback) {
	db.collection('abc123').insert(r, function(err,result) {
		    assert.equal(err,null);
		console.log("Insert done");
		callback();
	});
};

app.get('/home', function(req,res) {
	res.sendFile(__dirname + '/index.html');  // serve static files
});

app.get('/insertRestaurant.html', function(req,res) {
	res.sendFile(__dirname + '/insertRestaurant.html');  // serve static files
});

app.post('/',function (req,res) {
	var today = new Date();
	console.log(today.toTimeString());	
		r = new Restaurant(req.body.building,
		                   parseInt(req.body.lon),
		                   parseInt(req.body.lat),
		                   req.body.street,
		                   req.body.zipcode,
		                   req.body.borough,
		                   req.body.cuisine,
		                   req.body.name,
		                   req.body.restaurant_id);
		console.log(r);
		console.log("connecting");
		MongoClient.connect(mongodbURL, function(err, db) {
		console.log("connected");
  			assert.equal(err,null);
  			console.log("connected ready to insert");
			insertRestaurant(db,r,function() {
				db.close();
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.write("Done!\n");
				res.end();
			});
		});
});

app.put('/',function (req,res) {

});

app.listen(process.env.PORT || 8099);
