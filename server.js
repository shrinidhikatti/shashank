// ==================================================
// SHASHANK SAP TRAINING - BACKEND SERVER
// Node.js + Express API with Neon PostgreSQL Database
// ==================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { neon } = require('@neondatabase/serverless');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 7177;

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'shashanksaptrainer@gmail.com',
        pass: process.env.EMAIL_PASSWORD // App password from Gmail
    }
});

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_DQmKvBez0t4X@ep-lingering-leaf-a1m6w6ud-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

// Middleware
app.use(cors({
    origin: ['https://www.reachupleaarningcenter.in', 'http://localhost:7177', 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
const publicPath = process.env.VERCEL ? path.join(process.cwd(), 'public') : __dirname;
app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory for PDFs
// Use /tmp for Vercel serverless environment (read-only filesystem)
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ==================================================
// API ROUTES
// ==================================================

// Health check
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        await sql`SELECT 1`;
        res.json({
            status: 'OK',
            message: 'Shashank SAP Training Backend is running!',
            database: 'Connected to Neon PostgreSQL',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            timestamp: new Date().toISOString()
        });
    }
});

// ==================================================
// CONTACT FORM SUBMISSION
// ==================================================
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, course, message } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required fields'
            });
        }

        // Insert into database
        const result = await sql`
            INSERT INTO contacts (name, email, phone, course, message, status)
            VALUES (${name}, ${email}, ${phone}, ${course || 'Not specified'}, ${message || ''}, 'new')
            RETURNING id
        `;

        const contactId = result[0].id;

        // Send email notification
        try {
            const mailOptions = {
                from: `"Website Contact Form" <${process.env.EMAIL_USER || 'shashanksaptrainer@gmail.com'}>`,
                to: 'shashanksaptrainer@gmail.com',
                replyTo: email,
                subject: `🔔 New Lead: ${name} - ${course || 'General Inquiry'}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #667eea; margin-top: 0;">📩 New Contact Form Submission</h2>

                        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Submission ID:</strong> #${contactId}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>

                        <h3 style="color: #333;">Customer Details:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                            </tr>
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                                <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Course Interested</td>
                                <td style="padding: 10px; border: 1px solid #ddd;"><strong style="color: #667eea;">${course || 'Not specified'}</strong></td>
                            </tr>
                        </table>

                        <h3 style="color: #333; margin-top: 20px;">Message:</h3>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                            <p style="margin: 0;">${message || 'No message provided'}</p>
                        </div>

                        <div style="margin-top: 20px; padding: 10px; background: #e8f5e9; border-radius: 5px;">
                            <p style="margin: 0; color: #2e7d32;">✅ Click "Reply" to respond directly to ${email}</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully to shashanksaptrainer@gmail.com');
        } catch (emailError) {
            console.error('❌ Error sending email:', emailError);
            // Don't fail the request if email fails
        }

        console.log('✅ New contact form submission:', { id: contactId, name, email });
        res.json({
            success: true,
            message: 'Thank you! We have received your inquiry and will contact you soon.',
            contactId: contactId
        });

    } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// ==================================================
// CHAT USER SIGNUP
// ==================================================
app.post('/api/chat/signup', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await sql`
            SELECT id, name, email FROM chat_users WHERE email = ${email}
        `;

        if (existingUser.length > 0) {
            console.log('👤 Returning user:', existingUser[0]);
            return res.json({
                success: true,
                message: 'Welcome back!',
                userId: existingUser[0].id,
                returning: true
            });
        }

        // Insert new user
        const result = await sql`
            INSERT INTO chat_users (name, email, phone, status)
            VALUES (${name}, ${email}, ${phone}, 'active')
            RETURNING id
        `;

        const userId = result[0].id;

        console.log('✅ New chat user registered:', { id: userId, name, email });
        res.json({
            success: true,
            message: 'Registration successful!',
            userId: userId,
            returning: false
        });

    } catch (error) {
        console.error('❌ Error processing chat signup:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// ==================================================
// CHAT MESSAGE SUBMISSION
// ==================================================
app.post('/api/chat/message', async (req, res) => {
    try {
        const { userId, message, userInfo } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Insert message
        const result = await sql`
            INSERT INTO chat_messages (user_id, user_email, message, user_info)
            VALUES (${userId || null}, ${userInfo?.email || null}, ${message}, ${JSON.stringify(userInfo || {})})
            RETURNING id
        `;

        const messageId = result[0].id;

        console.log('💬 New chat message:', { id: messageId, userId });
        res.json({
            success: true,
            message: 'Message saved',
            messageId: messageId
        });

    } catch (error) {
        console.error('❌ Error processing chat message:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Configure multer for feedback image uploads
const feedbackStorage = multer.memoryStorage(); // Store in memory for base64 conversion
const feedbackUpload = multer({
    storage: feedbackStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, and PNG images are allowed!'), false);
        }
    }
});

// ==================================================
// STUDENT FEEDBACK SUBMISSION
// ==================================================
app.post('/api/feedback', feedbackUpload.single('feedbackImage'), async (req, res) => {
    try {
        const {
            studentName,
            studentEmail,
            courseCompleted,
            currentRole,
            overallRating,
            instructorRating,
            contentRating,
            feedbackText,
            improvements,
            displayPublicly
        } = req.body;

        // Convert image to base64 if uploaded
        let imageBase64 = null;
        if (req.file) {
            imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }

        // Validation
        if (!studentName || !studentEmail || !courseCompleted || !feedbackText) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, course, and feedback are required fields'
            });
        }

        if (!overallRating || !instructorRating || !contentRating) {
            return res.status(400).json({
                success: false,
                message: 'All ratings are required'
            });
        }

        // Insert feedback
        const result = await sql`
            INSERT INTO feedback (
                student_name, student_email, course_completed, student_role,
                overall_rating, instructor_rating, content_rating,
                feedback_text, improvements, display_publicly, status, image_data
            )
            VALUES (
                ${studentName}, ${studentEmail}, ${courseCompleted}, ${currentRole || ''},
                ${parseInt(overallRating)}, ${parseInt(instructorRating)}, ${parseInt(contentRating)},
                ${feedbackText}, ${improvements || ''}, ${displayPublicly === 'true' || displayPublicly === true}, 'approved', ${imageBase64}
            )
            RETURNING id
        `;

        const feedbackId = result[0].id;

        console.log('⭐ New student feedback received:', { id: feedbackId, name: studentName });
        res.json({
            success: true,
            message: 'Thank you for your feedback!',
            feedbackId: feedbackId
        });

    } catch (error) {
        console.error('❌ Error processing feedback:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// ==================================================
// GET PUBLIC TESTIMONIALS (for display on website)
// ==================================================
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await sql`
            SELECT
                id, student_name as name, course_completed as course,
                student_role as role, overall_rating as rating,
                feedback_text as text, image_data as image, timestamp
            FROM feedback
            WHERE display_publicly = true AND status = 'approved'
            ORDER BY timestamp DESC
        `;

        res.json({
            success: true,
            count: testimonials.length,
            data: testimonials
        });
    } catch (error) {
        console.error('❌ Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching testimonials'
        });
    }
});

// ==================================================
// COURSE MATERIALS / PDF MANAGEMENT
// ==================================================

// Upload course material (PDF)
app.post('/api/materials/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { title, course, description } = req.body;

        if (!title || !course || !description) {
            // Delete uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Title, course, and description are required'
            });
        }

        // Insert material into database
        const result = await sql`
            INSERT INTO materials (
                title, course, description, filename, original_name, file_size, file_path
            )
            VALUES (
                ${title}, ${course}, ${description},
                ${req.file.filename}, ${req.file.originalname},
                ${formatFileSize(req.file.size)}, ${req.file.path}
            )
            RETURNING id
        `;

        const materialId = result[0].id;

        console.log('📄 New course material uploaded:', { id: materialId, title });
        res.json({
            success: true,
            message: 'Material uploaded successfully!',
            materialId: materialId
        });

    } catch (error) {
        console.error('❌ Error uploading material:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'An error occurred while uploading the material.'
        });
    }
});

// Get all course materials
app.get('/api/materials', async (req, res) => {
    try {
        const materials = await sql`
            SELECT
                id, title, course, description,
                original_name as filename, file_size, upload_date
            FROM materials
            ORDER BY upload_date DESC
        `;

        res.json({
            success: true,
            count: materials.length,
            data: materials
        });
    } catch (error) {
        console.error('❌ Error fetching materials:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching materials'
        });
    }
});

// Download material
app.get('/api/materials/download/:id', async (req, res) => {
    try {
        const materials = await sql`
            SELECT * FROM materials WHERE id = ${parseInt(req.params.id)}
        `;

        if (materials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const material = materials[0];

        // Check if file exists
        if (!fs.existsSync(material.file_path)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(material.file_path, material.original_name);
    } catch (error) {
        console.error('❌ Error downloading material:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading material'
        });
    }
});

// View material (inline)
app.get('/api/materials/view/:id', async (req, res) => {
    try {
        const materials = await sql`
            SELECT * FROM materials WHERE id = ${parseInt(req.params.id)}
        `;

        if (materials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const material = materials[0];

        // Check if file exists
        if (!fs.existsSync(material.file_path)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${material.original_name}"`);
        fs.createReadStream(material.file_path).pipe(res);
    } catch (error) {
        console.error('❌ Error viewing material:', error);
        res.status(500).json({
            success: false,
            message: 'Error viewing material'
        });
    }
});

// Delete material
app.delete('/api/materials/:id', async (req, res) => {
    try {
        const materials = await sql`
            SELECT * FROM materials WHERE id = ${parseInt(req.params.id)}
        `;

        if (materials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const material = materials[0];

        // Delete file from disk
        if (fs.existsSync(material.file_path)) {
            fs.unlinkSync(material.file_path);
        }

        // Delete from database
        await sql`
            DELETE FROM materials WHERE id = ${parseInt(req.params.id)}
        `;

        console.log('🗑️  Material deleted:', material.title);
        res.json({
            success: true,
            message: 'Material deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting material:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting material'
        });
    }
});

// ==================================================
// SUCCESS STORIES / TESTIMONIALS MANAGEMENT
// ==================================================

// Add success story (Admin only)
app.post('/api/success-stories', async (req, res) => {
    try {
        const { name, role, course, rating, text } = req.body;

        // Validation
        if (!name || !role || !course || !rating || !text) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Insert success story into database
        const result = await sql`
            INSERT INTO success_stories (name, role, course, rating, testimonial_text, status)
            VALUES (${name}, ${role}, ${course}, ${parseInt(rating)}, ${text}, 'approved')
            RETURNING id
        `;

        const storyId = result[0].id;

        console.log('✨ New success story added:', { id: storyId, name });
        res.json({
            success: true,
            message: 'Success story added successfully!',
            storyId: storyId
        });

    } catch (error) {
        console.error('❌ Error adding success story:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while adding the success story.'
        });
    }
});

// Get all success stories (Public)
app.get('/api/success-stories', async (req, res) => {
    try {
        const stories = await sql`
            SELECT
                id, name, role, course, rating, testimonial_text as text, created_at
            FROM success_stories
            WHERE status = 'approved'
            ORDER BY created_at DESC
        `;

        res.json({
            success: true,
            count: stories.length,
            data: stories
        });
    } catch (error) {
        console.error('❌ Error fetching success stories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching success stories'
        });
    }
});

// Delete success story
app.delete('/api/success-stories/:id', async (req, res) => {
    try {
        await sql`
            DELETE FROM success_stories WHERE id = ${parseInt(req.params.id)}
        `;

        console.log('🗑️  Success story deleted:', req.params.id);
        res.json({
            success: true,
            message: 'Success story deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting success story:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting success story'
        });
    }
});

// ==================================================
// ADMIN ENDPOINTS
// ==================================================

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Simple credential check (you can enhance this with database or environment variables)
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log('✅ Admin login successful:', username);
            res.json({
                success: true,
                message: 'Login successful'
            });
        } else {
            console.log('❌ Failed login attempt:', username);
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error('❌ Error during admin login:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.'
        });
    }
});

app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await sql`
            SELECT * FROM contacts ORDER BY timestamp DESC
        `;
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
});

app.get('/api/admin/chat-users', async (req, res) => {
    try {
        const users = await sql`
            SELECT * FROM chat_users ORDER BY timestamp DESC
        `;
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat users'
        });
    }
});

app.get('/api/admin/chat-messages', async (req, res) => {
    try {
        const messages = await sql`
            SELECT * FROM chat_messages ORDER BY timestamp DESC
        `;
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat messages'
        });
    }
});

app.get('/api/admin/feedback', async (req, res) => {
    try {
        const feedbackList = await sql`
            SELECT * FROM feedback ORDER BY timestamp DESC
        `;
        res.json({
            success: true,
            count: feedbackList.length,
            data: feedbackList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback'
        });
    }
});

// ==================================================
// EXPORT DATA AS CSV (Admin endpoint)
// ==================================================
app.get('/api/admin/export/contacts', async (req, res) => {
    try {
        const contacts = await sql`
            SELECT * FROM contacts ORDER BY timestamp DESC
        `;

        // Convert to CSV
        const headers = 'ID,Name,Email,Phone,Course,Message,Timestamp,Status\n';
        const rows = contacts.map(c =>
            `${c.id},"${c.name}","${c.email}","${c.phone}","${c.course}","${c.message}",${c.timestamp},${c.status}`
        ).join('\n');

        const csv = headers + rows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting contacts'
        });
    }
});

// ==================================================
// START SERVER
// ==================================================
// Only start the server if not in Vercel (for local development)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(50));
        console.log('🚀 SHASHANK SAP TRAINING - BACKEND SERVER');
        console.log('='.repeat(50));
        console.log(`✅ Server running on: http://localhost:${PORT}`);
        console.log(`🗄️  Database: Neon PostgreSQL (Connected)`);
        console.log(`📊 API Health Check: http://localhost:${PORT}/api/health`);
        console.log(`📝 Contact Form API: http://localhost:${PORT}/api/contact`);
        console.log(`💬 Chat Signup API: http://localhost:${PORT}/api/chat/signup`);
        console.log(`💬 Chat Message API: http://localhost:${PORT}/api/chat/message`);
        console.log(`⭐ Student Feedback API: http://localhost:${PORT}/api/feedback`);
        console.log(`📣 Public Testimonials: http://localhost:${PORT}/api/testimonials`);
        console.log(`📄 Course Materials API: http://localhost:${PORT}/api/materials`);
        console.log(`\n🎓 Student Pages:`);
        console.log(`   - Give Feedback: http://localhost:${PORT}/feedback.html`);
        console.log(`   - View Materials: http://localhost:${PORT}/course-materials.html`);
        console.log(`\n🔐 Admin Endpoints:`);
        console.log(`   - Upload Materials: http://localhost:${PORT}/admin-upload.html`);
        console.log(`   - View Contacts: http://localhost:${PORT}/api/admin/contacts`);
        console.log(`   - View Chat Users: http://localhost:${PORT}/api/admin/chat-users`);
        console.log(`   - View Messages: http://localhost:${PORT}/api/admin/chat-messages`);
        console.log(`   - View Feedback: http://localhost:${PORT}/api/admin/feedback`);
        console.log(`   - Export Contacts CSV: http://localhost:${PORT}/api/admin/export/contacts`);
        console.log('\n' + '='.repeat(50) + '\n');
    });
}

// Export the Express app for Vercel
module.exports = app;
