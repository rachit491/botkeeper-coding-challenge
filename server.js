const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require("axios");

let productDetails = [];
let product, inventory;
let url;

const BASE_URL = 'http://autumn-resonance-1298.getsandbox.com';
const HOSTNAME = 'localhost';
const PORT = 3001;

// function to process once products are fetched
function processProductsData(resp) {
	product = resp.data;
	
	url = BASE_URL + '/inventory';
	axios.get(url)
  		.then(processInventoryData)
		  .catch(error => {
		    console.log(error);
		  });
}

// function to process once inventory is fetched
function processInventoryData(resp) {
	inventory = resp.data['inventory'];
	inventory.map(function(x) {
		let found = true;
	  product.map(function(y) {
	    if(x.name == y.name) {
	    	found = false;
	    	productDetails.push({...x, ...y});
	    }
	  });
	  if(found) {
	  	// setting inventory to 0 if not available
	  	x.inventory = 0;
	  	productDetails.push(x);
	  }
	 });

	names = inventory.map(a => a.name);
	product.forEach(function(y) {
	  if(names.indexOf(y.name) < 0) {
	  	// setting price to -1 if not available
	    result.push({
	      'name': y.name, 
	      'price': -1, 
	      'inventory': y.inventory
	    });
	  }
	});
	console.log(productDetails);
	setupEndpoints();
}

// setting up new endpoints
function setupEndpoints() {
	// to list out all products information	
	app.get('/productDetails', (request, response) => {
		if(productDetails.length < 1) {
			// if list not found
			response.status(404)
							.json({ error: [{ message: 'Nothing found!!' }] });
		}
		response.json(productDetails);
	});

	// to list out a specific products information
	app.get('/productDetails/:name', (request, response) => {
		const reqName = request.params.name;
		let prd = productDetails.filter(prd => {
			return prd.name == reqName;
		});
		if(prd.length < 1) {
			// if requested product not found
			response.status(404)
							.json({ 
								error: [{ message: 'Cannot find name: '+reqName+', invalid.' }] 
							});
		}
		response.json(prd[0]);
	});
}

// using axios to load existing endpoints
url = BASE_URL + '/products';
axios.get(url)
  		.then(processProductsData)
		  .catch(error => {
		    console.log(error);
		  });


app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.set('json spaces', 40);

// starting the server
app.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});