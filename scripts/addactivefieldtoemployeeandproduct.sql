BEGIN;

ALTER TABLE employee
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true, 

ALTER TABLE productprice
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true, 

COMMIT;
