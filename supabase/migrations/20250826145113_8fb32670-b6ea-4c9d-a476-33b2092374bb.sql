-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  barangay TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ceb')),
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sensors table  
CREATE TABLE public.sensors (
  id TEXT PRIMARY KEY,
  location TEXT NOT NULL,
  water_level_cm DECIMAL(5,2),
  battery_level INTEGER,
  status TEXT DEFAULT 'offline',
  last_reading TIMESTAMP WITH TIME ZONE,
  coordinates JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sensors
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;

-- Sensors policies (readable by all authenticated users)
CREATE POLICY "Authenticated users can view sensors" ON public.sensors
  FOR SELECT TO authenticated USING (true);

-- Only admins can modify sensors
CREATE POLICY "Admins can manage sensors" ON public.sensors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Flood data table (current status)
CREATE TABLE public.flood_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_status TEXT NOT NULL CHECK (current_status IN ('SAFE', 'CAUTION', 'DANGER', 'CRITICAL')),
  water_level_cm DECIMAL(5,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  location TEXT DEFAULT 'Bridge Area'
);

-- Enable RLS on flood_data
ALTER TABLE public.flood_data ENABLE ROW LEVEL SECURITY;

-- Flood data policies (readable by all authenticated users)
CREATE POLICY "Anyone can view flood data" ON public.flood_data
  FOR SELECT USING (true);

-- Only admins can modify flood data
CREATE POLICY "Admins can manage flood data" ON public.flood_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Emergency contacts
CREATE TABLE public.emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  phone TEXT NOT NULL,
  service_type TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on emergency_contacts
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Emergency contacts policies (readable by all)
CREATE POLICY "Anyone can view emergency contacts" ON public.emergency_contacts
  FOR SELECT USING (true);

-- Only admins can modify emergency contacts
CREATE POLICY "Admins can manage emergency contacts" ON public.emergency_contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Safety tips table
CREATE TABLE public.safety_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  english_text TEXT NOT NULL,
  cebuano_text TEXT NOT NULL,
  icon TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on safety_tips
ALTER TABLE public.safety_tips ENABLE ROW LEVEL SECURITY;

-- Safety tips policies (readable by all)
CREATE POLICY "Anyone can view safety tips" ON public.safety_tips
  FOR SELECT USING (true);

-- Only admins can modify safety tips
CREATE POLICY "Admins can manage safety tips" ON public.safety_tips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial flood data
INSERT INTO public.flood_data (current_status, water_level_cm, location) 
VALUES ('CAUTION', 45, 'Bridge Area');

-- Insert sample emergency contacts
INSERT INTO public.emergency_contacts (name, position, phone, service_type, priority) VALUES
  ('Barangay Emergency Hotline', 'Emergency Services', '911', 'Emergency', 1),
  ('Fire Department', 'Fire Response', '116', 'Fire', 2),
  ('Police Station', 'Law Enforcement', '117', 'Police', 2),
  ('Medical Emergency', 'Medical Response', '143', 'Medical', 1),
  ('Barangay Captain Office', 'Local Government', '+63 912 345 6789', 'Government', 3);

-- Insert sample safety tips
INSERT INTO public.safety_tips (category, english_text, cebuano_text, icon, priority) VALUES
  ('Before Flood', 'Keep important documents in waterproof containers', 'Tipigi ang importante nga mga dokumento sa dili ma-tubigan nga sudlanan', 'FileText', 1),
  ('During Flood', 'Move to higher ground immediately', 'Balhin dayon sa mas taas nga lugar', 'ArrowUp', 1),
  ('After Flood', 'Check for structural damage before entering buildings', 'Susiha una kung naay kadaot sa bilding sa dili pa mosulod', 'Shield', 1),
  ('Emergency Kit', 'Prepare emergency supplies: water, food, flashlight, radio', 'Andama ang emergency supplies: tubig, pagkaon, suga, radyo', 'Package', 2);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.flood_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.safety_tips;