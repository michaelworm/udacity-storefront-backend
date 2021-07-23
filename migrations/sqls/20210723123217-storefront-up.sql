CREATE TABLE products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(250),
  price INTEGER
);

CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  firstName VARCHAR(250),
  lastName  VARCHAR(250),
  password  VARCHAR(24)
);

CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  products   INTEGER[],
  quantities INTEGER[],
  userId     INTEGER REFERENCES users (id),
  status     BIT
);
