-- Update site names in enrollment_attendance table
UPDATE enrollment_attendance 
SET site = CASE 
  WHEN site = 'Site A' THEN 'GGS'
  WHEN site = 'Site B' THEN 'Curlew'
  WHEN site = 'Site C' THEN 'LA'
  ELSE site
END;

-- Update site names in room_planner table
UPDATE room_planner 
SET site = CASE 
  WHEN site = 'Site A' THEN 'GGS'
  WHEN site = 'Site B' THEN 'Curlew'
  WHEN site = 'Site C' THEN 'LA'
  ELSE site
END;