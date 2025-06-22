
-- Add more comprehensive mock data to form_submissions table
INSERT INTO form_submissions (full_name, email, role, submission_data, submitted_at) VALUES
('James Wilson', 'james.wilson@nursery.com', 'Manager', '{
  "nursery_name": "Site A",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_101_children": "12",
    "room_101_staff": "2",
    "room_101_ratio_status": "Correct Ratio",
    "room_102_children": "8",
    "room_102_staff": "1",
    "room_102_ratio_status": "Correct Ratio",
    "staff_absences": "",
    "attendance_trend": "stable",
    "weekly_attendance": "85%",
    "monthly_enrollment": "30"
  },
  "total_questions": 12,
  "answered_questions": 12
}', NOW() - INTERVAL '1 hour'),

('Sophie Chen', 'sophie.chen@nursery.com', 'Deputy Manager', '{
  "nursery_name": "Site B", 
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "no",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_201_children": "15",
    "room_201_staff": "2",
    "room_201_ratio_status": "Incorrect Ratio",
    "room_202_children": "10",
    "room_202_staff": "2",
    "room_202_ratio_status": "Correct Ratio",
    "staff_absences": "John Smith - personal leave",
    "attendance_trend": "increasing",
    "weekly_attendance": "92%",
    "monthly_enrollment": "35"
  },
  "total_questions": 12,
  "answered_questions": 11
}', NOW() - INTERVAL '5 hours'),

('Michael Rodriguez', 'michael.rodriguez@nursery.com', 'Room Leader', '{
  "nursery_name": "Site C",
  "responses": {
    "fire_safety_check": "no",
    "first_aid_certified": "yes",
    "staff_training_complete": "no",
    "safeguarding_concerns": "yes",
    "room_301_children": "20",
    "room_301_staff": "2",
    "room_301_ratio_status": "Incorrect Ratio",
    "staff_absences": "Two staff members sick",
    "attendance_trend": "decreasing",
    "weekly_attendance": "78%",
    "monthly_enrollment": "25"
  },
  "total_questions": 10,
  "answered_questions": 9
}', NOW() - INTERVAL '8 hours'),

('Anna Thompson', 'anna.thompson@nursery.com', 'Area Manager', '{
  "nursery_name": "Site A",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_101_children": "14",
    "room_101_staff": "3",
    "room_101_ratio_status": "Correct Ratio",
    "room_102_children": "6",
    "room_102_staff": "1",
    "room_102_ratio_status": "Correct Ratio",
    "staff_absences": "",
    "attendance_trend": "stable",
    "weekly_attendance": "88%",
    "monthly_enrollment": "32"
  },
  "total_questions": 12,
  "answered_questions": 12
}', NOW() - INTERVAL '2 days'),

('Oliver Davies', 'oliver.davies@nursery.com', 'Manager', '{
  "nursery_name": "Site B",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "no",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_201_children": "18",
    "room_201_staff": "2",
    "room_201_ratio_status": "Incorrect Ratio",
    "room_202_children": "12",
    "room_202_staff": "2",
    "room_202_ratio_status": "Correct Ratio",
    "staff_absences": "Part-time staff unavailable",
    "attendance_trend": "increasing",
    "weekly_attendance": "90%",
    "monthly_enrollment": "38"
  },
  "total_questions": 12,
  "answered_questions": 10
}', NOW() - INTERVAL '1 day'),

('Rachel Green', 'rachel.green@nursery.com', 'Room Leader', '{
  "nursery_name": "Site C",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_301_children": "16",
    "room_301_staff": "3",
    "room_301_ratio_status": "Correct Ratio",
    "staff_absences": "",
    "attendance_trend": "stable",
    "weekly_attendance": "86%",
    "monthly_enrollment": "28"
  },
  "total_questions": 10,
  "answered_questions": 10
}', NOW() - INTERVAL '3 days');
