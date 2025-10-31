// ==================================================
// SHASHANK SAP TRAINING - BACKEND SERVER
// Node.js + Express API for Form Submissions
// ==================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

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

// File paths for data storage
const contactsFile = path.join(dataDir, 'contacts.json');
const chatUsersFile = path.join(dataDir, 'chat-users.json');
const chatMessagesFile = path.join(dataDir, 'chat-messages.json');

// Initialize files if they don't exist
const initializeFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
};

initializeFile(contactsFile);
initializeFile(chatUsersFile);
initializeFile(chatMessagesFile);

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
    console.log(`\n🔐 Admin Endpoints:`);
    console.log(`   - View Contacts: http://localhost:${PORT}/api/admin/contacts`);
    console.log(`   - View Chat Users: http://localhost:${PORT}/api/admin/chat-users`);
    console.log(`   - View Messages: http://localhost:${PORT}/api/admin/chat-messages`);
    console.log(`   - Export Contacts CSV: http://localhost:${PORT}/api/admin/export/contacts`);
    console.log('\n' + '='.repeat(50) + '\n');
});
