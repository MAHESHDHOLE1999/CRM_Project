// File: backend/controllers/billController.js
import puppeteer from 'puppeteer';
import AdvancedBooking from '../models/AdvancedBooking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translations = {
  en: {
    billTitle: 'ADVANCE BOOKING INVOICE',
    invoiceDetails: 'Invoice Details',
    invoiceNumber: 'Booking #',
    date: 'Booking Date',
    dueDate: 'Event Date',
    billTo: 'Customer Details',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    itemDescription: 'Item Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    sNo: 'S.No',
    subtotal: 'Subtotal',
    depositAmount: 'Deposit Amount',
    totalDue: 'TOTAL AMOUNT',
    paymentInformation: 'Payment Information',
    depositReceived: 'Deposit Received',
    amountGiven: 'Amount Given',
    balanceDue: 'Balance Due',
    termsConditions: 'Terms & Conditions',
    term1: 'This is an advance booking confirmation.',
    term2: 'Items will be reserved until the booked date.',
    term3: 'Full payment must be settled before the event date.',
    term4: 'Cancellation must be done 7 days in advance.',
    bookingStatus: 'Booking Status',
    startTime: 'Start Time',
    endTime: 'End Time',
    notes: 'Notes',
    customerSignature: 'Customer Signature',
    authorizedSignature: 'Authorized Signature',
    thankYou: 'Thank you for booking with us!',
    generatedOn: 'Generated on',
    companyName: 'AJAY GADHI BHANDAR',
    tagline: 'Premium Event Rental Solutions',
    address1: 'Shipi Galli, Yevla - 423401',
    address2: 'District Nashik, Maharashtra',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+91 9226472249',
    phone2: '+91 9405557668',
    status: 'Status'
  },
  mr: {
    billTitle: 'अग्रिम बुकिंग बिल',
    invoiceDetails: 'बिल तपशील',
    invoiceNumber: 'बुकिंग क्र. #',
    date: 'बुकिंग तारीख',
    dueDate: 'इव्हेंट तारीख',
    billTo: 'ग्राहक तपशील',
    phone: 'फोन',
    email: 'ईमेल',
    address: 'पता',
    itemDescription: 'वस्तूचे वर्णन',
    qty: 'प्रमाण',
    unitPrice: 'एकक किंमत',
    amount: 'रक्कम',
    sNo: 'क्र.',
    subtotal: 'उप-एकूण',
    depositAmount: 'जमा रक्कम',
    totalDue: 'एकूण रक्कम',
    paymentInformation: 'भुगतान माहिती',
    depositReceived: 'जमा केलेली रक्कम',
    amountGiven: 'दिलेली रक्कम',
    balanceDue: 'शिल्लक देय',
    termsConditions: 'अटी व शर्ती',
    term1: 'हे अग्रिम बुकिंग पुष्टीकरण आहे.',
    term2: 'वस्तू बुक केलेल्या तारखेपर्यंत राखीव असतील.',
    term3: 'इव्हेंटच्या तारखेपूर्वी संपूर्ण भुगतान करणे आवश्यक आहे.',
    term4: 'रद्दीकरण ७ दिवसांचा फेरबदल सूचना आवश्यक आहे.',
    bookingStatus: 'बुकिंग स्थिती',
    startTime: 'सुरुवाती वेळ',
    endTime: 'समाप्ती वेळ',
    notes: 'टिप्पणी',
    customerSignature: 'ग्राहकाची स्वाक्षरी',
    authorizedSignature: 'अधिकृत स्वाक्षरी',
    thankYou: 'आमच्याकडे बुकिंग केल्याबद्दल धन्यवाद!',
    generatedOn: 'निर्माण केलेले',
    companyName: 'अजय घडी भंडार',
    tagline: 'प्रीमियम इव्हेंट किराया समाधान',
    address1: 'शिपी गल्ली, येवला - 423401',
    address2: 'जिल्हा नाशिक, महाराष्ट्र',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+९१ ९२२६४७२२४९',
    phone2: '+९१ ९४०५५५७६६८',
    status: 'स्थिती'
  }
};

export const generateBookingBill = async (req, res) => {
  let browser;
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    if (!['en', 'mr'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    const t = translations[language];
    const booking = await AdvancedBooking.findById(id).lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const billNo = booking._id.toString().slice(-6);
    const bookingDate = new Date(booking.bookingDate);
    const dateStr = `${bookingDate.getDate()}/${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()}`;
    const dueDateStr = dateStr; // Event date is the booking date

    // Parse items
    let items = [];
    try {
      items = typeof booking.items === 'string' ? JSON.parse(booking.items) : booking.items || [];
    } catch (e) {
      items = [];
    }

    const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalAmount = booking.totalAmount || itemsTotal;

    // Load logo
    let logoImg = '';
    const logoPath = path.join(__dirname, '../images/logo.png');
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      const logoBase64 = logoData.toString('base64');
      logoImg = `<img src="data:image/png;base64,${logoBase64}" style="max-width: 300px; max-height: 150px; object-fit: contain;" />`;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.billTitle} ${billNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${language === 'mr' ? "'Noto Sans Devanagari', Arial, sans-serif" : "Arial, sans-serif"};
      background: white;
      color: #333;
      line-height: 1.6;
    }
    
    .page {
      width: 100%;
      padding: 20px;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 3px solid #8B4513;
      padding-bottom: 15px;
      position: relative;
    }
    
    .phone-header {
      position: absolute;
      top: 5px;
      right: 0;
      font-size: 10px;
      font-weight: bold;
      line-height: 1.4;
    }
    
    .logo-section {
      margin-bottom: 10px;
    }
    
    .bill-title {
      font-size: 18px;
      font-weight: bold;
      color: #8B4513;
      margin: 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .company-tagline {
      font-size: 11px;
      color: #666;
      margin: 3px 0;
    }
    
    .company-address {
      font-size: 10px;
      color: #666;
      margin: 2px 0;
    }
    
    .contact-info {
      font-size: 9px;
      color: #666;
      margin-top: 5px;
    }
    
    .invoice-header {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .invoice-info, .bill-to {
      flex: 1;
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
    }
    
    .section-title {
      color: #8B4513;
      font-size: 10px;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
      border-bottom: 2px solid #8B4513;
      padding-bottom: 3px;
    }
    
    .invoice-number {
      font-size: 14px;
      color: #DC143C;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .info-row {
      font-size: 9px;
      margin: 2px 0;
      color: #555;
    }
    
    .booking-details {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 9px;
    }
    
    .detail-box {
      flex: 1;
      padding: 8px;
      background: #f0f8ff;
      border: 1px solid #87ceeb;
    }
    
    .detail-label {
      color: #8B4513;
      font-weight: bold;
      font-size: 8px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .detail-value {
      font-size: 10px;
      color: #333;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9px;
    }
    
    thead {
      background: #8B4513;
      color: white;
    }
    
    th {
      padding: 8px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #8B4513;
    }
    
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    
    tbody tr:nth-child(odd) {
      background: #f9f9f9;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals-section {
      margin-bottom: 15px;
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 250px;
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 9px;
    }
    
    .summary-row.total {
      background: #8B4513;
      color: white;
      padding: 8px;
      margin: 5px -10px -10px -10px;
      font-weight: bold;
      font-size: 10px;
    }
    
    .summary-label {
      font-weight: 500;
    }
    
    .payment-section {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .payment-box {
      flex: 1;
      padding: 10px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 9px;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    
    .balance-value {
      color: #DC143C;
      font-weight: bold;
    }
    
    .terms-section {
      background: #f5f5f5;
      padding: 10px;
      border: 1px solid #ddd;
      margin-bottom: 15px;
      font-size: 8px;
    }
    
    .terms-section h3 {
      color: #8B4513;
      font-size: 9px;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
      border-bottom: 2px solid #8B4513;
      padding-bottom: 3px;
    }
    
    .terms-list {
      margin-left: 15px;
    }
    
    .terms-list li {
      margin-bottom: 2px;
      line-height: 1.4;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
    }
    
    .signature-box {
      width: 150px;
      text-align: center;
      font-size: 8px;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      margin-bottom: 3px;
      height: 20px;
    }
    
    .footer-text {
      text-align: center;
      font-size: 8px;
      color: #999;
      margin-top: 15px;
      padding-top: 5px;
      border-top: 1px solid #ddd;
    }
    
    .empty-row {
      height: 15px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #4CAF50;
      color: white;
      font-size: 8px;
      border-radius: 3px;
      font-weight: bold;
    }
    
    .status-badge.pending {
      background: #FF9800;
    }
    
    .status-badge.cancelled {
      background: #F44336;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="phone-header">📞 ${t.phone1}<br>${t.phone2}</div>
      <div class="logo-section">${logoImg}</div>
      <div class="bill-title">${t.billTitle}</div>
      <div class="company-tagline">${t.tagline}</div>
      <div class="company-address">${t.address1}<br>${t.address2}</div>
      <div class="contact-info">📧 ${t.email}</div>
    </div>
    
    <div class="invoice-header">
      <div class="invoice-info">
        <div class="section-title">${t.invoiceDetails}</div>
        <div class="invoice-number">${t.invoiceNumber}${billNo}</div>
        <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
        <div class="info-row"><strong>${t.dueDate}:</strong> ${dueDateStr}</div>
      </div>
      
      <div class="bill-to">
        <div class="section-title">${t.billTo}</div>
        <div class="info-row"><strong>${booking.customerName || 'N/A'}</strong></div>
        <div class="info-row"><strong>${t.phone}:</strong> ${booking.phone || 'N/A'}</div>
        <div class="info-row"><strong>${t.email}:</strong> ${booking.email || 'N/A'}</div>
      </div>
    </div>
    
    <div class="booking-details">
      <div class="detail-box">
        <div class="detail-label">${t.bookingStatus}</div>
        <div class="detail-value">
          <span class="status-badge ${booking.status?.toLowerCase()}">${booking.status || 'Pending'}</span>
        </div>
      </div>
      <div class="detail-box">
        <div class="detail-label">${t.startTime}</div>
        <div class="detail-value">${booking.startTime || 'N/A'}</div>
      </div>
      <div class="detail-box">
        <div class="detail-label">${t.endTime}</div>
        <div class="detail-value">${booking.endTime || 'N/A'}</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">${t.sNo}</th>
          <th style="width: 48%;">${t.itemDescription}</th>
          <th style="width: 12%; text-align: center;">${t.qty}</th>
          <th style="width: 16%; text-align: right;">${t.unitPrice}</th>
          <th style="width: 16%; text-align: right;">${t.amount}</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, index) => {
          const amount = (item.quantity || 0) * (item.price || 0);
          return `<tr>
            <td class="text-center">${index + 1}</td>
            <td>${item.itemName || 'N/A'}</td>
            <td class="text-center">${item.quantity || 0}</td>
            <td class="text-right">Rs. ${(item.price || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
          </tr>`;
        }).join('')}
        <tr class="empty-row"><td colspan="5"></td></tr>
        <tr class="empty-row"><td colspan="5"></td></tr>
      </tbody>
    </table>
    
    <div class="totals-section">
      <div class="summary-box">
        <div class="summary-row">
          <span class="summary-label">${t.subtotal}:</span>
          <span>Rs. ${itemsTotal.toLocaleString('en-IN')}</span>
        </div>
        ${booking.depositAmount && booking.depositAmount > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.depositAmount}:</span>
          <span>Rs. ${booking.depositAmount.toLocaleString('en-IN')}</span>
        </div>` : ''}
        <div class="summary-row total">
          <span class="summary-label">${t.totalDue}:</span>
          <span>Rs. ${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <div class="payment-section">
      <div class="payment-box">
        <div class="section-title">${t.paymentInformation}</div>
        <div class="payment-row">
          <span>${t.depositReceived}:</span>
          <span>Rs. ${(booking.depositAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.amountGiven}:</span>
          <span>Rs. ${(booking.givenAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.balanceDue}:</span>
          <span class="balance-value">Rs. ${(booking.remainingAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    ${booking.notes ? `<div style="background: #fffacd; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 9px;">
      <strong>${t.notes}:</strong> ${booking.notes}
    </div>` : ''}
    
    <div class="terms-section">
      <h3>${t.termsConditions}</h3>
      <ul class="terms-list">
        <li>${t.term1}</li>
        <li>${t.term2}</li>
        <li>${t.term3}</li>
        <li>${t.term4}</li>
      </ul>
    </div>
    
    <div class="footer">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div>${t.customerSignature}</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div>${t.authorizedSignature}</div>
      </div>
    </div>
    
    <div class="footer-text">
      ${t.thankYou} 🙏<br>
      ${t.generatedOn}: ${new Date().toLocaleString('en-IN')}
    </div>
  </div>
</body>
</html>`;

    // console.log('📄 Starting Booking PDF generation...');
    logger.info('📄 Starting Booking PDF generation...');

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 30000
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      printBackground: true
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      // console.error('❌ PDF buffer is empty');
      logger.error('❌ PDF buffer is empty');
      return res.status(500).json({ success: false, message: 'PDF generation failed' });
    }

    // console.log(`✅ Booking PDF generated: ${pdfBuffer.length} bytes`);
    logger.info(`✅ Booking PDF generated: ${pdfBuffer.length} bytes`);

    const fileName = `BookingBill_${booking.customerName}_${billNo}_${language.toUpperCase()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    // console.error('❌ Error:', error.message);
    logger.error('❌ Error:', error.message);
    if (browser) await browser.close();
    res.status(500).json({ success: false, message: 'Error generating bill', error: error.message });
  }
};