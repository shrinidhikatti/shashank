// ==================================================
// SHASHANK SAP TRAINING - BACKEND SERVER
// Node.js + Express API for Form Submissions
// ==================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Create uploads directory for PDFs
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
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

// File paths for data storage
const contactsFile = path.join(dataDir, 'contacts.json');
const chatUsersFile = path.join(dataDir, 'chat-users.json');
const chatMessagesFile = path.join(dataDir, 'chat-messages.json');
const feedbackFile = path.join(dataDir, 'feedback.json');
const materialsFile = path.join(dataDir, 'materials.json');

// Initialize files if they don't exist
const initializeFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
};

initializeFile(contactsFile);
initializeFile(chatUsersFile);
initializeFile(chatMessagesFile);
initializeFile(feedbackFile);
initializeFile(materialsFile);

// Helper function to read data
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

// Helper function to write data
const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
};

// ==================================================
// API ROUTES
// ==================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Shashank SAP Training Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// ==================================================
// CONTACT FORM SUBMISSION
// ==================================================
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, phone, course, message } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required fields'
            });
        }

        // Create contact object
        const contact = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            course: course || 'Not specified',
            message: message || '',
            timestamp: new Date().toISOString(),
            status: 'new'
        };

        // Read existing contacts
        const contacts = readData(contactsFile);

        // Add new contact
        contacts.push(contact);

        // Save to file
        const saved = writeData(contactsFile, contacts);

        if (saved) {
            console.log('✅ New contact form submission:', contact);
            res.json({
                success: true,
                message: 'Thank you! We have received your inquiry and will contact you soon.',
                contactId: contact.id
            });
        } else {
            throw new Error('Failed to save contact');
        }

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
app.post('/api/chat/signup', (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create user object
        const user = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            timestamp: new Date().toISOString(),
            status: 'active'
        };

        // Read existing users
        const users = readData(chatUsersFile);

        // Check if user already exists (by email)
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            console.log('👤 Returning user:', existingUser);
            return res.json({
                success: true,
                message: 'Welcome back!',
                userId: existingUser.id,
                returning: true
            });
        }

        // Add new user
        users.push(user);

        // Save to file
        const saved = writeData(chatUsersFile, users);

        if (saved) {
            console.log('✅ New chat user registered:', user);
            res.json({
                success: true,
                message: 'Registration successful!',
                userId: user.id,
                returning: false
            });
        } else {
            throw new Error('Failed to save user');
        }

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
app.post('/api/chat/message', (req, res) => {
    try {
        const { userId, message, userInfo } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Create message object
        const chatMessage = {
            id: Date.now().toString(),
            userId: userId || 'anonymous',
            userInfo: userInfo || {},
            message,
            timestamp: new Date().toISOString()
        };

        // Read existing messages
        const messages = readData(chatMessagesFile);

        // Add new message
        messages.push(chatMessage);

        // Save to file
        const saved = writeData(chatMessagesFile, messages);

        if (saved) {
            console.log('💬 New chat message:', chatMessage);
            res.json({
                success: true,
                message: 'Message saved',
                messageId: chatMessage.id
            });
        } else {
            throw new Error('Failed to save message');
        }

    } catch (error) {
        console.error('❌ Error processing chat message:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// ==================================================
// STUDENT FEEDBACK SUBMISSION
// ==================================================
app.post('/api/feedback', (req, res) => {
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

        // Create feedback object
        const feedback = {
            id: Date.now().toString(),
            studentName,
            studentEmail,
            courseCompleted,
            currentRole: currentRole || '',
            ratings: {
                overall: parseInt(overallRating),
                instructor: parseInt(instructorRating),
                content: parseInt(contentRating)
            },
            feedbackText,
            improvements: improvements || '',
            displayPublicly: displayPublicly === true,
            timestamp: new Date().toISOString(),
            status: 'approved' // Auto-approve for now, can add moderation later
        };

        // Read existing feedback
        const feedbackList = readData(feedbackFile);

        // Add new feedback
        feedbackList.push(feedback);

        // Save to file
        const saved = writeData(feedbackFile, feedbackList);

        if (saved) {
            console.log('⭐ New student feedback received:', feedback);
            res.json({
                success: true,
                message: 'Thank you for your feedback!',
                feedbackId: feedback.id
            });
        } else {
            throw new Error('Failed to save feedback');
        }

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
app.get('/api/testimonials', (req, res) => {
    try {
        const feedbackList = readData(feedbackFile);

        // Filter only approved feedback marked for public display
        const testimonials = feedbackList
            .filter(f => f.displayPublicly && f.status === 'approved')
            .map(f => ({
                id: f.id,
                name: f.studentName,
                course: f.courseCompleted,
                role: f.currentRole,
                rating: f.ratings.overall,
                text: f.feedbackText,
                timestamp: f.timestamp
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
app.post('/api/materials/upload', upload.single('pdf'), (req, res) => {
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

        // Create material object
        const material = {
            id: Date.now().toString(),
            title,
            course,
            description,
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileSize: formatFileSize(req.file.size),
            filePath: req.file.path,
            uploadDate: new Date().toISOString()
        };

        // Read existing materials
        const materials = readData(materialsFile);

        // Add new material
        materials.push(material);

        // Save to file
        const saved = writeData(materialsFile, materials);

        if (saved) {
            console.log('📄 New course material uploaded:', material);
            res.json({
                success: true,
                message: 'Material uploaded successfully!',
                materialId: material.id
            });
        } else {
            // Delete uploaded file if save fails
            fs.unlinkSync(req.file.path);
            throw new Error('Failed to save material');
        }

    } catch (error) {
        console.error('❌ Error uploading material:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while uploading the material.'
        });
    }
});

// Get all course materials
app.get('/api/materials', (req, res) => {
    try {
        const materials = readData(materialsFile);

        res.json({
            success: true,
            count: materials.length,
            data: materials.map(m => ({
                id: m.id,
                title: m.title,
                course: m.course,
                description: m.description,
                filename: m.originalName,
                fileSize: m.fileSize,
                uploadDate: m.uploadDate
            }))
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
app.get('/api/materials/download/:id', (req, res) => {
    try {
        const materials = readData(materialsFile);
        const material = materials.find(m => m.id === req.params.id);

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        // Check if file exists
        if (!fs.existsSync(material.filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.download(material.filePath, material.originalName);
    } catch (error) {
        console.error('❌ Error downloading material:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading material'
        });
    }
});

// View material (inline)
app.get('/api/materials/view/:id', (req, res) => {
    try {
        const materials = readData(materialsFile);
        const material = materials.find(m => m.id === req.params.id);

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        // Check if file exists
        if (!fs.existsSync(material.filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${material.originalName}"`);
        fs.createReadStream(material.filePath).pipe(res);
    } catch (error) {
        console.error('❌ Error viewing material:', error);
        res.status(500).json({
            success: false,
            message: 'Error viewing material'
        });
    }
});

// Delete material
app.delete('/api/materials/:id', (req, res) => {
    try {
        const materials = readData(materialsFile);
        const materialIndex = materials.findIndex(m => m.id === req.params.id);

        if (materialIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const material = materials[materialIndex];

        // Delete file from disk
        if (fs.existsSync(material.filePath)) {
            fs.unlinkSync(material.filePath);
        }

        // Remove from array
        materials.splice(materialIndex, 1);

        // Save updated list
        const saved = writeData(materialsFile, materials);

        if (saved) {
            console.log('🗑️  Material deleted:', material.title);
            res.json({
                success: true,
                message: 'Material deleted successfully'
            });
        } else {
            throw new Error('Failed to save updated materials list');
        }

    } catch (error) {
        console.error('❌ Error deleting material:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting material'
        });
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
// GET ALL SUBMISSIONS (Admin endpoint - should be protected in production)
// ==================================================
app.get('/api/admin/contacts', (req, res) => {
    try {
        const contacts = readData(contactsFile);
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

app.get('/api/admin/chat-users', (req, res) => {
    try {
        const users = readData(chatUsersFile);
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

app.get('/api/admin/chat-messages', (req, res) => {
    try {
        const messages = readData(chatMessagesFile);
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

app.get('/api/admin/feedback', (req, res) => {
    try {
        const feedbackList = readData(feedbackFile);
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
app.get('/api/admin/export/contacts', (req, res) => {
    try {
        const contacts = readData(contactsFile);

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
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 SHASHANK SAP TRAINING - BACKEND SERVER');
    console.log('='.repeat(50));
    console.log(`✅ Server running on: http://localhost:${PORT}`);
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
