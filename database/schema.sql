-- =========================================================
-- AI STUDY PLANNER - SUPABASE POSTGRESQL SCHEMA
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    college_id TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    semester TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'DEPT_ADMIN')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENTS TABLE (Preferences & Onboarding Profile)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_available_hours NUMERIC(4, 2) DEFAULT 4.0,
    preferred_study_time TEXT DEFAULT 'Evening' CHECK (preferred_study_time IN ('Morning', 'Afternoon', 'Evening', 'Night')),
    weak_topics_summary TEXT,
    study_goals_summary TEXT,
    comfort_preference TEXT DEFAULT 'Balanced',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Low', 'Medium', 'High')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    exam_date DATE,
    target_score INTEGER DEFAULT 85 CHECK (target_score BETWEEN 0 AND 100),
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    confidence TEXT DEFAULT 'Average' CHECK (confidence IN ('Weak', 'Average', 'Strong')),
    last_studied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    exam_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME DEFAULT '10:00:00',
    location TEXT DEFAULT 'Main Campus Hall',
    target_score INTEGER DEFAULT 85,
    preparation_percentage INTEGER DEFAULT 50 CHECK (preparation_percentage BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDY PLANS TABLE
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'AI Generated Study Plan',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived', 'Completed')),
    raw_ai_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES public.study_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    task_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    subject_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    task_type TEXT DEFAULT 'Study' CHECK (task_type IN ('Study', 'Revision', 'Practice')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    reason TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Missed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_hours NUMERIC(4, 2) DEFAULT 0.0,
    tasks_completed INTEGER DEFAULT 0,
    tasks_missed INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 1,
    overall_progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZ RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score_percentage INTEGER NOT NULL,
    answers_json JSONB,
    ai_recommendation TEXT,
    taken_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_result_id UUID REFERENCES public.quiz_results(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT
);

-- 11. COMFORT FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.comfort_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feeling TEXT NOT NULL CHECK (feeling IN ('Very Comfortable', 'Comfortable', 'Normal', 'Stressed', 'Tired', 'Overwhelmed')),
    workload_difficulty TEXT NOT NULL CHECK (workload_difficulty IN ('Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult')),
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BRAIN DUMPS TABLE
CREATE TABLE IF NOT EXISTS public.brain_dumps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    ai_summary TEXT,
    detected_priorities JSONB,
    recommended_plan JSONB,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    target_value INTEGER DEFAULT 100,
    current_value INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Overdue')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON public.topics(user_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_id ON public.study_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_task_date ON public.study_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_comfort_feedback_user_id ON public.comfort_feedback(user_id);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comfort_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can access own record" ON public.students FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own subjects" ON public.subjects FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own topics" ON public.topics FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own exams" ON public.exams FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own study plans" ON public.study_plans FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own tasks" ON public.study_tasks FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own progress" ON public.progress FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own quiz results" ON public.quiz_results FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own comfort feedback" ON public.comfort_feedback FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own brain dumps" ON public.brain_dumps FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own goals" ON public.goals FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own recommendations" ON public.ai_recommendations FOR ALL USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Students can access own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id OR public.is_admin());
