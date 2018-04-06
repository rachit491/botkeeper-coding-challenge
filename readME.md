# Botkeeper-Coding-Challenge
@author - Rachit Shrivastava
@email - rshriva@ncsu.edu

## Setup
Clone the repo : `git clone https://github.com/rachit491/botkeeper-coding-challenge.git`

`cd botkeeper-coding-challenge`

`npm install`

To run the server, clone the project folder and,

`npm run start` or `npm run dev` 

## ProductDetails Endpoints 

/productDetails - returns all of the products along with each products inventory. It should return an array of products that include the product's name, price and inventory

/productDetails/name - returns a single product and have it return the product name, price and inventory. 

## Assumptions 

1. If an item is present in Inventory but isn't mentioned in Products it's price is marked as -1.
2. If an item is present in Products but isn't mentioned in Inventory it's inventory is set as 0.
3. Same assumptions is made for an entire list of products if not find, prices are marked as -1, and inventories are marked as 0.
4. If a product isn't present in any list, then and error message is displayed.
