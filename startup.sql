
CREATE TABLE public.books (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar(255) NOT NULL,
	thumbnail_image_name varchar(255) NULL,
	description text NULL,
	quantity int4 DEFAULT 0 NOT NULL,
	author varchar(255) NULL,
	publisher varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT books_pkey PRIMARY KEY (id)
);


CREATE TABLE public.users (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	phone varchar(20) NULL,
	address text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


CREATE TABLE public.borrow (
	id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id int4 NOT NULL,
	book_id int4 NOT NULL,
	borrowed_at date DEFAULT CURRENT_DATE NOT NULL,
	due_date date NOT NULL,
	returned_at date NULL,
	status varchar(20) DEFAULT 'BORROWED'::character varying NOT NULL,
	CONSTRAINT borrow_pkey PRIMARY KEY (id)
);

ALTER TABLE public.borrow ADD CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES public.books(id);
ALTER TABLE public.borrow ADD CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES public.users(id);


INSERT INTO public.books
("name", thumbnail_image_name, description, quantity, author, publisher, created_at, updated_at)
VALUES
('Atomic Habits', 'atomic_habits.jpg', 'Book about habit formation', 10, 'James Clear', 'Penguin', '2026-06-20 14:30:41.934', '2026-06-20 14:30:41.934'),
('Clean Code', 'clean_code.jpg', 'Book about writing maintainable code', 5, 'Robert C. Martin', 'Prentice Hall', '2026-06-20 14:30:41.934', '2026-06-20 14:30:41.934'),
('The Alchemist', 'alchemist.jpg', 'Novel about following dreams', 8, 'Paulo Coelho', 'HarperCollins', '2026-06-20 14:30:41.934', '2026-06-20 14:30:41.934'),
('Harry Potter', 'hp.jpg', 'Fantasy novel', 12, 'J.K. Rowling', 'Bloomsbury', '2026-06-20 14:30:41.934', '2026-06-20 14:30:41.934'),
('Deep Work', 'deep_work.jpg', 'Book about focused work', 6, 'Cal Newport', 'Grand Central', '2026-06-20 14:30:41.934', '2026-06-20 14:30:41.934');

INSERT INTO public.users
("name", email, "password", phone, address, created_at)
VALUES
('Gaurav', 'gaurav@example.com', 'pass123', '9876543210', 'Pune', '2026-06-20 14:30:28.106'),
('Rahul', 'rahul@example.com', 'pass123', '9876543211', 'Mumbai', '2026-06-20 14:30:28.106'),
('Sneha', 'sneha@example.com', 'pass123', '9876543212', 'Delhi', '2026-06-20 14:30:28.106'),
('Amit', 'amit@example.com', 'pass123', '9876543213', 'Bangalore', '2026-06-20 14:30:28.106'),
('Priya', 'priya@example.com', 'pass123', '9876543214', 'Hyderabad', '2026-06-20 14:30:28.106');
