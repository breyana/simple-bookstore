\c simple_bookstore

COPY books(id, title, img_url, price, in_stock, isbn, publisher) FROM '/Users/breyana/Documents/Code/simple-bookstore/seeds/books.csv' DELIMITERS ',' CSV;
COPY authors(first_name, last_name) FROM '/Users/breyana/Documents/Code/simple-bookstore/seeds/authors.csv' DELIMITERS ',' CSV;
COPY genres(name) FROM '/Users/breyana/Documents/Code/simple-bookstore/seeds/genres.csv' DELIMITERS ',' CSV;
COPY authors_books(author_id, book_id) FROM '/Users/breyana/Documents/Code/simple-bookstore/seeds/authors_books.csv' DELIMITERS ',' CSV;
COPY genres_books(genre_id, book_id) FROM '/Users/breyana/Documents/Code/simple-bookstore/seeds/genres_books.csv' DELIMITERS ',' CSV;
