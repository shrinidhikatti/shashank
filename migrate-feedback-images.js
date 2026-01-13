const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_DQmKvBez0t4X@ep-lingering-leaf-a1m6w6ud-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function migrate() {
    try {
        console.log('Adding image_data column to feedback table...');
        
        await sql`
            ALTER TABLE feedback 
            ADD COLUMN IF NOT EXISTS image_data TEXT
        `;
        
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
