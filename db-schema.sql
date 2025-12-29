-- Shashank SAP Training Database Schema
-- Tables for storing form submissions and course materials

-- Contacts table (for contact form submissions)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    course VARCHAR(255),
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Chat users table (for chat user registrations)
CREATE TABLE IF NOT EXISTS chat_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- Chat messages table (for chat messages)
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES chat_users(id),
    user_email VARCHAR(255),
    message TEXT NOT NULL,
    user_info JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table (for student feedback)
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    course_completed VARCHAR(255) NOT NULL,
    current_role VARCHAR(255),
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    instructor_rating INTEGER NOT NULL CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    content_rating INTEGER NOT NULL CHECK (content_rating >= 1 AND content_rating <= 5),
    feedback_text TEXT NOT NULL,
    improvements TEXT,
    display_publicly BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'approved'
);

-- Course materials table (for PDF uploads)
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50),
    file_path TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_users_email ON chat_users(email);
CREATE INDEX IF NOT EXISTS idx_feedback_course ON feedback(course_completed);
CREATE INDEX IF NOT EXISTS idx_feedback_display ON feedback(display_publicly, status);
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course);
