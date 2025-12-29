// ==================================================
// MODERN SAP TRAINING WEBSITE - DEV1 BRANCH
// Interactive Features & Dark Mode Support
// ==================================================

// ==================================================
// DARK MODE TOGGLE
// ==================================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Function to get system preference
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || getSystemTheme();
html.setAttribute('data-theme', currentTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
    }
});

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ==================================================
// MOBILE MENU TOGGLE
// ==================================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// ==================================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================================================
// HEADER SCROLL EFFECT
// ==================================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==================================================
// ACTIVE NAVIGATION LINK ON SCROLL
// ==================================================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
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

// ==================================================
// CONTACT FORM HANDLING
// ==================================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value,
        message: document.getElementById('message').value
    };

    console.log('Contact Form Submitted:', formData);

    try {
        // Send data to backend API
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            showNotification(`Thank you, ${formData.name}! We have received your inquiry and will contact you soon.`, 'success');
            // Reset form
            contactForm.reset();
        } else {
            showNotification(result.message || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Unable to submit form. Please try again later.', 'error');
    }
});

// ==================================================
// CHAT WIDGET FUNCTIONALITY
// ==================================================
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
    if (chatBox.classList.contains('active')) {
        // Hide notification when chat is opened
        const notification = document.querySelector('.chat-notification');
        if (notification) notification.style.display = 'none';
    }
});

closeChat.addEventListener('click', () => {
    chatBox.classList.remove('active');
});

// Handle Chat Signup Form
chatSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    userInfo = {
        name: document.getElementById('chatName').value,
        email: document.getElementById('chatEmail').value,
        phone: document.getElementById('chatPhone').value
    };

    console.log('Chat User Info:', userInfo);

    try {
        // Send data to backend API
        const response = await fetch('http://localhost:3000/api/chat/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });

        const result = await response.json();

        if (result.success) {
            // Store user info with ID from backend
            userInfo.id = result.userId;
            localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));

            // Hide welcome screen and show chat
            welcomeScreen.style.display = 'none';
            chatMessages.style.display = 'flex';
            chatInput.style.display = 'flex';

            // Add welcome message
            setTimeout(() => {
                addBotMessage(`Hello ${userInfo.name}! 👋 Welcome to Shashank SAP Training!`);
            }, 300);

            setTimeout(() => {
                addBotMessage(`I'm here to help you with:\n• Course Information\n• Training Schedules\n• Fees & Payment Options\n• Job Assistance\n• Free Demo Classes\n\nWhat would you like to know?`);
            }, 800);
        } else {
            showNotification('Unable to connect. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting chat signup:', error);
        showNotification('Unable to connect. Please try again later.', 'error');
    }
});

// Send Message
sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = messageInput.value.trim();

    if (message === '') return;

    // Add user message
    addUserMessage(message);

    // Clear input
    messageInput.value = '';

    // Save message to backend
    try {
        await fetch('http://localhost:3000/api/chat/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userInfo?.id,
                userInfo: userInfo,
                message: message
            })
        });
    } catch (error) {
        console.error('Error saving message:', error);
    }

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    // Simulate bot response with delay
    setTimeout(() => {
        removeTypingIndicator(typingIndicator);
        const botResponse = generateBotResponse(message);
        addBotMessage(botResponse);
    }, 1000 + Math.random() * 500);
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `<p>Typing...</p>`;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
}

function removeTypingIndicator(indicator) {
    indicator.remove();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Course related queries
    if (message.includes('course') || message.includes('training') || message.includes('learn')) {
        return `We offer comprehensive SAP training in:\n\n🔹 SAP S/4 HANA\n🔹 SAP FICO\n🔹 SAP ABAP\n🔹 SAP MM\n🔹 SAP SD\n🔹 SAP Fiori\n🔹 SAP HANA\n🔹 And more!\n\nWhich course interests you?`;
    }

    // S/4 HANA specific
    if (message.includes('s/4') || message.includes('s4') || message.includes('hana')) {
        return `SAP S/4 HANA is our most trending course! 🔥\n\n✅ Latest SAP Technology\n✅ Real-time Data Processing\n✅ Fiori UX Integration\n✅ Migration Strategies\n✅ Hands-on Projects\n\nDuration: 60 Days\n\nWould you like to know about fees or schedule a demo?`;
    }

    // FICO specific
    if (message.includes('fico') || message.includes('finance') || message.includes('accounting')) {
        return `SAP FICO is perfect for finance professionals! ⭐\n\n✅ Financial Accounting (FI)\n✅ Controlling (CO)\n✅ Asset Accounting\n✅ End-to-End Implementation\n\nDuration: 45 Days\n\nInterested in enrollment or a free demo?`;
    }

    // Fee related queries
    if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('payment')) {
        return `Our course fees are competitive with flexible payment options:\n\n💳 Installment Plans Available\n🎁 Early Bird Discounts\n👥 Group Discounts\n🏢 Corporate Training Packages\n\nFor exact pricing, our team will contact you at:\n📧 ${userInfo.email}\n📱 ${userInfo.phone}`;
    }

    // Schedule related
    if (message.includes('schedule') || message.includes('timing') || message.includes('batch') || message.includes('when')) {
        return `We offer flexible batch timings:\n\n⏰ Weekday Batches: Mon-Fri\n⏰ Weekend Batches: Sat-Sun\n⏰ Fast Track Available\n\nMorning and Evening slots available!\nWhat timing works best for you?`;
    }

    // Demo class
    if (message.includes('demo') || message.includes('trial') || message.includes('free')) {
        return `Great! We offer FREE demo classes! 🎉\n\nOur team will reach out to you at:\n📧 ${userInfo.email}\n📱 ${userInfo.phone}\n\nYou can also call us directly:\n☎️ +91 98765 43210`;
    }

    // Job assistance
    if (message.includes('job') || message.includes('placement') || message.includes('career')) {
        return `Yes! We provide comprehensive job assistance! 💼\n\n✅ 95% Placement Rate\n✅ Resume Building\n✅ Interview Preparation\n✅ Job Referrals\n✅ Mock Interviews\n✅ Career Guidance\n\nMany students placed in top MNCs!`;
    }

    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('call')) {
        return `Contact us anytime:\n\n☎️ +91 98765 43210\n☎️ +91 98765 43211\n📧 info@shashanksaptraining.com\n📍 Hyderabad, Telangana\n\n⏰ Mon-Sat: 9 AM - 8 PM`;
    }

    // Location
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
        return `We're located in Hyderabad, Telangana, India\n\n🏫 Classroom Training Available\n💻 Online Training Available\n\nWhich mode interests you?`;
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return `Hello ${userInfo.name}! 👋\nHow can I assist you today?`;
    }

    if (message.includes('thank') || message.includes('thanks')) {
        return `You're welcome! 😊\nIs there anything else you'd like to know?`;
    }

    // Default response
    return `Thank you for your message! Our team will contact you soon at ${userInfo.email} or ${userInfo.phone}.\n\nYou can ask about:\n• Course Details\n• Training Schedules\n• Fees & Payment\n• Job Assistance\n• Demo Classes\n\nOr call us at: +91 98765 43210`;
}

// ==================================================
// NOTIFICATION SYSTEM
// ==================================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ==================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Observe cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .course-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

// ==================================================
// CHECK FOR RETURNING USER
// ==================================================
window.addEventListener('load', () => {
    const savedUserInfo = localStorage.getItem('chatUserInfo');
    if (savedUserInfo) {
        userInfo = JSON.parse(savedUserInfo);
    }
});

// ==================================================
// FORM VALIDATION
// ==================================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validateEmail(input.value)) {
            input.style.borderColor = '#f5576c';
            showNotification('Please enter a valid email address', 'error');
        } else {
            input.style.borderColor = '';
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#f5576c';
            showNotification('Please enter a valid phone number', 'error');
        } else {
            input.style.borderColor = '';
        }
    });
});

// ==================================================
// LOAD TESTIMONIALS FROM API
// ==================================================
async function loadTestimonials() {
    try {
        const response = await fetch('http://localhost:3000/api/testimonials');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            const testimonialsGrid = document.querySelector('.testimonials-grid');

            // Clear existing testimonials
            testimonialsGrid.innerHTML = '';

            // Map course codes to readable names
            const courseNames = {
                's4hana': 'SAP S/4 HANA',
                'fico': 'SAP FICO',
                'abap': 'SAP ABAP',
                'mm': 'SAP MM',
                'sd': 'SAP SD',
                'fiori': 'SAP Fiori',
                'hana': 'SAP HANA',
                'other': 'SAP'
            };

            // Display up to 6 testimonials
            result.data.slice(0, 6).forEach(testimonial => {
                const initials = testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const courseName = courseNames[testimonial.course] || testimonial.course;
                const roleText = testimonial.role ? `${courseName} - ${testimonial.role}` : `${courseName} Consultant`;

                const testimonialCard = document.createElement('div');
                testimonialCard.className = 'testimonial-card glass-effect';
                testimonialCard.innerHTML = `
                    <div class="testimonial-header">
                        <div class="testimonial-avatar">
                            <div class="avatar-gradient">${initials}</div>
                        </div>
                        <div class="testimonial-author">
                            <h4>${escapeHtml(testimonial.name)}</h4>
                            <p>${escapeHtml(roleText)}</p>
                        </div>
                    </div>
                    <div class="testimonial-rating">
                        ${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'.repeat(testimonial.rating)}
                    </div>
                    <p class="testimonial-text">
                        "${escapeHtml(testimonial.text)}"
                    </p>
                `;

                testimonialsGrid.appendChild(testimonialCard);

                // Add fade-in animation
                testimonialCard.style.opacity = '0';
                testimonialCard.style.transform = 'translateY(20px)';
                testimonialCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                setTimeout(() => {
                    testimonialCard.style.opacity = '1';
                    testimonialCard.style.transform = 'translateY(0)';
                }, 100);
            });
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Keep default testimonials if API fails
    }
}

// Load testimonials when page loads
window.addEventListener('load', loadTestimonials);

// ==================================================
// CONSOLE MESSAGE
// ==================================================
console.log('%c🚀 Shashank SAP Training - Modern Website', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cDev1 Branch - Ultra Modern Design with Glassmorphism & Dark Mode', 'color: #764ba2; font-size: 14px;');
console.log('%cBuilt with ❤️ for SAP Training Excellence', 'color: #4facfe; font-size: 12px;');
