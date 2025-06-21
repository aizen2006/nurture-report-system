
-- Create table for staff-to-child ratio data
CREATE TABLE public.staff_child_ratios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  room TEXT NOT NULL,
  age_group TEXT NOT NULL,
  staff_count INTEGER NOT NULL,
  children_count INTEGER NOT NULL,
  required_ratio TEXT NOT NULL,
  actual_ratio TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('compliant', 'non-compliant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for enrollment and attendance data
CREATE TABLE public.enrollment_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site TEXT NOT NULL,
  date DATE NOT NULL,
  staff_count INTEGER NOT NULL,
  children_enrolled INTEGER NOT NULL,
  children_present INTEGER NOT NULL,
  planned_capacity INTEGER,
  occupancy_rate DECIMAL(5,2) NOT NULL,
  staff_attendance_rate DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_staff_child_ratios_branch_room ON public.staff_child_ratios(branch, room);
CREATE INDEX idx_staff_child_ratios_created_at ON public.staff_child_ratios(created_at);
CREATE INDEX idx_enrollment_attendance_site_date ON public.enrollment_attendance(site, date);
CREATE INDEX idx_enrollment_attendance_date ON public.enrollment_attendance(date);

-- Enable Row Level Security (making tables publicly readable for now)
ALTER TABLE public.staff_child_ratios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_attendance ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (you can modify these later for user-specific access)
CREATE POLICY "Allow public read access to staff_child_ratios" 
  ON public.staff_child_ratios 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow public insert access to staff_child_ratios" 
  ON public.staff_child_ratios 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to staff_child_ratios" 
  ON public.staff_child_ratios 
  FOR UPDATE 
  TO public 
  USING (true);

CREATE POLICY "Allow public delete access to staff_child_ratios" 
  ON public.staff_child_ratios 
  FOR DELETE 
  TO public 
  USING (true);

CREATE POLICY "Allow public read access to enrollment_attendance" 
  ON public.enrollment_attendance 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow public insert access to enrollment_attendance" 
  ON public.enrollment_attendance 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to enrollment_attendance" 
  ON public.enrollment_attendance 
  FOR UPDATE 
  TO public 
  USING (true);

CREATE POLICY "Allow public delete access to enrollment_attendance" 
  ON public.enrollment_attendance 
  FOR DELETE 
  TO public 
  USING (true);
