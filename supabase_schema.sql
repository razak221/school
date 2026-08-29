-- ============================================================================
-- GOVT MIDDLE SCHOOL AWANPORA — SUPABASE POSTGRESQL SCHEMA & INITIAL DATA
-- UDISE Code: 01061102301 | Zone Mattan, District Anantnag, J&K
-- Curriculum: J&K SCERT CCE | Scheme: Samagra Shiksha Abhiyan (SSA)
-- ============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. DROP EXISTING TABLES (IF RE-RUNNING)
-- ============================================================================
DROP TABLE IF EXISTS homework CASCADE;
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS mid_day_meals CASCADE;
DROP TABLE IF EXISTS grants_and_fees CASCADE;
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS exam_results CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS parent_profiles CASCADE;
DROP TABLE IF EXISTS teacher_profiles CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS class_sections CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    udise_code VARCHAR(50) NOT NULL UNIQUE,
    zone VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Jammu & Kashmir',
    school_type VARCHAR(50) DEFAULT 'Middle School (1st to 8th)',
    principal_name VARCHAR(100) DEFAULT 'Mohammad Ashraf Bhat',
    contact_phone VARCHAR(50) DEFAULT '+91-9419011122',
    email VARCHAR(100) DEFAULT 'gmsawanpora@gmail.com',
    academic_year VARCHAR(50) DEFAULT '2026-2027',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class Sections
CREATE TABLE class_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(10) DEFAULT 'A',
    grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 8),
    room_number VARCHAR(50) DEFAULT 'Room 101',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, class_name, section)
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, username)
);

-- Teacher Profiles
CREATE TABLE teacher_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) DEFAULT 'M.Sc, B.Ed',
    subjects_taught TEXT[] DEFAULT ARRAY['General'],
    joining_date DATE DEFAULT '2018-04-01',
    emergency_contact VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    admission_number VARCHAR(50) NOT NULL,
    roll_number INTEGER NOT NULL,
    class_id UUID REFERENCES class_sections(id) ON DELETE CASCADE,
    section VARCHAR(10) DEFAULT 'A',
    gender VARCHAR(20) DEFAULT 'male' CHECK (gender IN ('male', 'female', 'other')),
    dob DATE NOT NULL DEFAULT '2012-05-15',
    father_name VARCHAR(100) NOT NULL,
    mother_name VARCHAR(100) NOT NULL,
    address TEXT DEFAULT 'Awanpora, Mattan, Anantnag',
    blood_group VARCHAR(10) DEFAULT 'O+',
    mid_day_meal_opted BOOLEAN DEFAULT true,
    ssa_category VARCHAR(50) DEFAULT 'RBA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent Profiles
CREATE TABLE parent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    relation VARCHAR(50) DEFAULT 'father' CHECK (relation IN ('father', 'mother', 'guardian')),
    occupation VARCHAR(100) DEFAULT 'Agriculture / Horticulture',
    address TEXT DEFAULT 'Awanpora, Mattan, Anantnag',
    alternate_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_sections(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'leave', 'holiday')),
    mid_day_meal_served BOOLEAN DEFAULT true,
    marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, student_id, date)
);

-- Exam Results (SCERT CCE)
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_sections(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) NOT NULL,
    term VARCHAR(50) DEFAULT 'Term 1',
    subject_marks JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_max NUMERIC(10,2) DEFAULT 500,
    total_obtained NUMERIC(10,2) DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0,
    overall_grade VARCHAR(10) DEFAULT 'A',
    ai_remarks TEXT,
    teacher_remarks TEXT,
    evaluated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices & Circulars
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Academic' CHECK (category IN ('Academic', 'Event', 'Holiday', 'SSA Scheme', 'Emergency', 'General')),
    target_audience VARCHAR(50) DEFAULT 'All' CHECK (target_audience IN ('All', 'Teachers', 'Parents', 'Students')),
    published_by VARCHAR(100) DEFAULT 'Headmaster Office',
    is_pinned BOOLEAN DEFAULT false,
    translations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grants & Funds (SSA Composite)
CREATE TABLE grants_and_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    scheme_type VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) DEFAULT '2026-2027',
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    amount NUMERIC(12,2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Composite School Grant',
    description TEXT,
    bill_number VARCHAR(100),
    voucher_date DATE DEFAULT CURRENT_DATE,
    approved_by VARCHAR(100) DEFAULT 'Mohammad Ashraf Bhat (Headmaster)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PM-POSHAN Mid-Day Meal Logs
CREATE TABLE mid_day_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    menu_served VARCHAR(255) NOT NULL,
    students_served INTEGER NOT NULL,
    rice_consumed_kg NUMERIC(6,2) DEFAULT 25.0,
    vegetable_cost NUMERIC(10,2) DEFAULT 450.0,
    cook_name VARCHAR(100) DEFAULT 'Fatima Begum & Shameema Bano',
    quality_checked_by VARCHAR(100) DEFAULT 'Farooq Ahmad Dar (Duty Teacher)',
    quality_rating VARCHAR(20) DEFAULT 'Excellent',
    remarks TEXT DEFAULT 'Fresh hygienic hot lunch served as per PM-POSHAN menu guidelines.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timetables
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_sections(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    periods JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, class_id, day_of_week)
);

-- Homework Assignments
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES class_sections(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants_and_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE mid_day_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Create Open Read/Write Policies for authenticated and anon clients (Data API)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public select on %I" ON %I;', t, t);
        EXECUTE format('CREATE POLICY "Public select on %I" ON %I FOR SELECT USING (true);', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Public insert on %I" ON %I;', t, t);
        EXECUTE format('CREATE POLICY "Public insert on %I" ON %I FOR INSERT WITH CHECK (true);', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Public update on %I" ON %I;', t, t);
        EXECUTE format('CREATE POLICY "Public update on %I" ON %I FOR UPDATE USING (true) WITH CHECK (true);', t, t);
        
        EXECUTE format('DROP POLICY IF EXISTS "Public delete on %I" ON %I;', t, t);
        EXECUTE format('CREATE POLICY "Public delete on %I" ON %I FOR DELETE USING (true);', t, t);
    END LOOP;
END $$;

-- Grant usage to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- 4. INSERT REAL INSTITUTIONAL SEED DATA (Valid Hex UUIDs: 0-9, a-f)
-- ============================================================================

-- 4.1 Insert GMS Awanpora Organization
INSERT INTO organizations (id, name, udise_code, zone, district, principal_name, contact_phone, email)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Govt Middle School Awanpora',
    '01061102301',
    'Zone Mattan',
    'Anantnag',
    'Mohammad Ashraf Bhat',
    '+91-9419011122',
    'gmsawanpora@gmail.com'
) ON CONFLICT (udise_code) DO NOTHING;

-- 4.2 Insert Classes 1 to 8
INSERT INTO class_sections (id, organization_id, class_name, section, grade_level, room_number)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Class 1', 'A', 1, 'Room 101'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Class 2', 'A', 2, 'Room 102'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Class 3', 'A', 3, 'Room 103'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Class 4', 'A', 4, 'Room 104'),
    ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Class 5', 'A', 5, 'Room 105'),
    ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Class 6', 'A', 6, 'Room 106'),
    ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Class 7', 'A', 7, 'Room 107'),
    ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Class 8', 'A', 8, 'Room 108')
ON CONFLICT (organization_id, class_name, section) DO NOTHING;

-- 4.3 Insert Admin User
INSERT INTO users (id, organization_id, name, username, email, phone, password_hash, role)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mohammad Ashraf Bhat', 'admin@me', 'admin@me', '+91-9419011122', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'admin')
ON CONFLICT (organization_id, username) DO NOTHING;

-- 4.4 Insert SSA Composite Grants Ledger
INSERT INTO grants_and_fees (organization_id, scheme_type, fund_name, transaction_type, amount, category, description, bill_number)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'SSA Annual Composite School Grant 2026-27', 'credit', 50000.0, 'Composite School Grant', 'Sanctioned by ZEO Mattan under Project Approval Board (PAB) 2026-27 allocation.', 'ZEO-MTN-2026-091'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'School Library & Reading Corner Grant', 'credit', 15000.0, 'Library Grant', 'Procurement of bilingual storybooks, encyclopedias, and science journals.', 'ZEO-MTN-2026-114'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'Sports & Physical Education Equipment Grant', 'credit', 10000.0, 'Sports Fund', 'Purchase of cricket kits, volleyballs, carrom boards, and badminton sets.', 'ZEO-MTN-2026-128');

-- 4.5 Insert Multilingual Notices & Circulars
INSERT INTO notices (organization_id, title, body, category, target_audience, is_pinned, translations)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'Academic Session 2026-27 Portal Initialized',
        'Welcome to the official ERP portal of Govt Middle School Awanpora. Teaching faculty, student enrolments, and parent accounts will be registered directly by school administration.',
        'Academic',
        'All',
        true,
        jsonb_build_object(
            'ur', jsonb_build_object('title', 'اطلاع: تعلیمی سیشن 2026-27 پورٹل فعال کر دیا گیا ہے', 'body', 'گورنمنٹ مڈل اسکول اونپورہ کے ای آر پی پورٹل میں خوش آمدید۔'),
            'ks', jsonb_build_object('title', 'نوٹس: تعلیمی سیشن پورٹل چالو', 'body', 'گورنمنٹ مڈل اسکول اونپورہ ای آر پی پورٹلس منز خوش آمدید۔'),
            'hi', jsonb_build_object('title', 'सूचना: शैक्षणिक सत्र 2026-27 पोर्टल प्रारंभ', 'body', 'राजकीय मध्य विद्यालय अवनपोरा के आधिकारिक ईआरपी पोर्टल में आपका स्वागत है।')
        )
    );
