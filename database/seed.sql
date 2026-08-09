-- =========================================================
-- AI STUDY PLANNER - SEED DATA FOR DEMO & DEVELOPMENT
-- =========================================================

-- Note: In production Supabase, UUIDs map to auth.users.
-- Below are demo seed values for local testing and initial population.

-- Demo Profile (Sanjay Kumar)
INSERT INTO public.profiles (id, email, full_name, college_id, department, year, semester, role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'sanjay.kumar@college.edu',
    'Sanjay Kumar',
    'AI2026-889',
    'Artificial Intelligence and Data Science',
    'Final Year',
    'Semester 8',
    'STUDENT'
) ON CONFLICT (id) DO NOTHING;

-- Demo Profile (Admin)
INSERT INTO public.profiles (id, email, full_name, college_id, department, year, semester, role)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'admin@college.edu',
    'Academic Administrator',
    'ADM-001',
    'Academic Affairs',
    'Faculty',
    'N/A',
    'ADMIN'
) ON CONFLICT (id) DO NOTHING;

-- Student Preferences
INSERT INTO public.students (user_id, daily_available_hours, preferred_study_time, weak_topics_summary, study_goals_summary, onboarding_completed)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    4.5,
    'Evening',
    'Integration, Quantum Mechanics, Neural Networks Optimization, DBMS Transaction Isolation',
    'Maintain a GPA > 3.8 and master AI Deep Learning models for upcoming campus recruitment.',
    TRUE
) ON CONFLICT (user_id) DO NOTHING;

-- Demo Subjects
INSERT INTO public.subjects (id, user_id, name, code, description, difficulty, priority, exam_date, target_score, progress)
VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Mathematics', 'MAT-401', 'Advanced Calculus, Differential Equations and Linear Algebra', 'High', 'High', CURRENT_DATE + INTERVAL '12 days', 90, 62),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Physics', 'PHY-302', 'Quantum Mechanics, Electromagnetism and Solid State Physics', 'High', 'High', CURRENT_DATE + INTERVAL '16 days', 85, 45),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Artificial Intelligence', 'CSE-501', 'Deep Learning, Convolutional Neural Networks & Natural Language Processing', 'Medium', 'High', CURRENT_DATE + INTERVAL '20 days', 95, 78),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Database Management Systems', 'CSE-402', 'Relational Models, SQL, Transactions, Indexing & NoSQL Architecture', 'Medium', 'Medium', CURRENT_DATE + INTERVAL '25 days', 88, 70),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Computer Networks', 'CSE-405', 'TCP/IP Model, Routing Algorithms, Security Protocol & Wireless Networks', 'Low', 'Medium', CURRENT_DATE + INTERVAL '30 days', 85, 80)
ON CONFLICT (id) DO NOTHING;

-- Demo Topics
INSERT INTO public.topics (id, subject_id, user_id, name, description, difficulty, status, progress, confidence, last_studied_at)
VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Integration by Parts & Substitution', 'Definite and indefinite integration techniques', 'High', 'In Progress', 40, 'Weak', NOW() - INTERVAL '2 days'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Linear Algebra Eigenvalues', 'Matrix diagonalization and characteristic equations', 'Medium', 'Completed', 100, 'Strong', NOW() - INTERVAL '4 days'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Quantum Wave Equations', 'Schrödinger equation and wave function probability', 'High', 'In Progress', 35, 'Weak', NOW() - INTERVAL '1 day'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'Backpropagation & Gradient Descent', 'Optimization algorithms for neural network training', 'Medium', 'In Progress', 75, 'Strong', NOW() - INTERVAL '12 hours'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 'ACID Transactions & Concurrency', 'Locking protocols, 2PL, and isolation levels', 'High', 'In Progress', 60, 'Weak', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Demo Exams
INSERT INTO public.exams (id, user_id, subject_id, exam_name, exam_date, exam_time, location, target_score, preparation_percentage, notes)
VALUES
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Mathematics End-Sem Exam', CURRENT_DATE + INTERVAL '12 days', '09:30:00', 'Hall A - Science Block', 90, 62, 'Focus on Integration formulas and differential equations.'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Physics Mid-Term Evaluation', CURRENT_DATE + INTERVAL '16 days', '14:00:00', 'Hall C - Physics Lab Annex', 85, 45, 'Formula sheet provided. Practice quantum wave equations.')
ON CONFLICT (id) DO NOTHING;

-- Demo Tasks
INSERT INTO public.study_tasks (user_id, task_date, start_time, duration_minutes, subject_name, topic_name, task_type, priority, reason, status)
VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '17:00', 60, 'Mathematics', 'Integration by Parts & Substitution', 'Study', 'High', 'Weak topic with upcoming exam in 12 days', 'Pending'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '18:15', 45, 'Physics', 'Quantum Wave Equations', 'Revision', 'High', 'Spaced repetition due today', 'Pending'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '19:15', 60, 'Artificial Intelligence', 'Backpropagation & Gradient Descent', 'Practice', 'Medium', 'Practice math derivations and code implementation', 'Completed'),
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '20:30', 45, 'Database Management Systems', 'ACID Transactions & Concurrency', 'Study', 'Medium', 'Review isolation levels', 'Pending');

-- Demo Goals
INSERT INTO public.goals (user_id, title, description, target_date, target_value, current_value, status)
VALUES
('00000000-0000-0000-0000-000000000001', 'Daily 4 Hours Study Target', 'Maintain at least 4 study hours every single day', CURRENT_DATE + INTERVAL '30 days', 100, 75, 'Active'),
('00000000-0000-0000-0000-000000000001', 'Complete Mathematics Syllabus', 'Master all 5 calculus modules before the exam', CURRENT_DATE + INTERVAL '10 days', 100, 62, 'Active');

-- Demo AI Recommendations
INSERT INTO public.ai_recommendations (user_id, recommendation_type, content, is_active)
VALUES
('00000000-0000-0000-0000-000000000001', 'Daily Focus', 'Your Mathematics exam is in 12 days. Dedicate today''s first study session to Integration by Parts.', TRUE);
