// Database Initialization Script
// Run this to set up tables in Neon PostgreSQL

const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_DQmKvBez0t4X@ep-lingering-leaf-a1m6w6ud-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(DATABASE_URL);

async function initDatabase() {
    try {
        console.log('🔧 Initializing Neon database...\n');

        // Create contacts table
        await sql`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                course VARCHAR(255),
                message TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'new'
            )
        `;
        console.log('✅ Contacts table created');

        // Create chat_users table
        await sql`
            CREATE TABLE IF NOT EXISTS chat_users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'active'
            )
        `;
        console.log('✅ Chat users table created');

        // Create chat_messages table
        await sql`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                user_email VARCHAR(255),
                message TEXT NOT NULL,
                user_info JSONB,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Chat messages table created');

        // Create feedback table
        await sql`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                student_email VARCHAR(255) NOT NULL,
                course_completed VARCHAR(255) NOT NULL,
                student_role VARCHAR(255),
                overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
                instructor_rating INTEGER NOT NULL CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
                content_rating INTEGER NOT NULL CHECK (content_rating >= 1 AND content_rating <= 5),
                feedback_text TEXT NOT NULL,
                improvements TEXT,
                display_publicly BOOLEAN DEFAULT FALSE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'approved'
            )
        `;
        console.log('✅ Feedback table created');

        // Create materials table
        await sql`
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
            )
        `;
        console.log('✅ Materials table created');

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_contacts_timestamp ON contacts(timestamp DESC)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_chat_users_email ON chat_users(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_feedback_course ON feedback(course_completed)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_feedback_display ON feedback(display_publicly, status)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course)`;
        console.log('✅ Indexes created');

        console.log('\n🎉 Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initDatabase();
