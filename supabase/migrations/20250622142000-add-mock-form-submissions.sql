
-- Insert mock form submissions data
INSERT INTO form_submissions (full_name, email, role, submission_data, submitted_at) VALUES
('John Smith', 'john.smith@nursery.com', 'Manager', '{
  "nursery_name": "Branch A",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "no",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_101_children": "18",
    "room_101_staff": "2",
    "room_101_ratio_status": "Incorrect Ratio",
    "room_102_children": "12",
    "room_102_staff": "2",
    "room_102_ratio_status": "Correct Ratio",
    "staff_absences": "Sarah Johnson - sick leave",
    "attendance_trend": "increasing"
  },
  "total_questions": 10,
  "answered_questions": 10
}', NOW() - INTERVAL '2 hours'),

('Maria Garcia', 'maria.garcia@nursery.com', 'Deputy Manager', '{
  "nursery_name": "Branch B",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "no",
    "staff_training_complete": "no",
    "safeguarding_concerns": "no",
    "room_201_children": "15",
    "room_201_staff": "3",
    "room_201_ratio_status": "Correct Ratio",
    "room_202_children": "8",
    "room_202_staff": "1",
    "room_202_ratio_status": "Incorrect Ratio",
    "staff_absences": "",
    "attendance_trend": "stable"
  },
  "total_questions": 10,
  "answered_questions": 8
}', NOW() - INTERVAL '4 hours'),

('David Wilson', 'david.wilson@nursery.com', 'Room Leader', '{
  "nursery_name": "Branch C",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "no",
    "room_301_children": "12",
    "room_301_staff": "2",
    "room_301_ratio_status": "Correct Ratio",
    "staff_absences": "",
    "attendance_trend": "increasing"
  },
  "total_questions": 8,
  "answered_questions": 8
}', NOW() - INTERVAL '6 hours'),

('Lisa Brown', 'lisa.brown@nursery.com', 'Area Manager', '{
  "nursery_name": "Branch D",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "yes",
    "safeguarding_concerns": "yes",
    "room_401_children": "10",
    "room_401_staff": "2",
    "room_401_ratio_status": "Correct Ratio",
    "room_402_children": "6",
    "room_402_staff": "1",
    "room_402_ratio_status": "Correct Ratio",
    "staff_absences": "Mike Davis - training day",
    "attendance_trend": "decreasing"
  },
  "total_questions": 12,
  "answered_questions": 12
}', NOW() - INTERVAL '1 day'),

('Emma Thompson', 'emma.thompson@nursery.com', 'Manager', '{
  "nursery_name": "Branch A",
  "responses": {
    "fire_safety_check": "yes",
    "first_aid_certified": "yes",
    "staff_training_complete": "no",
    "safeguarding_concerns": "no",
    "room_101_children": "20",
    "room_101_staff": "2",
    "room_101_ratio_status": "Incorrect Ratio",
    "staff_absences": "Two staff members absent",
    "attendance_trend": "increasing"
  },
  "total_questions": 8,
  "answered_questions": 7
}', NOW() - INTERVAL '3 days');
