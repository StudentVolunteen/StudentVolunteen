// Mock Email Service for VolunTEEN
// In a real application, this would integrate with services like SendGrid, Mailgun, or AWS SES

class EmailService {
    constructor() {
        this.sentEmails = JSON.parse(localStorage.getItem('volunteen_sent_emails') || '[]');
    }

    // Simulate sending an email to a supervisor
    async sendVolunteerApprovalEmail(supervisorEmail, eventTitle, studentEmail, eventId) {
        console.log('EmailService: Starting to send email');
        console.log('EmailService: supervisorEmail =', supervisorEmail);
        console.log('EmailService: eventTitle =', eventTitle);
        console.log('EmailService: studentEmail =', studentEmail);
        console.log('EmailService: eventId =', eventId);
        
        const emailData = {
            id: Date.now().toString(),
            to: supervisorEmail,
            subject: `New Volunteer Signup for "${eventTitle}"`,
            body: this.generateEmailBody(eventTitle, studentEmail, supervisorEmail),
            timestamp: new Date().toISOString(),
            eventTitle: eventTitle,
            studentEmail: studentEmail,
            eventId: eventId,
            status: 'sent'
        };

        // Store the email in localStorage (simulating email sent)
        this.sentEmails.push(emailData);
        localStorage.setItem('volunteen_sent_emails', JSON.stringify(this.sentEmails));

        console.log('Email sent to supervisor:', emailData);
        
        // In a real app, this would actually send the email
        // For demo purposes, we'll just log it and show a success message
        return {
            success: true,
            messageId: emailData.id,
            emailData: emailData
        };
    }

    generateEmailBody(eventTitle, studentEmail, supervisorEmail) {
        const approvalUrl = `${window.location.origin}/supervisor-approval.html?email=${encodeURIComponent(supervisorEmail)}&event=${encodeURIComponent(eventTitle)}`;
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2 style="color: #007bff; margin-bottom: 20px;">VolunTEEN - New Volunteer Signup</h2>
                    
                    <p style="font-size: 16px; margin-bottom: 15px;">
                        A new volunteer has signed up for your event:
                    </p>
                    
                    <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #333; margin-bottom: 10px;">${eventTitle}</h3>
                        <p style="color: #666; margin: 0;">
                            <strong>Student:</strong> ${studentEmail || 'demo'}
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
                        Please review and approve or reject this volunteer's signup.
                    </p>
                    
                    <a href="${approvalUrl}" 
                       style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                        Approve Volunteers for Your Event
                    </a>
                    
                    <p style="font-size: 12px; color: #999; margin-top: 25px;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${approvalUrl}" style="color: #007bff;">${approvalUrl}</a>
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #999;">
                        This is an automated message from VolunTEEN. Please do not reply to this email.
                    </p>
                </div>
            </div>
        `;
    }

    // Get all sent emails (for admin purposes)
    getSentEmails() {
        return this.sentEmails;
    }

    // Clear sent emails (for cleanup)
    clearSentEmails() {
        this.sentEmails = [];
        localStorage.setItem('volunteen_sent_emails', JSON.stringify(this.sentEmails));
    }
}

// Export for use in other modules
export default EmailService; 