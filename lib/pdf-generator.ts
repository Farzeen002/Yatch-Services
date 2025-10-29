// PDF generation utilities for receipts and booking summaries
import { jsPDF } from 'jspdf';

interface PaymentReceiptData {
  paymentId: string;
  userName: string;
  userEmail: string;
  yachtName: string;
  bookingReference: string;
  paymentMethod: string;
  amount: number;
  transactionDate: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

interface BookingSummaryData {
  bookingId: string;
  bookingReference: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  yachtName: string;
  location: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentId: string;
  createdAt: string;
  specialRequests?: string;
}

export function generatePaymentReceipt(data: PaymentReceiptData): Buffer {
  const doc = new jsPDF();
  
  // Company Info
  const companyName = data.companyName || 'Yacht Services Inc.';
  const companyAddress = data.companyAddress || '123 Marina Boulevard, Coastal City, CA 90210';
  const companyPhone = data.companyPhone || '+1 (555) 123-4567';
  const companyEmail = data.companyEmail || 'billing@yachtservices.com';
  
  // Header - Company Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 165, 233); // Blue color
  doc.text(companyName, 105, 20, { align: 'center' });
  
  // Subheader
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('PAYMENT RECEIPT', 105, 30, { align: 'center' });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Company Details
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(companyAddress, 105, 42, { align: 'center' });
  doc.text(`Phone: ${companyPhone} | Email: ${companyEmail}`, 105, 47, { align: 'center' });
  
  // Receipt Details Box
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(249, 250, 251);
  doc.rect(20, 55, 170, 30, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt Number:', 25, 63);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentId, 65, 63);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 25, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(data.transactionDate, 65, 70);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', 25, 77);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentMethod, 65, 77);
  
  // Customer Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233);
  doc.text('BILLED TO:', 20, 95);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userName, 20, 103);
  doc.text(data.userEmail, 20, 110);
  
  // Booking Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233);
  doc.text('BOOKING DETAILS:', 20, 125);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('Yacht:', 20, 133);
  doc.setFont('helvetica', 'normal');
  doc.text(data.yachtName, 55, 133);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Ref:', 20, 140);
  doc.setFont('helvetica', 'normal');
  doc.text(data.bookingReference, 55, 140);
  
  // Payment Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(14, 165, 233);
  doc.text('PAYMENT SUMMARY:', 20, 158);
  
  // Table header
  doc.setFillColor(14, 165, 233);
  doc.rect(20, 163, 170, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 25, 168);
  doc.text('Amount', 160, 168, { align: 'right' });
  
  // Table row
  doc.setFillColor(249, 250, 251);
  doc.rect(20, 171, 170, 10, 'FD');
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.yachtName} Booking`, 25, 177);
  doc.text(`$${data.amount.toFixed(2)}`, 185, 177, { align: 'right' });
  
  // Total
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(134, 239, 172);
  doc.rect(20, 181, 170, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(22, 101, 52);
  doc.text('TOTAL PAID:', 25, 189);
  doc.text(`$${data.amount.toFixed(2)}`, 185, 189, { align: 'right' });
  
  // Status Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(20, 200, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PAID', 40, 206.5, { align: 'center' });
  
  // Footer Note
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Yacht Services!', 105, 225, { align: 'center' });
  
  // Footer - Small print
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('This is an automatically generated receipt. No signature required.', 105, 270, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 275, { align: 'center' });
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}

export function generateBookingSummary(data: BookingSummaryData): Buffer {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246); // Purple color
  doc.text('BOOKING CONFIRMATION', 105, 20, { align: 'center' });
  
  // Booking Reference Box
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(50, 30, 110, 15, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(107, 33, 168);
  doc.text('Booking Reference', 105, 37, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.bookingReference, 105, 42.5, { align: 'center' });
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 50, 190, 50);
  
  // Customer Information Section
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER INFORMATION', 20, 60);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  
  let yPos = 68;
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userName, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userEmail, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.userPhone || 'Not provided', 55, yPos);
  
  // Yacht & Booking Details Section
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.setFont('helvetica', 'bold');
  doc.text('YACHT & BOOKING DETAILS', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Yacht Name:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.yachtName, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Location:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.location, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Check-in Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.startDate, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Check-out Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.endDate, 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Number of Guests:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.guests.toString(), 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Status:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(5, 150, 105);
  doc.text(data.status.toUpperCase(), 55, yPos);
  doc.setTextColor(60, 60, 60);
  
  // Payment Information Section
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT INFORMATION', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  const paymentColor = data.paymentStatus === 'completed' ? [5, 150, 105] : [234, 179, 8];
  doc.setTextColor(paymentColor[0], paymentColor[1], paymentColor[2]);
  doc.text(data.paymentStatus.toUpperCase(), 55, yPos);
  doc.setTextColor(60, 60, 60);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment ID:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentId || 'Pending', 55, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Created:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(data.createdAt, 55, yPos);
  
  // Total Amount Box
  yPos += 12;
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(20, yPos, 170, 15, 2, 2, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(107, 33, 168);
  doc.text('TOTAL AMOUNT:', 25, yPos + 10);
  doc.setFontSize(14);
  doc.text(`$${data.totalPrice.toFixed(2)}`, 185, yPos + 10, { align: 'right' });
  
  // Special Requests (if any)
  if (data.specialRequests) {
    yPos += 25;
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('SPECIAL REQUESTS:', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(data.specialRequests, 170);
    doc.text(splitText, 20, yPos);
  }
  
  // Important Notes
  yPos = 235;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(20, yPos, 170, 25, 2, 2, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT INFORMATION:', 25, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('• Please arrive 30 minutes before scheduled departure', 25, yPos + 12);
  doc.text('• Bring valid photo ID for all guests', 25, yPos + 17);
  doc.text('• Contact us 24 hours in advance for any changes', 25, yPos + 22);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Yacht Services! We look forward to serving you.', 105, 270, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text(`Booking ID: ${data.bookingId}`, 105, 278, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 283, { align: 'center' });
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}


