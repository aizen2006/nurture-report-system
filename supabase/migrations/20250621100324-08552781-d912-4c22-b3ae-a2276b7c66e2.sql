
-- Insert mock data into staff_child_ratios table
INSERT INTO public.staff_child_ratios (branch, room, age_group, staff_count, children_count, required_ratio, actual_ratio, status) VALUES
('Site A', 'Baby Room', '0-2 years', 4, 11, '1:3', '1:2.75', 'compliant'),
('Site A', 'Pre-School Room', '3-5 years', 1, 8, '1:8', '1:8', 'compliant'),
('Site A', 'Toddler Room', '2-3 years', 2, 7, '1:4', '1:3.5', 'compliant'),
('Site B', 'Baby Room', '0-2 years', 3, 9, '1:3', '1:3', 'compliant'),
('Site B', 'Pre-School Room', '3-5 years', 2, 12, '1:8', '1:6', 'compliant'),
('Site B', 'Toddler Room', '2-3 years', 2, 6, '1:4', '1:3', 'compliant'),
('Site C', 'Baby Room', '0-2 years', 4, 13, '1:3', '1:3.25', 'non-compliant'),
('Site C', 'Pre-School Room', '3-5 years', 2, 15, '1:8', '1:7.5', 'compliant'),
('Site C', 'Toddler Room', '2-3 years', 2, 8, '1:4', '1:4', 'compliant');

-- Insert mock data into enrollment_attendance table (fixed the missing date)
INSERT INTO public.enrollment_attendance (site, date, staff_count, children_enrolled, children_present, planned_capacity, occupancy_rate, staff_attendance_rate) VALUES
('Site A', '2025-06-21', 7, 26, 24, 30, 80.00, 95.00),
('Site B', '2025-06-21', 7, 27, 25, 35, 71.43, 100.00),
('Site C', '2025-06-21', 8, 36, 32, 40, 80.00, 90.00),
('Site A', '2025-06-20', 7, 26, 22, 30, 73.33, 85.00),
('Site B', '2025-06-20', 8, 27, 26, 35, 74.29, 100.00),
('Site C', '2025-06-20', 9, 36, 34, 40, 85.00, 95.00),
('Site A', '2025-06-19', 6, 26, 20, 30, 66.67, 80.00),
('Site B', '2025-06-19', 7, 27, 24, 35, 68.57, 90.00),
('Site C', '2025-06-19', 8, 36, 30, 40, 75.00, 85.00);

-- Create room_planner table
CREATE TABLE public.room_planner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site TEXT NOT NULL,
  room_name TEXT NOT NULL,
  age_group TEXT NOT NULL,
  ratio TEXT NOT NULL,
  monday_children INTEGER NOT NULL DEFAULT 0,
  tuesday_children INTEGER NOT NULL DEFAULT 0,
  wednesday_children INTEGER NOT NULL DEFAULT 0,
  thursday_children INTEGER NOT NULL DEFAULT 0,
  friday_children INTEGER NOT NULL DEFAULT 0,
  monday_staff INTEGER NOT NULL DEFAULT 0,
  tuesday_staff INTEGER NOT NULL DEFAULT 0,
  wednesday_staff INTEGER NOT NULL DEFAULT 0,
  thursday_staff INTEGER NOT NULL DEFAULT 0,
  friday_staff INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert mock data into room_planner table
INSERT INTO public.room_planner (site, room_name, age_group, ratio, monday_children, tuesday_children, wednesday_children, thursday_children, friday_children, monday_staff, tuesday_staff, wednesday_staff, thursday_staff, friday_staff) VALUES
('Site A', 'Baby Room', '0-2 years', '1:3', 11, 9, 11, 11, 9, 4, 3, 4, 4, 3),
('Site A', 'Pre-School Room', '3-5 years', '1:8', 8, 9, 10, 7, 6, 1, 1, 1, 1, 1),
('Site A', 'Toddler Room', '2-3 years', '1:4', 7, 8, 6, 7, 6, 2, 2, 2, 2, 2),
('Site B', 'Baby Room', '0-2 years', '1:3', 9, 8, 10, 9, 8, 3, 3, 3, 3, 3),
('Site B', 'Pre-School Room', '3-5 years', '1:8', 12, 11, 13, 10, 9, 2, 1, 2, 1, 1),
('Site B', 'Toddler Room', '2-3 years', '1:4', 6, 7, 5, 6, 7, 2, 2, 1, 2, 2),
('Site C', 'Baby Room', '0-2 years', '1:3', 13, 12, 14, 13, 11, 4, 4, 5, 4, 4),
('Site C', 'Pre-School Room', '3-5 years', '1:8', 15, 14, 16, 13, 12, 2, 2, 2, 2, 2),
('Site C', 'Toddler Room', '2-3 years', '1:4', 8, 9, 7, 8, 8, 2, 2, 2, 2, 2);

-- Enable Row Level Security for room_planner table
ALTER TABLE public.room_planner ENABLE ROW LEVEL SECURITY;

-- Create policies for room_planner table (public access for now)
CREATE POLICY "Allow public read access to room_planner" 
  ON public.room_planner 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow public insert access to room_planner" 
  ON public.room_planner 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to room_planner" 
  ON public.room_planner 
  FOR UPDATE 
  TO public 
  USING (true);

CREATE POLICY "Allow public delete access to room_planner" 
  ON public.room_planner 
  FOR DELETE 
  TO public 
  USING (true);

-- Add indexes for better performance
CREATE INDEX idx_room_planner_site ON public.room_planner(site);
CREATE INDEX idx_room_planner_created_at ON public.room_planner(created_at);
