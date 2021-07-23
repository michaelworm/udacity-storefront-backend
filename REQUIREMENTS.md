# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `/products` [GET]
- Show `/products/:id` [GET]
- Create `/products/add` [POST] [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index `/users` [GET] [token required]
- Show `/users/:id` [GET] [token required]
- Create `/users/add` [POST] [token required]

#### Orders
- Current Orders by user (args: user id) `/orders/:userId` [GET] [token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
Table: *products*
- id `SERIAL PRIMARY KEY`
- name `VARCHAR`
- price `INT`
- [OPTIONAL] category

#### User
Table: *users*
- id `SERIAL PRIMARY KEY`
- firstName `VARCHAR`
- lastName `VARCHAR`
- password `VARCHAR`

#### Orders
Table: *orders*
- id `SERIAL PRIMARY KEY`
- id of each product in the order `INT[]`
- quantity of each product in the order `INT[]`
- userId `INT` `FOREIGN KEY(users)`
- status of order (active or complete) `BIT`
