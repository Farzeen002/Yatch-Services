// Email templates for yacht booking system

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}

interface FollowUpEmailData {
  userName: string;
  yachtName: string;
  yachtImage?: string;
  bookingUrl: string;
}

interface PaymentConfirmationData {
  userName: string;
  paymentId: string;
  paymentMethod: string;
  amount: number;
  transactionDate: string;
  yachtName: string;
  bookingReference: string;
}

interface BookingConfirmationData {
  userName: string;
  yachtName: string;
  yachtImage?: string;
  bookingReference: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  location: string;
  bookingId: string;
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Yacht Services</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">⚓ Welcome Aboard!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hello ${data.userName}! 👋</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Welcome to <strong>Yacht Services</strong> – your gateway to unforgettable maritime experiences!
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We're thrilled to have you join our community of yacht enthusiasts. Whether you're planning a romantic sunset cruise, a family adventure, or a corporate event, we're here to make your voyage extraordinary.
              </p>
              
              <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="color: #0369a1; margin: 0 0 10px 0; font-size: 18px;">🚤 What You Can Do:</h3>
                <ul style="color: #4b5563; margin: 10px 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Browse our fleet of luxury yachts</li>
                  <li style="margin-bottom: 8px;">Make instant bookings with secure payments</li>
                  <li style="margin-bottom: 8px;">Manage your reservations in your dashboard</li>
                  <li style="margin-bottom: 8px;">Get 24/7 customer support</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/yachts" 
                   style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Explore Yachts
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                Need help? Contact us at <a href="mailto:support@yachtservices.com" style="color: #0ea5e9; text-decoration: none;">support@yachtservices.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Yacht Services. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                You're receiving this email because you registered at yachtservices.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateFollowUpEmail(data: FollowUpEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">⏰ Don't Miss Out!</h1>
            </td>
          </tr>
          
          <!-- Yacht Image -->
          ${data.yachtImage ? `
          <tr>
            <td style="padding: 0;">
              <img src="${data.yachtImage}" alt="${data.yachtName}" style="width: 100%; height: 250px; object-fit: cover; display: block;">
            </td>
          </tr>
          ` : ''}
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hi ${data.userName},</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We noticed you were interested in <strong>${data.yachtName}</strong> but didn't complete your booking. 
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                This stunning yacht won't be available forever! Complete your booking now to secure your dates and start planning your perfect maritime adventure.
              </p>
              
              <div style="background-color: #fffbeb; border: 2px dashed #f59e0b; padding: 20px; margin: 25px 0; border-radius: 6px; text-align: center;">
                <p style="color: #92400e; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">
                   Your yacht is waiting!
                </p>
                <p style="color: #78350f; font-size: 14px; margin: 0;">
                  Complete your booking within the next 24 hours
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.bookingUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Complete Your Booking
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                Need assistance? Our team is here to help! Reply to this email or call us at <strong>+1 (555) 123-4567</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Yacht Services. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generatePaymentConfirmationEmail(data: PaymentConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <!-- Perfectly Centered Checkmark -->
          <div style="background-color: #ffffff; 
                      width: 80px; 
                      height: 80px; 
                      margin: 0 auto 15px; 
                      border-radius: 50%; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center;">
            <span style="font-size: 48px; line-height: 1; color: #10b981;">&#10003;</span>
          </div>
        </td>
      </tr>
      <tr>
        <td align="center">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Payment Successful!</h1>
        </td>
      </tr>
    </table>
  </td>
</tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Hi ${data.userName},</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Great news! Your payment has been successfully processed. Below are your payment details:
              </p>
              
              <!-- Payment Details Card -->
              <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 25px; margin: 25px 0; border-radius: 8px;">
                <h3 style="color: #166534; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #86efac; padding-bottom: 10px;">
                  💳 Payment Details
                </h3>
                
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; font-size: 14px; width: 50%;">Transaction ID:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">${data.paymentId}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Payment Method:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">${data.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Transaction Date:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">${data.transactionDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Yacht:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">${data.yachtName}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Booking Reference:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold; text-align: right;">${data.bookingReference}</td>
                  </tr>
                  <tr style="border-top: 2px solid #86efac;">
                    <td style="color: #166534; font-size: 18px; padding-top: 15px; font-weight: bold;">Total Amount:</td>
                    <td style="color: #166534; font-size: 18px; padding-top: 15px; font-weight: bold; text-align: right;">$${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #1e40af; font-size: 14px; margin: 0;">
                  📎 <strong>Receipt attached:</strong> A detailed PDF receipt has been attached to this email for your records.
                </p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Your booking will be confirmed shortly. You'll receive another email with all the details once the booking is processed.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user" 
                   style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  View My Bookings
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                Questions about your payment? Contact us at <a href="mailto:billing@yachtservices.com" style="color: #0ea5e9; text-decoration: none;">billing@yachtservices.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Yacht Services. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateBookingConfirmationEmail(data: BookingConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px 20px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="background-color: #ffffff; width: 80px; height: 80px; margin: 0 auto 15px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; line-height: 80px; vertical-align: middle;">
                      <span style="font-size: 48px; line-height: 1; vertical-align: middle;">🎉</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Booking Confirmed!</h1>
                    <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Your yacht adventure awaits</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Yacht Image -->
          ${data.yachtImage ? `
          <tr>
            <td style="padding: 0;">
              <img src="${data.yachtImage}" alt="${data.yachtName}" style="width: 100%; height: 250px; object-fit: cover; display: block;">
            </td>
          </tr>
          ` : ''}
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Congratulations, ${data.userName}! 🎊</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Your booking for <strong>${data.yachtName}</strong> has been confirmed. Get ready for an unforgettable experience on the water!
              </p>
              
              <!-- Booking Details Card with Blue Theme -->
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 25px; margin: 25px 0; border-radius: 8px;">
                <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #bfdbfe; padding-bottom: 10px;">
                  🚤 Booking Summary
                </h3>
                
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #6b7280; font-size: 14px; width: 40%;">Booking Reference:</td>
                    <td style="color: #1e40af; font-size: 14px; font-weight: bold; letter-spacing: 1px;">${data.bookingReference}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Yacht:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold;">${data.yachtName}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Location:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold;">${data.location}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Check-in Date:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold;">${data.startDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Check-out Date:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold;">${data.endDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Number of Guests:</td>
                    <td style="color: #1f2937; font-size: 14px; font-weight: bold;">${data.guests} ${data.guests === 1 ? 'Guest' : 'Guests'}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; font-size: 14px;">Status:</td>
                    <td style="color: #059669; font-size: 14px; font-weight: bold;">✓ ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #bfdbfe;">
                    <td style="color: #1e40af; font-size: 18px; padding-top: 15px; font-weight: bold;">Total Amount:</td>
                    <td style="color: #1e40af; font-size: 18px; padding-top: 15px; font-weight: bold;">$${data.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Important Information -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px;">📋 Important Information</h4>
                <ul style="color: #1e3a8a; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li>Please arrive 30 minutes before your scheduled departure</li>
                  <li>Bring a valid photo ID for all guests</li>
                  <li>Check weather conditions before your trip</li>
                  <li>Contact us 24 hours in advance for any changes</li>
                </ul>
              </div>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0; border-radius: 4px;">
                <p style="color: #166534; font-size: 14px; margin: 0;">
                  📎 <strong>Booking summary attached:</strong> A detailed PDF with your complete booking information has been attached to this email.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user" 
                   style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; margin-right: 10px;">
                  View Booking Details
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support?booking=${data.bookingId}" 
                   style="display: inline-block; background-color: #ffffff; color: #0ea5e9; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px; border: 2px solid #0ea5e9;">
                  Contact Support
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                We can't wait to welcome you aboard! 🌊⚓
              </p>
              
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 15px 0 0 0; text-align: center;">
                Need assistance? Contact us at <a href="mailto:support@yachtservices.com" style="color: #0ea5e9; text-decoration: none;">support@yachtservices.com</a> or call <strong>+1 (555) 123-4567</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Yacht Services. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
                Booking ID: ${data.bookingId}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}


