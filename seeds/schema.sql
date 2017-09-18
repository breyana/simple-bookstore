DROP DATABASE IF EXISTS simple_bookstore;
CREATE DATABASE simple_bookstore;

\c simple_bookstore

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(255) DEFAULT 'reader'
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  img_url VARCHAR(255),
  price NUMERIC(100, 2),
  in_stock INTEGER,
  ISBN VARCHAR(255),
  publisher VARCHAR(255)
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE authors_books (
  author_id INTEGER REFERENCES authors,
  book_id INTEGER REFERENCES books
);

CREATE TABLE genres_books (
  genre_id INTEGER REFERENCES genres,
  book_id INTEGER REFERENCES books
);
