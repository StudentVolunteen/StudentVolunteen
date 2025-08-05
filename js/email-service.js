// EmailJS Configuration
const EMAILJS_CONFIG = {
    serviceId: 'service_j8udg93',
    templateId: 'template_a32mu4y', // Correct template ID
    publicKey: 'ABPmaI32bL70ViO06'
};

class EmailService {
    constructor() {
        this.serviceId = EMAILJS_CONFIG.serviceId;
        this.templateId = EMAILJS_CONFIG.templateId;
        this.publicKey = EMAILJS_CONFIG.publicKey;
        this.initializeEmailJS();
    }

    initializeEmailJS() {
        // Load EmailJS SDK if not already loaded
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.publicKey);
                console.log('EmailJS initialized successfully');
            };
            document.head.appendChild(script);
        } else {
            emailjs.init(this.publicKey);
            console.log('EmailJS already loaded, initialized');
        }
    }

    async sendVolunteerApprovalEmail(eventData, studentData, hours) {
        try {
            console.log('Sending EmailJS email...', { eventData, studentData, hours });

            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not loaded, falling back to mock email');
                return this.sendMockEmail(eventData, studentData, hours);
            }

            // Prepare template parameters
            const templateParams = {
                supervisor_name: eventData.supervisorMail.split('@')[0], // Extract name from email
                event_title: eventData.firstName,
                student_name: studentData.student_name,
                hours: hours,
                event_date: eventData.eventDate,
                approval_link: `${window.location.origin}/event-approval.html?supervisorEmail=${encodeURIComponent(eventData.supervisorMail)}&event=${encodeURIComponent(eventData.firstName)}&eventId=${eventData.id}`
            };

            console.log('Template parameters:', templateParams);
            console.log('EmailJS config:', { serviceId: this.serviceId, templateId: this.templateId, publicKey: this.publicKey });

            // Send email using EmailJS
            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                templateParams
            );

            console.log('EmailJS response:', response);
            
            // Also store in localStorage for backup
            this.sendMockEmail(eventData, studentData, hours);
            
            return { success: true, message: 'Email sent successfully via EmailJS' };
        } catch (error) {
            console.error('EmailJS error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            
            // Fallback to mock email
            console.log('Falling back to mock email...');
            return this.sendMockEmail(eventData, studentData, hours);
        }
    }

    sendMockEmail(eventData, studentData, hours) {
        try {
            const emailData = {
                id: Date.now(),
                to: eventData.supervisorMail,
                subject: `Volunteer Approval Request - ${eventData.firstName}`,
                body: this.generateEmailBody(eventData, studentData, hours),
                timestamp: new Date().toISOString(),
                eventId: eventData.id,
                eventTitle: eventData.firstName,
                supervisorEmail: eventData.supervisorMail
            };

            // Get existing emails or initialize empty array
            const existingEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
            existingEmails.push(emailData);
            localStorage.setItem('sent_emails', JSON.stringify(existingEmails));

            console.log('Mock email stored:', emailData);
            return { success: true, message: 'Mock email sent successfully' };
        } catch (error) {
            console.error('Mock email error:', error);
            return { success: false, message: 'Failed to send mock email' };
        }
    }

    generateEmailBody(eventData, studentData, hours) {
        const approvalLink = `${window.location.origin}/event-approval.html?supervisorEmail=${encodeURIComponent(eventData.supervisorMail)}&event=${encodeURIComponent(eventData.firstName)}&eventId=${eventData.id}`;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 24px; font-weight: bold; color: #007bff; margin-bottom: 10px;">VolunTEEN</div>
                        <h2>Volunteer Approval Request</h2>
                    </div>
                    
                    <p>Hello ${eventData.supervisorMail.split('@')[0]},</p>
                    
                    <p>A student has signed up for your volunteer event and is awaiting your approval.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Event Details:</h3>
                        <p><strong>Event:</strong> ${eventData.firstName}</p>
                        <p><strong>Student:</strong> ${studentData.student_name}</p>
                        <p><strong>Hours Requested:</strong> ${hours} hours</p>
                        <p><strong>Date:</strong> ${eventData.eventDate}</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="${approvalLink}" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 20px 0;">
                            Approve Volunteers for Your Event
                        </a>
                    </div>
                    
                    <p>Click the button above to review and approve volunteers for this event.</p>
                    
                    <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                        <p>This is an automated message from VolunTEEN</p>
                    </div>
                </div>
            </div>
        `;
    }

    getSentEmails() {
        try {
            return JSON.parse(localStorage.getItem('sent_emails') || '[]');
        } catch (error) {
            console.error('Error getting sent emails:', error);
            return [];
        }
    }

    clearSentEmails() {
        try {
            localStorage.removeItem('sent_emails');
            console.log('Sent emails cleared');
        } catch (error) {
            console.error('Error clearing sent emails:', error);
        }
    }

    // Test EmailJS connection
    async testEmailJS() {
        try {
            console.log('Testing EmailJS connection...');
            
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not loaded');
                return { success: false, message: 'EmailJS not loaded' };
            }

            const testParams = {
                supervisor_name: 'Test User',
                event_title: 'Test Event',
                student_name: 'Test Student',
                hours: '2',
                event_date: '2024-01-01',
                approval_link: 'https://example.com'
            };

            const response = await emailjs.send(
                this.serviceId,
                this.templateId,
                testParams
            );

            console.log('EmailJS test successful:', response);
            return { success: true, message: 'EmailJS test successful' };
        } catch (error) {
            console.error('EmailJS test failed:', error);
            return { success: false, message: `EmailJS test failed: ${error.message}` };
        }
    }
}

// Export the EmailService class
export default EmailService; 