-- Create a function to handle the approval logic
create or replace function handle_order_approval()
returns trigger as $$
begin
  -- Check if status changed to 'preparing' (Approved)
  -- adjusted logic: if status is now 'preparing' and it wasn't before
  if new.status = 'preparing' and (old.status is distinct from 'preparing') then
    -- Generate a random 8 digit code (or use 12345678 as per example)
    -- new.pickup_code := '12345678'; -- Fixed example
    -- Dynamic code:
    new.pickup_code := floor(random() * 90000000 + 10000000)::text;
    
    -- Set ETA to 30 mins from now
    new.eta := now() + interval '30 minutes';
  end if;
  return new;
end;
$$ language plpgsql;

-- Create the trigger
drop trigger if exists on_order_approved on orders;
create trigger on_order_approved
before update on orders
for each row
execute function handle_order_approval();
