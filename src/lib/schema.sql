-- Clients Table
CREATE TABLE clients (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    class_type TEXT,
    class_status TEXT,
    enrollment_date TIMESTAMP WITH TIME ZONE,
    termination_date TIMESTAMP WITH TIME ZONE,
    re_enrollment_date TIMESTAMP WITH TIME ZONE,
    current_balance FLOAT,
    payment_status TEXT,
    total_absences INT,
    consecutive_absences INT,
    attendance_status TEXT,
    drug_test_count INT,
    referral_source TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Facilitators Table
CREATE TABLE facilitators (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT,
    last_name TEXT,
    schedule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    payment_type TEXT,
    payment_reason TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE class_definitions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    class_type TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL,
    class_format TEXT NOT NULL DEFAULT 'E-CLASSROOM',
    duration_weeks INT NOT NULL,
    gender_rules TEXT NOT NULL,
    custom_duration BOOLEAN DEFAULT FALSE
);

-- Inserting predefined classes
INSERT INTO class_definitions (class_type, class_name, duration_weeks, gender_rules, custom_duration) VALUES
('DV', 'Domestic Violence', 26, 'WOMEN', FALSE),
('SORT', 'Sex Offender Responsible Thinking', 78, 'MEN', TRUE),
('L1-AM', 'Anger Management', 12, 'MIXED', FALSE),
('L1-SACT1', 'Substance Abuse and Critical Thinking', 12, 'MIXED', FALSE),
('L1-PP', 'Positive Parenting', 12, 'MIXED', FALSE);

-- Classes Table
CREATE TABLE classes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    class_name TEXT UNIQUE NOT NULL,
    day_of_week TEXT NOT NULL,
    time TIME NOT NULL,
    facilitator_id BIGINT REFERENCES facilitators(id) ON DELETE SET NULL,
    class_type_id BIGINT REFERENCES class_definitions(id),
    CONSTRAINT unique_class_instance UNIQUE (class_name, day_of_week, time)
);

-- Attendance Table
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    class_id BIGINT REFERENCES classes(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE,
    attendance_status TEXT,
    excuse_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Facilitator Assignments Table (Many-to-Many between Facilitators and Classes)
CREATE TABLE facilitator_assignments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    facilitator_id BIGINT NOT NULL REFERENCES facilitators(id) ON DELETE CASCADE,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    assignment_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assignment_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (facilitator_id, class_id, assignment_start_date)
);

-- Users Table (for Clerk Integration)
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,  -- Changed from UUID to BIGINT
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    table_name TEXT NOT NULL,
    record_pk TEXT NOT NULL,
    change_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_fields JSONB
);

-- Index for faster querying by record or user
CREATE INDEX idx_audit_log_record ON audit_log(table_name, record_pk);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(change_timestamp);