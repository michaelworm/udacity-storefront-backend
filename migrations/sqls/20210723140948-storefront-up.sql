CREATE TABLE products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(250),
  price INTEGER
);

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(250),
  firstname       VARCHAR(250),
  lastname        VARCHAR(250),
  password_digest VARCHAR(250)
);

CREATE TABLE orders (
  id           SERIAL PRIMARY KEY,
  product_list INTEGER[],
  quantity     INTEGER[],
  user_id      INTEGER REFERENCES users (id),
  status       BOOLEAN
);
