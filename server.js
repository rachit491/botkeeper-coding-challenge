/**
 * Botkeeper-Coding-Challenge
 * @author Rachit Shrivastava
 * @email rshriva@ncsu.edu
 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

let productDetails;
let product, inventory;
let url;

const BASE_URL = 'http://autumn-resonance-1298.getsandbox.com';
const HOSTNAME = 'localhost';
const PORT = 3001;

// first callback function when GET /productDetails is invoked
function processProductsData(req, resp, next) {
	productDetails = [];
	product = null;
	// using axios to load existing endpoints
	url = BASE_URL + '/products';
	if(req.params.name) {
		url += '/' + req.params.name;
	}
	axios.get(url)
			.then(function(resp) {
				product = resp.data;
				if(resp.data['product']) {
					product = resp.data['product'];
				}
				next();
			})
			.catch(error => {
		    console.log("Requested Parameter doesn't exists!", error.data);
		    next();
		  });
}

// function to process once products are fetched
function processInventoryData(req, resp, next) {
	inventory = null;
	url = BASE_URL + '/inventory';
	if(req.params.name) {
		url += '/' + req.params.name;
	}
	axios.get(url)
  		.then(function(resp) {
  			inventory = resp.data['inventory'];
  			next();
  		})
		  .catch(error => {		  	
		    console.log("Requested Parameter doesn't exists!", error.data);
		    next();
		  });
}

// function to process results fetched from products & inventory
function merge(pSize, iSize) {
	if(pSize > 0 && iSize > 0) {
		product.forEach(function(x) {
			let found = true;
		  inventory.forEach(function(y) {
		    if(x.name == y.name) {
		    	found = false;
		    	productDetails.push(Object.assign({}, x, y));
		    }
		  });
		  if(found) {
		  	// setting inventory to 0 if not available for particular item
		  	x.inventory = 0;
		  	productDetails.push(x);
		  }
		 });
		names = product.map(a => a.name);
		inventory.forEach(function(y) {
		  if(names.indexOf(y.name) < 0) {
		  	// setting price to -1 if not available for particular item
		    productDetails.push({
		      'name': y.name, 
		      'price': -1, 
		      'inventory': y.inventory
		    });
		  }
		});
	} else if (pSize == 0) {
		// if entire product list is unknown, making price as -1 all inventory
		inventory.forEach(function(y) {
			productDetails.push({
		      'name': y.name, 
		      'price': -1, 
		      'inventory': y.inventory
		    });
		});
	} else if (iSize == 0) {
		// if entire inventory is unknown, marking inventory as 0
		product.forEach(function(x) {
			x.inventory = 0;
			productDetails.push(x);
		});
	}

	//debug
	console.log(productDetails);
}

app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.set('json spaces', 4);

// function to merge the results from given endpoints and make response
function sendResponse(request, response) {
	let pSize = product ? product.length : 0;
	let iSize = inventory ? inventory.length : 0;

	if(request.params.name) {
		if(pSize == 1 && iSize == 0) {
			inventory = [{ "name": product[0].name, "inventory": 0 }];
		} else if(pSize == 0 && iSize == 1) {
			product = [{ "name": inventory[0].name, "price": -1 }];
		} else if(pSize == 0 && iSize == 0) {
			// if param not found
			let msg = request.params.name + ' not found!!';
			response.status(404)
							.json({ error: [{ message: msg }] });
		}
	} else {
		if(pSize == 0 && iSize == 0) {
			// if list not found
			response.status(404)
							.json({ error: [{ message: 'Nothing found!!' }] });
		}
	}
	merge(pSize, iSize);
	response.json(productDetails);
}

// get all product details
app.get('/productDetails', 
	[processProductsData, processInventoryData, sendResponse]
);

// get particular product details
app.get('/productDetails/:name', 
	[processProductsData, processInventoryData, sendResponse]
);

// starting the server
app.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});