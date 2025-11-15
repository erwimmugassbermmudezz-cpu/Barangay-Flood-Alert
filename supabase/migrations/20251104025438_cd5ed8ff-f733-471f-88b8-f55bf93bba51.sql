-- Create water_levels table for IoT flood monitoring
CREATE TABLE public.water_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distance FLOAT8 NOT NULL,
  water_height FLOAT8 NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.water_levels ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT access for IoT devices
CREATE POLICY "Allow public insert for IoT devices"
ON public.water_levels
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anyone to view water levels (for the app)
CREATE POLICY "Anyone can view water levels"
ON public.water_levels
FOR SELECT
USING (true);