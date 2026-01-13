const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_DQmKvBez0t4X@ep-lingering-leaf-a1m6w6ud-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

// Sample professional images (placeholder data URLs) - using base64 encoding for better browser compatibility
const sampleImages = [
    'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#667eea"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP EWM</text></svg>').toString('base64'),
    'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#764ba2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP MM</text></svg>').toString('base64'),
    'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4facfe"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP SD</text></svg>').toString('base64'),
    'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#f093fb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP ABAP</text></svg>').toString('base64'),
    'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#00f2fe"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" fill="white" font-weight="bold">SAP Fiori</text></svg>').toString('base64')
];

const testimonials = [
    {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        role: 'Senior SAP Consultant',
        course: 'SAP EWM',
        rating: 5,
        text: 'Excellent training program! The instructor was very knowledgeable and the hands-on practice really helped me understand SAP EWM concepts. I got placed in a top MNC within 2 months of completing the course.',
        image: sampleImages[0]
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        role: 'SAP Functional Consultant',
        course: 'SAP MM',
        rating: 5,
        text: 'Best SAP MM training I have ever attended. The course content was well-structured and covered all real-time scenarios. The trainer\'s industry experience added immense value to the learning.',
        image: sampleImages[1]
    },
    {
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        role: 'SAP SD Consultant',
        course: 'SAP SD',
        rating: 5,
        text: 'Outstanding training experience! The practical approach and real-world examples made learning SAP SD very easy. Highly recommend this training center to anyone looking to start their SAP career.',
        image: sampleImages[2]
    },
    {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        role: 'SAP ABAP Developer',
        course: 'SAP ABAP',
        rating: 5,
        text: 'The SAP ABAP course was comprehensive and well-paced. The trainer explained complex concepts in a simple manner. The project work and coding practice sessions were extremely helpful.',
        image: sampleImages[3]
    },
    {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        role: 'SAP Fiori Developer',
        course: 'SAP Fiori',
        rating: 5,
        text: 'Great learning experience! The SAP Fiori training covered everything from basics to advanced topics. The hands-on exercises and real-time project scenarios prepared me well for my current role.',
        image: sampleImages[4]
    }
];

async function addTestimonials() {
    try {
        console.log('Adding sample testimonials...');

        for (const testimonial of testimonials) {
            await sql`
                INSERT INTO feedback (
                    student_name,
                    student_email,
                    student_role,
                    course_completed,
                    overall_rating,
                    instructor_rating,
                    content_rating,
                    feedback_text,
                    image_data,
                    status,
                    display_publicly
                ) VALUES (
                    ${testimonial.name},
                    ${testimonial.email},
                    ${testimonial.role},
                    ${testimonial.course},
                    ${testimonial.rating},
                    ${testimonial.rating},
                    ${testimonial.rating},
                    ${testimonial.text},
                    ${testimonial.image},
                    'approved',
                    true
                )
            `;
            console.log(`✅ Added testimonial for ${testimonial.name}`);
        }

        console.log('\n🎉 All sample testimonials added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding testimonials:', error);
        process.exit(1);
    }
}

addTestimonials();
