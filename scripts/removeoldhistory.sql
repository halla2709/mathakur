BEGIN; 
DELETE FROM public.adminhistory WHERE day < current_timestamp - '6 weeks'::interval;
DELETE FROM public.shoppinghistory WHERE day < current_timestamp - '6 weeks'::interval;
COMMIT;