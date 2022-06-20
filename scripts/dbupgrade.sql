CREATE EXTENSION pgcrypto;

ALTER TABLE school
RENAME TO company;

ALTER TABLE company
ADD COLUMN IF NOT EXISTS allowFundsBelowZero boolean, 
DROP CONSTRAINT IF EXISTS school_pkey,
DROP COLUMN IF EXISTS id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT company_pkey PRIMARY KEY (id);

DROP TABLE recentfood;

ALTER TABLE food
RENAME TO product;

ALTER TABLE product
ADD COLUMN idtmp integer;

UPDATE product
SET idtmp = id;

ALTER TABLE foodprice
RENAME TO productprice;

ALTER TABLE productprice
DROP CONSTRAINT IF EXISTS foodprice_schoolname_fkey,
DROP CONSTRAINT IF EXISTS foodprice_foodid_fkey,
ADD COLUMN IF NOT EXISTS companyid uuid REFERENCES company(id),
ADD COLUMN foodidtmp integer;

UPDATE productprice
SET foodidtmp = foodid;

ALTER TABLE product
DROP CONSTRAINT IF EXISTS food_pkey,
DROP COLUMN IF EXISTS id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT product_pkey PRIMARY KEY (id);

ALTER TABLE employee
DROP CONSTRAINT IF EXISTS employee_pkey,
DROP COLUMN IF EXISTS id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT employee_pkey PRIMARY KEY (id),
DROP CONSTRAINT IF EXISTS employee_schoolname_fkey,
ADD COLUMN IF NOT EXISTS companyid uuid REFERENCES company(id);

ALTER TABLE administrator
DROP CONSTRAINT IF EXISTS administrator_schoolname_fkey,
DROP CONSTRAINT IF EXISTS administrator_username_key,
ADD COLUMN IF NOT EXISTS companyid uuid REFERENCES company(id),
DROP CONSTRAINT IF EXISTS administrator_pkey,
DROP COLUMN IF EXISTS id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT administrator_pkey PRIMARY KEY (id),
ADD UNIQUE (companyid, username);

ALTER TABLE productprice
DROP COLUMN IF EXISTS foodid,
ADD COLUMN productid uuid REFERENCES product(id);

UPDATE employee 
SET companyid = s.id
FROM company s
WHERE s.name = employee.schoolname;

UPDATE productprice 
SET companyid = s.id
FROM company s
WHERE s.name = productprice.schoolname;

UPDATE productprice
SET productid = f.id
FROM product f
WHERE f.idtmp = productprice.foodidtmp;

UPDATE administrator 
SET companyid = s.id
FROM company s
WHERE s.name = administrator.schoolname;

ALTER TABLE employee
DROP COLUMN IF EXISTS schoolname;

ALTER TABLE administrator
DROP COLUMN IF EXISTS schoolname;

ALTER TABLE productprice
DROP COLUMN IF EXISTS schoolname,
DROP COLUMN IF EXISTS foodidtmp;

ALTER TABLE product 
DROP COLUMN IF EXISTS idtmp;