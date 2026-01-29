-- Add driver_id to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES auth.users(id);

-- Policy to allow drivers to view orders they can take or have taken
-- Assuming we want any authenticated user to be able to be a driver for now,
-- Or we should trust that the app only exposes this to drivers.
-- Ideally, checking a role would be better.

-- Allow read access to orders that are 'preparing' (available to take) or assigned to current user
CREATE POLICY "Drivers can view available or assigned jobs" 
ON public.orders FOR SELECT 
USING (
  (status = 'preparing' AND driver_id IS NULL) OR 
  driver_id = auth.uid()
);

-- Allow updates if the user is the assigned driver or claiming the job
CREATE POLICY "Drivers can update their jobs" 
ON public.orders FOR UPDATE 
USING (
  (status = 'preparing' AND driver_id IS NULL) OR 
  driver_id = auth.uid()
)
WITH CHECK (
  driver_id = auth.uid()
);
