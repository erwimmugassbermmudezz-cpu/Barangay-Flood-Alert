-- Drop the water_levels table as we'll use flood_data instead
DROP TABLE IF EXISTS public.water_levels;

-- Ensure flood_data has proper RLS policy for IoT device INSERT
-- First, drop the existing APIKey policy if it exists and create a more specific one
DROP POLICY IF EXISTS "APIIKey" ON public.flood_data;
DROP POLICY IF EXISTS "Allow IoT devices to insert flood data" ON public.flood_data;

-- Allow anonymous INSERT for IoT devices
CREATE POLICY "Allow IoT devices to insert flood data"
ON public.flood_data
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous UPDATE for IoT devices (in case we need to update the single row)
CREATE POLICY "Allow IoT devices to update flood data"
ON public.flood_data
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);