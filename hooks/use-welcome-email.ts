// Hook to send welcome email on first login
'use client';

import { useEffect, useState } from 'react';

export function useWelcomeEmail() {
  const [emailSent, setEmailSent] = useState(false);

  const sendWelcomeEmail = async () => {
    try {
      // Check if welcome email was already sent (localStorage)
      const welcomeEmailSent = localStorage.getItem('welcome_email_sent');
      
      if (welcomeEmailSent === 'true') {
        return; // Already sent
      }

      const response = await fetch('/api/emails/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        localStorage.setItem('welcome_email_sent', 'true');
        setEmailSent(true);
        console.log(' Welcome email sent successfully');
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - welcome email is not critical
    }
  };

  return { sendWelcomeEmail, emailSent };
}

// Auto-send on mount (for login pages)
export function useAutoWelcomeEmail() {
  const { sendWelcomeEmail, emailSent } = useWelcomeEmail();

  useEffect(() => {
    sendWelcomeEmail();
  }, []);

  return emailSent;
}


