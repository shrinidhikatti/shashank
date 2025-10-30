// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});


// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value,
        message: document.getElementById('message').value
    };

    console.log('Contact Form Submitted:', formData);

    // Here you would typically send the data to your backend/email service
    // For now, we'll show a success message
    alert(`Thank you, ${formData.name}! We have received your inquiry and will contact you soon at ${formData.email} or ${formData.phone}.`);

    // Reset form
    contactForm.reset();
});

// Chat Widget Functionality
const chatButton = document.getElementById('chatButton');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const chatSignupForm = document.getElementById('chatSignupForm');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');

let userInfo = null;

// Toggle Chat Box
chatButton.addEventListener('click', () => {
    chatBox.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
    chatBox.classList.remove('active');
});

// Handle Chat Signup Form
chatSignupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    userInfo = {
        name: document.getElementById('chatName').value,
        email: document.getElementById('chatEmail').value,
        phone: document.getElementById('chatPhone').value,
        timestamp: new Date().toISOString()
    };

    console.log('Chat User Info:', userInfo);

    // Store user info (in a real app, send this to your backend)
    localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));

    // Hide welcome screen and show chat
    welcomeScreen.style.display = 'none';
    chatMessages.style.display = 'flex';
    chatInput.style.display = 'flex';

    // Display welcome message with user's name
    document.getElementById('userName').textContent = userInfo.name;

    // Add initial bot messages
    setTimeout(() => {
        addBotMessage(`Great! How can I help you today? Feel free to ask about our SAP courses, training schedules, or anything else.`);
    }, 500);

    setTimeout(() => {
        addBotMessage(`You can ask about:\n• SAP Course Details\n• Training Schedule\n• Fees & Payment Options\n• Job Assistance\n• Free Demo Classes`);
    }, 1500);
});

// Send Message
sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();

    if (message === '') return;

    // Add user message
    addUserMessage(message);

    // Clear input
    messageInput.value = '';

    // Simulate bot response based on keywords
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addBotMessage(botResponse);
    }, 800);
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Course related queries
    if (message.includes('course') || message.includes('training') || message.includes('learn')) {
        return `We offer comprehensive SAP training in various modules including:

• SAP S/4 HANA
• SAP FICO
• SAP ABAP
• SAP MM
• SAP SD
• SAP HANA
• SAP BI/BW
• SAP Fiori
• SAP HCM

Which course are you interested in?`;
    }

    // FICO specific
    if (message.includes('fico') || message.includes('finance') || message.includes('accounting')) {
        return `Our SAP FICO course covers:

✓ Financial Accounting (FI)
✓ Controlling (CO)
✓ Asset Accounting
✓ End-to-End Implementation
✓ Real-time Projects

Duration: 45-60 days
Mode: Online/Classroom

Would you like to know about fees or schedule a free demo?`;
    }

    // S/4 HANA specific
    if (message.includes('s/4') || message.includes('s4') || message.includes('hana')) {
        return `SAP S/4 HANA is our most popular course!

✓ Latest SAP Technology
✓ Fiori Applications
✓ Migration Strategies
✓ Hands-on Practice
✓ Industry Projects

This course is perfect for career advancement. Would you like to register for a free demo class?`;
    }

    // Fee related queries
    if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('payment')) {
        return `Our course fees are competitive and we offer flexible payment options:

• Installment Plans Available
• Early Bird Discounts
• Group Discounts
• Corporate Training Packages

For exact pricing, please share your preferred course and I'll have our team contact you with detailed information at ${userInfo.phone}.`;
    }

    // Schedule related
    if (message.includes('schedule') || message.includes('timing') || message.includes('batch') || message.includes('when')) {
        return `We offer flexible batch timings:

⏰ Weekday Batches: Mon-Fri
⏰ Weekend Batches: Sat-Sun
⏰ Fast Track Options Available

Both morning and evening slots are available. What timing works best for you?`;
    }

    // Demo class
    if (message.includes('demo') || message.includes('trial') || message.includes('free class')) {
        return `Absolutely! We offer FREE demo classes for all our courses.

Our team will contact you at:
📧 ${userInfo.email}
📱 ${userInfo.phone}

You can also call us directly at +91 98765 43210 to schedule your demo class right away!`;
    }

    // Job assistance
    if (message.includes('job') || message.includes('placement') || message.includes('career')) {
        return `Yes! We provide comprehensive job assistance:

✓ Resume Building
✓ Interview Preparation
✓ Job Referrals
✓ Mock Interviews
✓ Career Guidance
✓ 95% Placement Rate

Many of our students have been placed in top companies. Would you like to know more about any specific course?`;
    }

    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('call')) {
        return `You can reach us at:

📞 +91 98765 43210
📞 +91 98765 43211
📧 info@shashanksaptraining.com
📍 Hyderabad, Telangana

Our team is available Mon-Sat, 9 AM - 8 PM. Feel free to call us anytime!`;
    }

    // Location
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
        return `We are located in Hyderabad, Telangana, India.

We offer both:
🏫 Classroom Training at our center
💻 Online Training from anywhere

Which mode of training interests you?`;
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return `Hello ${userInfo.name}! How can I assist you with your SAP learning journey today?`;
    }

    if (message.includes('thank') || message.includes('thanks')) {
        return `You're welcome! Is there anything else you'd like to know about our SAP training programs?`;
    }

    // Default response
    return `Thank you for your message! Our team will get back to you shortly at ${userInfo.email} or ${userInfo.phone}.

In the meantime, you can ask me about:
• Course details
• Training schedules
• Fees & payments
• Job assistance
• Demo classes

Or call us at +91 98765 43210 for immediate assistance.`;
}

// Check if user info exists in localStorage (returning user)
window.addEventListener('load', () => {
    const savedUserInfo = localStorage.getItem('chatUserInfo');
    if (savedUserInfo) {
        userInfo = JSON.parse(savedUserInfo);
        // Could optionally auto-login returning users
        // For now, we'll just keep the signup form
    }
});

// Add scroll animation for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add animation to cards on scroll
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .course-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

console.log('Shashank SAP Training Website - Loaded Successfully!');
console.log('Website built for professional SAP training and course promotion');
