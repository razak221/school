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

-- 4.3 Insert Admin & Staff Users (Valid UUIDs with hex digits)
INSERT INTO users (id, organization_id, name, username, email, phone, password_hash, role)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mohammad Ashraf Bhat', 'admin@me', 'admin@me', '+91-9419011122', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'admin'),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Shabir Ahmad Shah', 'shabir.teacher@gms.edu', 'shabir@gmsawanpora.edu.in', '+91-9419022233', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'teacher'),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Nissar Ahmad Rather', 'nissar.teacher@gms.edu', 'nissar@gmsawanpora.edu.in', '+91-9419033344', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'teacher'),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Farooq Ahmad Dar', 'farooq.teacher@gms.edu', 'farooq@gmsawanpora.edu.in', '+91-9419044455', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'teacher'),
    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Altaf Hussain', 'altaf.teacher@gms.edu', 'altaf@gmsawanpora.edu.in', '+91-9419055566', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'teacher'),
    ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Nissar Ahmad Mir (Parent)', 'nissar.parent@gms.edu', 'parent.nissar@gmail.com', '+91-9419055566', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'parent'),
    ('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Aaqib Nissar Mir', 'aaqib.student@gms.edu', 'aaqib.mir@gms.edu', '+91-9419055566', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'student'),
    ('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'Mehak Nissar Mir', 'mehak.student@gms.edu', 'mehak.mir@gms.edu', '+91-9419055566', '$2a$10$tZ8k2hDkWFj6kL2fA6l60.R.Cclp7y5O.0/aE2N7U0gU6o18I8fuy', 'student')
ON CONFLICT (organization_id, username) DO NOTHING;

-- 4.4 Insert Teacher Profiles
INSERT INTO teacher_profiles (user_id, organization_id, employee_code, designation, qualification, subjects_taught)
VALUES
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'TCH-001', 'General Line Teacher (SSA)', 'M.A (English), B.Ed', ARRAY['English', 'Social Science']),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'TCH-002', 'Master (Maths)', 'M.Sc (Mathematics), B.Ed', ARRAY['Mathematics', 'Science']),
    ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'TCH-003', 'General Line Teacher (SSA)', 'M.Sc (Physics), B.Ed', ARRAY['Science', 'Mathematics']),
    ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'TCH-004', 'Language Teacher (Urdu/Kashmiri)', 'M.A (Urdu), B.Ed', ARRAY['Urdu', 'Kashmiri'])
ON CONFLICT (user_id) DO NOTHING;

-- 4.5 Insert Student Profiles
INSERT INTO student_profiles (id, user_id, organization_id, admission_number, roll_number, class_id, section, gender, father_name, mother_name, address, ssa_category)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'GMS-AWN-2022-084', 1, 'c0000000-0000-0000-0000-000000000008', 'A', 'male', 'Nissar Ahmad Mir', 'Fareeda Begum', 'Awanpora, Mattan, Anantnag', 'RBA'),
    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'GMS-AWN-2024-112', 6, 'c0000000-0000-0000-0000-000000000004', 'A', 'female', 'Nissar Ahmad Mir', 'Fareeda Begum', 'Awanpora, Mattan, Anantnag', 'RBA')
ON CONFLICT (user_id) DO NOTHING;

-- 4.6 Insert Parent Profiles
INSERT INTO parent_profiles (user_id, organization_id, relation, occupation, address)
VALUES
    ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'father', 'Horticulture & Agriculture', 'Awanpora, Mattan, Anantnag')
ON CONFLICT (user_id) DO NOTHING;

-- 4.7 Insert PM-POSHAN Mid-Day Meal Daily Log
INSERT INTO mid_day_meals (organization_id, date, menu_served, students_served, rice_consumed_kg, vegetable_cost, cook_name, quality_checked_by, remarks)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    'Steamed Rice, Rajmash (Kidney Beans Dal) & Fresh Sautéed Spinach',
    230,
    28.5,
    520.0,
    'Fatima Begum & Shameema Bano',
    'Farooq Ahmad Dar (Duty Teacher)',
    'Nutritious, warm, and hygienic lunch served on time to all present students.'
) ON CONFLICT (date) DO NOTHING;

-- 4.8 Insert SSA Composite Grants Ledger
INSERT INTO grants_and_fees (organization_id, scheme_type, fund_name, transaction_type, amount, category, description, bill_number)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'SSA Annual Composite School Grant 2026-27', 'credit', 50000.0, 'Composite School Grant', 'Sanctioned by ZEO Mattan under Project Approval Board (PAB) 2026-27 allocation.', 'ZEO-MTN-2026-091'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'School Library & Reading Corner Grant', 'credit', 15000.0, 'Library Grant', 'Procurement of bilingual storybooks, encyclopedias, and science journals.', 'ZEO-MTN-2026-114'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'Sports & Physical Education Equipment Grant', 'credit', 10000.0, 'Sports Fund', 'Purchase of cricket kits, volleyballs, carrom boards, and badminton sets.', 'ZEO-MTN-2026-128'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'Classroom Whitewash & Minor Window Glazing', 'debit', 10500.0, 'Infrastructure & Maintenance', 'Repair of broken classroom window panes and wall whitewashing before winter.', 'VOUCH-AWN-004'),
    ('a0000000-0000-0000-0000-000000000001', 'Samagra Shiksha Abhiyan (SSA)', 'Science Demonstration Models & Charts', 'debit', 4800.0, 'Teaching Learning Material (TLM)', 'Solar system 3D models, human anatomy charts, and litmus test kits for Class 8.', 'TLM-AWN-019');

-- 4.9 Insert Multilingual Notices & Circulars
INSERT INTO notices (organization_id, title, body, category, target_audience, is_pinned, translations)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'Term 1 (T1) SCERT Evaluation & Parent-Teacher Meeting (PTM)',
        'All teachers, students and parents are notified that Term 1 Continuous Comprehensive Evaluation (CCE) results are prepared. The Parent-Teacher interaction will be held on Saturday from 01:30 PM to 03:30 PM.',
        'Academic',
        'All',
        true,
        jsonb_build_object(
            'ur', jsonb_build_object('title', 'اطلاع: ٹرم اول امتحانات اور پی ٹی ایم میٹنگ', 'body', 'تمام اساتذہ، طلباء اور والدین کو مطلع کیا جاتا ہے کہ ٹرم اول کے امتحانات کے نتائج تیار ہیں۔ سنیچر کو پیرنٹ ٹیچر میٹنگ منعقد ہوگی۔'),
            'ks', jsonb_build_object('title', 'نوٹس: ٹرم گوڈنیک امتحانات تہ مول ماج میٹنگ', 'body', 'تمام استادن، شرین تہ مول ماجن چھ مطلع کرنہ یوان زہ ٹرم اولک رزلٹ چھ تیار۔ بٹوارس چھ اسکولس منز پی ٹی ایم میٹنگ۔'),
            'hi', jsonb_build_object('title', 'सूचना: प्रथम सत्र परीक्षा परिणाम एवं अभिभावक-शिक्षक बैठक', 'body', 'सभी शिक्षकों, छात्रों और अभिभावकों को सूचित किया जाता है कि प्रथम सत्र के परिणाम तैयार हैं। शनिवार को बैठक आयोजित की जाएगी।')
        )
    ),
    (
        'a0000000-0000-0000-0000-000000000001',
        'Distribution of Free SSA Uniforms & Winter Sweaters',
        'Under the Samagra Shiksha Abhiyan scheme, all enrolled students of Classes 1st through 8th will receive their winter school uniforms and warm sweaters tomorrow morning during assembly.',
        'SSA Scheme',
        'All',
        false,
        jsonb_build_object(
            'ur', jsonb_build_object('title', 'مفت ایس ایس اے یونیفارم اور سویٹر کی تقسیم', 'body', 'سماگرا شیکشا ابھیان کے تحت جماعت اول تا ہشتم کے تمام طلباء کو کل صبح اسمبلی کے دوران مفت اسکول یونیفارم تقسیم کی جائے گی۔'),
            'ks', jsonb_build_object('title', 'مفت ایس ایس اے وردی تہ گرم سویٹر تقسیم', 'body', 'سماگرا شیکشا ابھیان تحت ییہ پگاہ صوبہ اسمبلی منز سارنی شرین مفت یونیفارم تہ سویٹر دنہ۔'),
            'hi', jsonb_build_object('title', 'निःशुल्क एसएसए स्कूल यूनिफॉर्म एवं स्वेटर वितरण', 'body', 'समग्र शिक्षा अभियान के अंतर्गत कक्षा 1 से 8 तक के सभी विद्यार्थियों को कल सुबह निःशुल्क स्कूल यूनिफॉर्म और स्वेटर वितरित किए जाएंगे।')
        )
    );

-- 4.10 Insert Class 8 Timetable (Monday)
INSERT INTO timetables (organization_id, class_id, day_of_week, periods)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000008',
    'Monday',
    jsonb_build_array(
        jsonb_build_object('periodNumber', 1, 'startTime', '09:45 AM', 'endTime', '10:30 AM', 'subject', 'English Literature', 'teacherName', 'Shabir Ahmad Shah', 'room', 'Room 108'),
        jsonb_build_object('periodNumber', 2, 'startTime', '10:30 AM', 'endTime', '11:15 AM', 'subject', 'Mathematics', 'teacherName', 'Nissar Ahmad Rather', 'room', 'Room 108'),
        jsonb_build_object('periodNumber', 3, 'startTime', '11:15 AM', 'endTime', '12:00 PM', 'subject', 'Science & Lab Experiments', 'teacherName', 'Farooq Ahmad Dar', 'room', 'Science Lab'),
        jsonb_build_object('periodNumber', 4, 'startTime', '12:00 PM', 'endTime', '12:45 PM', 'subject', 'Urdu Language', 'teacherName', 'Altaf Hussain', 'room', 'Room 108'),
        jsonb_build_object('periodNumber', 5, 'startTime', '01:30 PM', 'endTime', '02:15 PM', 'subject', 'Social Science (History/Civics)', 'teacherName', 'Showkat Ahmad', 'room', 'Room 108'),
        jsonb_build_object('periodNumber', 6, 'startTime', '02:15 PM', 'endTime', '03:00 PM', 'subject', 'Kashmiri & Physical Education', 'teacherName', 'Tanveer Ahmad (PET)', 'room', 'Playground')
    )
) ON CONFLICT (organization_id, class_id, day_of_week) DO NOTHING;

-- 4.11 Insert Sample Exam Result for Aaqib Nissar
INSERT INTO exam_results (organization_id, student_id, class_id, exam_name, term, subject_marks, total_max, total_obtained, percentage, overall_grade, ai_remarks)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000008',
    'Term 1 Summative Assessment (T1)',
    'Term 1',
    jsonb_build_array(
        jsonb_build_object('subjectName', 'English', 'obtainedMarks', 88, 'maxMarks', 100),
        jsonb_build_object('subjectName', 'Mathematics', 'obtainedMarks', 94, 'maxMarks', 100),
        jsonb_build_object('subjectName', 'Science', 'obtainedMarks', 91, 'maxMarks', 100),
        jsonb_build_object('subjectName', 'Social Science', 'obtainedMarks', 82, 'maxMarks', 100),
        jsonb_build_object('subjectName', 'Urdu', 'obtainedMarks', 87, 'maxMarks', 100)
    ),
    500,
    442,
    88.4,
    'A+',
    'Aaqib demonstrates outstanding academic diligence and active classroom participation with an impressive 88.4% score and 94.2% attendance. Consistently shows exemplary analytical thinking in Science and Mathematics.'
);
