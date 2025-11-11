import nodemailer from "nodemailer";

/**
 * Email Service for BookLink
 * Handles all email notifications
 */

// Create reusable transporter
const createTransporter = () => {
  // For development: Use Ethereal Email (fake SMTP)
  // For production: Use Gmail, SendGrid, AWS SES, etc.
  
  if (process.env.NODE_ENV === "production") {
    // Production configuration (Gmail example)
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  } else {
    // Development configuration (Ethereal)
    // Note: You need to create an Ethereal account or use mailtrap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.ethereal.email",
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || "your-ethereal-user@ethereal.email",
        pass: process.env.EMAIL_PASSWORD || "your-ethereal-password",
      },
    });
  }
};

// Email templates
const emailTemplates = {
  // User approval email
  userApproval: (userName, userEmail) => ({
    subject: " Your BookLink Account Has Been Approved!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Welcome to BookLink!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Great news! Your BookLink account has been approved by our admin team.</p>
            
            <p><strong>You can now:</strong></p>
            <ul>
              <li> List your books for sale or rent</li>
              <li> Browse and purchase books</li>
              <li> Leave reviews and ratings</li>
              <li> Connect with other book lovers</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
                Start Exploring Books
              </a>
            </center>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Happy reading! </p>
            <p><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email from BookLink. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${userName}!
      
      Great news! Your BookLink account has been approved.
      
      You can now:
      - List your books for sale or rent
      - Browse and purchase books
      - Leave reviews and ratings
      - Connect with other book lovers
      
      Login at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login
      
      Happy reading!
      The BookLink Team
    `,
  }),

  // User rejection email (optional)
  userRejection: (userName, reason) => ({
    subject: "BookLink Account Application Update",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> BookLink Account Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for your interest in BookLink.</p>
            <p>Unfortunately, we're unable to approve your account at this time.</p>
            
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            
            <p>If you believe this is an error or would like to appeal this decision, please contact our support team.</p>
            
            <p>Best regards,<br><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Book approval email
  bookApproval: (userName, bookTitle, bookId) => ({
    subject: ` Your Book "${bookTitle}" Has Been Approved!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Book Approved!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Excellent news! Your book listing has been approved and is now live on BookLink.</p>
            
            <p><strong>Book Title:</strong> ${bookTitle}</p>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li> Your book is now visible to all users</li>
              <li> Buyers can purchase or rent it</li>
              <li> Track views and interest in your dashboard</li>
              <li> You'll be notified of any inquiries</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/books/${bookId}" class="button">
                View Your Listing
              </a>
            </center>
            
            <p>Thank you for contributing to our book community!</p>
            
            <p>Best regards,<br><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Book rejection email
  bookRejection: (userName, bookTitle, reason) => ({
    subject: `Book Listing Update: "${bookTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Book Listing Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for submitting your book listing to BookLink.</p>
            <p>After review, we're unable to approve the following book at this time:</p>
            
            <p><strong>Book Title:</strong> ${bookTitle}</p>
            
            <div class="reason-box">
              <p><strong> Reason for rejection:</strong></p>
              <p>${reason || 'Does not meet our listing quality standards'}</p>
            </div>
            
            <p><strong>What you can do:</strong></p>
            <ul>
              <li> Update your listing to address the concerns</li>
              <li> Add better quality images</li>
              <li> Improve the description</li>
              <li> Contact support if you have questions</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-books" class="button">
                Update Your Listing
              </a>
            </center>
            
            <p>We appreciate your understanding and look forward to seeing your updated listing!</p>
            
            <p>Best regards,<br><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Transaction notification
  transactionCreated: (sellerName, buyerName, bookTitle, transactionType, price) => ({
    subject: `🔔 New ${transactionType} Request: "${bookTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .transaction-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 New Transaction!</h1>
          </div>
          <div class="content">
            <h2>Hello ${sellerName}! 👋</h2>
            <p>You have a new ${transactionType.toLowerCase()} request for your book!</p>
            
            <div class="transaction-details">
              <p><strong> Book:</strong> ${bookTitle}</p>
              <p><strong> ${transactionType === 'Buy' ? 'Buyer' : 'Renter'}:</strong> ${buyerName}</p>
              <p><strong> Amount:</strong> $${price.toFixed(2)}</p>
              <p><strong> Type:</strong> ${transactionType}</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li> Check your transaction dashboard</li>
              <li> Contact the ${transactionType === 'Buy' ? 'buyer' : 'renter'} if needed</li>
              <li> Arrange pickup/delivery details</li>
              <li> Mark as completed when done</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/transactions" class="button">
                View Transaction
              </a>
            </center>
            
            <p>Best regards,<br><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Welcome email for new users
  welcomeEmail: (userName, userEmail) => ({
    subject: " Welcome to BookLink!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Welcome to BookLink!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! </h2>
            <p>Thank you for joining BookLink, the community marketplace for book lovers!</p>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li> Your account is pending approval (usually within 24 hours)</li>
              <li> You'll receive an email once approved</li>
              <li> Then you can start listing and buying books</li>
            </ul>
            
            <p><strong>While you wait, you can:</strong></p>
            <ul>
              <li> Complete your profile</li>
              <li> Browse available books</li>
              <li> Explore different genres</li>
            </ul>
            
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/books" class="button">
                Browse Books
              </a>
            </center>
            
            <p>We're excited to have you in our community!</p>
            
            <p>Best regards,<br><strong>The BookLink Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BookLink. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    
    // Get template
    let emailContent;
    switch (template) {
      case "userApproval":
        emailContent = emailTemplates.userApproval(data.userName, data.userEmail);
        break;
      case "userRejection":
        emailContent = emailTemplates.userRejection(data.userName, data.reason);
        break;
      case "bookApproval":
        emailContent = emailTemplates.bookApproval(data.userName, data.bookTitle, data.bookId);
        break;
      case "bookRejection":
        emailContent = emailTemplates.bookRejection(data.userName, data.bookTitle, data.reason);
        break;
      case "transactionCreated":
        emailContent = emailTemplates.transactionCreated(
          data.sellerName,
          data.buyerName,
          data.bookTitle,
          data.transactionType,
          data.price
        );
        break;
      case "welcomeEmail":
        emailContent = emailTemplates.welcomeEmail(data.userName, data.userEmail);
        break;
      default:
        throw new Error("Invalid email template");
    }

    const mailOptions = {
      from: `"BookLink" <${process.env.EMAIL_FROM || 'noreply@booklink.com'}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(` Email sent to ${to}: ${info.messageId}`);
    
    // For development with Ethereal, show preview URL
    if (process.env.NODE_ENV !== "production") {
      console.log(` Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(` Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

// Bulk email function
export const sendBulkEmails = async (recipients, template, data) => {
  const results = await Promise.allSettled(
    recipients.map((to) => sendEmail(to, template, data))
  );
  
  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  
  console.log(`📊 Bulk email results: ${successful} sent, ${failed} failed`);
  
  return { successful, failed, results };
};

export default { sendEmail, sendBulkEmails };