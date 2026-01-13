const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_DQmKvBez0t4X@ep-lingering-leaf-a1m6w6ud-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

// New base64-encoded SVG images
const sampleImages = {
    'Rajesh Kumar': 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#667eea"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP EWM</text></svg>').toString('base64'),
    'Priya Sharma': 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#764ba2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP MM</text></svg>').toString('base64'),
    'Amit Patel': 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4facfe"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP SD</text></svg>').toString('base64'),
    'Sneha Reddy': 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#f093fb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP ABAP</text></svg>').toString('base64'),
    'Vikram Singh': 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#00f2fe"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP Fiori</text></svg>').toString('base64')
};

async function updateImages() {
    try {
        console.log('Updating testimonial images...');

        for (const [name, imageData] of Object.entries(sampleImages)) {
            await sql`
                UPDATE feedback
                SET image_data = ${imageData}
                WHERE student_name = ${name}
            `;
            console.log(`✅ Updated image for ${name}`);
        }

        console.log('\n🎉 All images updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating images:', error);
        process.exit(1);
    }
}

updateImages();
