ALTER TABLE school 
ADD COLUMN IF NOT EXISTS allowFundsBelowZero boolean, 
DROP CONSTRAINT school_pkey,
DROP COLUMN id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT school_pkey PRIMARY KEY (id);

DROP TABLE recentfood;

ALTER TABLE food
ADD COLUMN idtmp integer;

UPDATE food
SET idtmp = id;

ALTER TABLE foodprice
DROP CONSTRAINT foodprice_schoolname_fkey,
DROP CONSTRAINT foodprice_foodid_fkey,
ADD COLUMN IF NOT EXISTS schoolid uuid REFERENCES school(id),
ADD COLUMN foodidtmp integer;

UPDATE foodprice
SET foodidtmp = foodid;

ALTER TABLE food
DROP CONSTRAINT food_pkey,
DROP COLUMN id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT food_pkey PRIMARY KEY (id);

ALTER TABLE employee
DROP CONSTRAINT employee_pkey,
DROP COLUMN id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT employee_pkey PRIMARY KEY (id),
DROP CONSTRAINT employee_schoolname_fkey,
ADD COLUMN IF NOT EXISTS schoolid uuid REFERENCES school(id);

ALTER TABLE administrator
DROP CONSTRAINT administrator_schoolname_fkey,
ADD COLUMN IF NOT EXISTS schoolid uuid REFERENCES school(id),
DROP CONSTRAINT administrator_pkey,
DROP COLUMN id,
ADD COLUMN id uuid DEFAULT gen_random_uuid(),
ADD CONSTRAINT administrator_pkey PRIMARY KEY (id);

ALTER TABLE foodprice
DROP COLUMN foodid,
ADD COLUMN foodid uuid REFERENCES food(id);

UPDATE employee 
SET schoolid = s.id
FROM school s
WHERE s.name = employee.schoolname;

UPDATE foodprice 
SET schoolid = s.id
FROM school s
WHERE s.name = foodprice.schoolname;

UPDATE foodprice
SET foodid = f.id
FROM food f
WHERE f.idtmp = foodprice.foodidtmp;

UPDATE administrator 
SET schoolid = s.id
FROM school s
WHERE s.name = administrator.schoolname;

ALTER TABLE employee
DROP COLUMN IF EXISTS schoolname;

ALTER TABLE administrator
DROP COLUMN IF EXISTS schoolname;

ALTER TABLE foodprice
DROP COLUMN IF EXISTS schoolname,
DROP COLUMN foodidtmp;

ALTER TABLE food 
DROP COLUMN idtmp;