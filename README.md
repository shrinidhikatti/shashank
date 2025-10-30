# Shashank SAP Training Website

A professional, modern website for SAP training courses with an interactive chatbox feature for lead generation.

## Features

### 🎯 Main Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean, professional design inspired by leading training websites
- **Interactive Chatbox** - Bottom-right chat widget with mandatory signup (email + mobile)
- **Course Showcase** - Display all SAP courses with detailed information
- **Contact Forms** - Multiple ways for potential students to reach out
- **Smooth Animations** - Professional scroll animations and transitions
- **Mobile Menu** - Hamburger menu for mobile devices

### 📚 Sections Included
1. **Navigation Bar** - Sticky header with smooth scroll navigation
2. **Hero Section** - Eye-catching banner with call-to-action buttons
3. **About Section** - Information about the training and instructor
4. **Services Section** - 6 key services offered
5. **Courses Section** - 9 SAP courses with detailed descriptions
6. **Testimonials** - Student success stories
7. **Registration CTA** - Call-to-action for course registration
8. **Contact Section** - Contact form and information
9. **Footer** - Links and social media connections
10. **Chat Widget** - Interactive chatbox with lead capture

### 💬 Chatbox Features
- Fixed position in bottom-right corner
- Mandatory signup before chatting (Name, Email, Phone)
- Smart bot responses based on user queries
- Saves user information in browser storage
- Handles queries about:
  - Course information
  - Fees and payment
  - Schedule and batches
  - Job assistance
  - Demo classes
  - Contact information

## Files Included

```
shashank/
├── index.html       # Main HTML structure
├── styles.css       # All styling and responsive design
├── script.js        # JavaScript for interactivity and chatbox
└── README.md        # This file
```

## How to Use

### Local Testing
1. Simply open `index.html` in any modern web browser
2. All files are linked correctly with relative paths
3. No server required for local testing

### Deploying Online

#### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files (index.html, styles.css, script.js)
3. Go to Settings > Pages
4. Select main branch and save
5. Your site will be live at `https://yourusername.github.io/repository-name`

#### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire folder
3. Site will be live instantly
4. You can connect a custom domain

#### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your project or drag and drop
3. Deploy with one click

#### Option 4: Traditional Web Hosting
1. Upload all files to your hosting via FTP
2. Make sure index.html is in the root directory
3. Access via your domain name

## Customization Guide

### Update Business Information

#### Contact Details (Multiple locations to update)
1. **Hero Section** - Update phone numbers and location
2. **Contact Section** (index.html lines 411-433) - Update all contact info
3. **Chat Responses** (script.js) - Update phone/email in bot responses
4. **Footer** - Update company information

#### Course Content
- Edit course descriptions in `index.html` (lines 203-384)
- Add or remove courses by copying/modifying course-card sections
- Update course details, pricing, duration as needed

#### Colors and Branding
Edit `styles.css` variables (lines 10-18):
```css
:root {
    --primary-color: #1a73e8;  /* Main brand color */
    --secondary-color: #34a853; /* Accent color */
    --dark-color: #2a2a2a;      /* Text color */
}
```

#### Images (Optional Enhancement)
- Add logo: Replace "Shashank SAP Training" text with `<img>` tag
- Add course images: Add images inside course-card-header
- Add hero background: Update hero section with background image

### Chatbox Customization

#### Initial Bot Messages
Edit `script.js` (lines 133-143) to change welcome messages

#### Bot Responses
Edit `script.js` (lines 181-330) to customize automatic responses based on keywords

#### Form Fields
Modify signup form in `index.html` (lines 489-503) to add/remove fields

## Lead Capture

The chatbox captures:
- User Name
- Email Address
- Phone Number
- Timestamp
- All conversation messages

### Where Leads Are Stored
Currently: Browser's localStorage (for demo purposes)

### To Collect Leads for Real:

#### Option 1: Email Service (Simplest)
Use EmailJS or FormSubmit to send lead info to your email:
```javascript
// Add to script.js after line 125
fetch('https://formsubmit.co/your@email.com', {
    method: 'POST',
    body: JSON.stringify(userInfo)
});
```

#### Option 2: Google Sheets (Free)
Use Google Apps Script to save leads to spreadsheet

#### Option 3: Backend Server
Connect to your own backend API to store in database

#### Option 4: CRM Integration
Integrate with Zoho, HubSpot, or Salesforce APIs

## Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Opera (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lightweight: ~50KB total (HTML + CSS + JS)
- No external dependencies
- Fast loading time
- Optimized for SEO

## SEO Optimization
The website includes:
- Meta description
- Semantic HTML5
- Proper heading hierarchy
- Alt text ready for images
- Mobile-friendly design

## Future Enhancements

### Suggested Additions:
1. **Add Real Images**
   - Professional photos of instructor
   - Training center images
   - Student success photos

2. **Video Integration**
   - Course preview videos
   - Testimonial videos
   - Demo class recordings

3. **Backend Integration**
   - Real form submission to email/database
   - Payment gateway integration
   - Student login portal

4. **Advanced Features**
   - Course calendar with booking
   - Online payment system
   - Blog section for SEO
   - Student portal
   - Certificate verification

5. **Analytics**
   - Google Analytics integration
   - Facebook Pixel
   - Conversion tracking

6. **Marketing**
   - WhatsApp integration
   - Email newsletter signup
   - Social media feeds
   - Reviews/ratings integration

## Support

For customization help or questions:
- Check the inline comments in the code
- Each section is clearly labeled
- Modify step by step and test after each change

## License

This website is created for Shashank SAP Training. All rights reserved.

## Credits

Built with:
- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Open Sans, Roboto)

---

**Note**: Remember to update all placeholder contact information (phone numbers, email addresses, location) with real details before going live!
