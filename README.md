# Storefront Backend Project

## Prepare env
- add a `.env` file in the root directory and set the missing `###` environment parameters
```
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_PORT_TEST=5433
POSTGRES_DB=storefront
POSTGRES_USER=###
POSTGRES_PASSWORD=###
BCRYPT_PASSWORD=###
SALT_ROUNDS=10
TOKEN_SECRET=###
```

## Set up

- `docker-compose up` to start the docker container
- `npm install` to install all dependencies
- `npm run db-up` to set up the database and get access via http://127.0.0.1:5432
- `npm run build` to build the app

## Start the app
- `npm run start` to start the app and get access via http://127.0.0.1:3000


## Test the app
- add a `database.json` file in the root directory and set the missing `###` parameters
```
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "port": 5432,
    "database": "storefront",
    "user": "###",
    "password": "###"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "port": 5433,
    "database": "storefront",
    "user": "###",
    "password": "###"
  }
}
```
- `npm run test` to run all tests
