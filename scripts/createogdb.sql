DROP TABLE IF EXISTS school CASCADE;
DROP TABLE IF EXISTS food CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS administrator CASCADE;
DROP TABLE IF EXISTS foodprice CASCADE;
DROP TABLE IF EXISTS recentfood CASCADE;

CREATE TABLE school(id SERIAL PRIMARY KEY,
    name varchar(40) UNIQUE NOT NULL,
    password varchar(155) NOT NULL,
    rand varchar(10) NOT NULL);

CREATE TABLE food(id SERIAL PRIMARY KEY,
    name varchar(40) NOT NULL,
    category varchar(40),
    photoUrl varchar(255) DEFAULT 'bazcykvn86tp963v8ocn');

CREATE TABLE employee(id SERIAL PRIMARY KEY,
    name varchar(40) NOT NULL,
    nickname varchar(20),
    credit integer NOT NULL,
    photoUrl varchar(255) DEFAULT 'tzeqj4l6kjyq0jptankn',
    schoolName varchar(40) REFERENCES school(name));

CREATE TABLE administrator(id SERIAL PRIMARY KEY,
    name varchar(40) NOT NULL,
    username varchar(40) UNIQUE NOT NULL,
    password varchar(40) NOT NULL,
    rand varchar(10) NOT NULL,
    schoolName varchar(40) REFERENCES school(name));

CREATE TABLE foodprice(schoolName varchar(40) REFERENCES school(name),
    foodID integer REFERENCES food(id),
    price integer not null);

CREATE TABLE recentfood(employeeID integer REFERENCES employee(id),
    foodID1 integer REFERENCES food(id),
    foodID2 integer REFERENCES food(id),
    foodID3 integer REFERENCES food(id),
    foodID4 integer REFERENCES food(id),
    foodID5 integer REFERENCES food(id));


INSERT INTO public.school (name, password, rand, id) VALUES ('Skolinn', '08ba5a950bda4a9a3b6c143a562969fc', 'W99w2za9MZ', 1);
INSERT INTO public.school (name, password, rand, id) VALUES ('fyrir', '73f7c4578e0a413a5ae3aa8bdfbe1244', 'CiRmVTuOOY', 2);

INSERT INTO public.administrator (id, name, username, password, rand, schoolname) VALUES (1, 'Halla Björk', 'halla', 'b0365e2fd307d6e31a469e20849ef115', 'sYxVLBTEoo', 'Skolinn');
INSERT INTO public.administrator (id, name, username, password, rand, schoolname) VALUES (2, 'Elvar Ingi Ragnarsson', 'elvar', '68eca9c0b6f126b82d541bd09dc651c1', 'Wes8pRvwK0', 'fyrir');

INSERT INTO public.employee (id, name, nickname, credit, photourl, schoolname) VALUES (1, 'Unnur Kristín Brynjólfsdóttir', 'Unnur', 9942, 'tzeqj4l6kjyq0jptankn', 'Skolinn');
INSERT INTO public.employee (id, name, nickname, credit, photourl, schoolname) VALUES (2, 'Halla Björk Ragnarsdóttir', 'Halla', 2117, 'tiqfjnbrqn7ipornvi7d', 'Skolinn');
INSERT INTO public.employee (id, name, nickname, credit, photourl, schoolname) VALUES (3, 'Star', 'Staffiiii', 49790, 'tzeqj4l6kjyq0jptankn', 'fyrir');
INSERT INTO public.employee (id, name, nickname, credit, photourl, schoolname) VALUES (4, 'Fátækur Peningur', 'Fátt', 6, 'tzeqj4l6kjyq0jptankn', 'fyrir');
INSERT INTO public.employee (id, name, nickname, credit, photourl, schoolname) VALUES (5, 'Halla Björk Ragnarsdóttir', 'Halla', 24999640, 's3e07thfj8khahjgdn0d', 'fyrir');

INSERT INTO public.food (id, name, category, photourl) VALUES (1, 'Epli', 'Avoxtur', 'bazcykvn86tp963v8ocn');
INSERT INTO public.food (id, name, category, photourl) VALUES (2, 'Grautur', 'Hadegismatur', 'bazcykvn86tp963v8ocn');
INSERT INTO public.food (id, name, category, photourl) VALUES (3, 'Brauðsneið', 'Brauð', 'bazcykvn86tp963v8ocn');
INSERT INTO public.food (id, name, category, photourl) VALUES (4, 'Epli', 'Avoxtur', 'bazcykvn86tp963v8ocn');

INSERT INTO public.foodprice (schoolname, foodid, price) VALUES ('Skolinn', 1, 50);
INSERT INTO public.foodprice (schoolname, foodid, price) VALUES ('Skolinn', 2, 100);
INSERT INTO public.foodprice (schoolname, foodid, price) VALUES ('Skolinn', 3, 58);
