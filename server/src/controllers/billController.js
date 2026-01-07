import puppeteer from 'puppeteer';
import Customer from '../models/Customer.js';
import AdvancedBooking from '../models/AdvancedBooking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Customer Invoice Translations
const customerTranslations = {
  en: {
    invoiceDetails: 'Invoice Details',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    dueDate: 'Due Date',
    billTo: 'Bill To',
    phone: 'Phone',
    address: 'Address',
    itemDescription: 'Item Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    sNo: 'S.No',
    subtotal: 'Subtotal',
    transport: 'Transport',
    maintenance: 'Maintenance',
    extraCharges: 'Extra Charges',
    totalDue: 'TOTAL DUE',
    paymentInformation: 'Payment Information',
    depositReceived: 'Deposit Received',
    amountGiven: 'Amount Given',
    balanceDue: 'Balance Due',
    termsConditions: 'Terms & Conditions',
    term1: 'Items must be returned in original condition within agreed timeframe',
    term2: 'Lost or damaged items will be charged at full replacement cost',
    term3: 'Payment must be settled within 7 days of invoice date',
    term4: 'Any disputes must be reported immediately',
    customerSignature: 'Customer Signature',
    authorizedSignature: 'Authorized Signature',
    thankYou: 'Thank you for your business!',
    generatedOn: 'Generated on',
    companyName: 'AJAY GADHI BHANDAR',
    tagline: 'Premium Event Rental Solutions',
    address1: 'Shipi Galli, Yevla - 423401',
    address2: 'District Nashik, Maharashtra',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+91 9226472249',
    phone2: '+91 9405557668'
  },
  mr: {
    invoiceDetails: 'बिल तपशील',
    invoiceNumber: 'बिल क्रमांक #',
    date: 'तारीख',
    dueDate: 'देय तारीख',
    billTo: 'चलन पत्ता',
    phone: 'फोन',
    address: 'पता',
    itemDescription: 'वस्तूचे वर्णन',
    qty: 'प्रमाण',
    unitPrice: 'एकक किंमत',
    amount: 'रक्कम',
    sNo: 'क्र.',
    subtotal: 'उप-एकूण',
    transport: 'वाहतूक',
    maintenance: 'देखभाल',
    extraCharges: 'अतिरिक्त शुल्क',
    totalDue: 'एकूण देय',
    paymentInformation: 'भुगतान माहिती',
    depositReceived: 'जमा केलेली रक्कम',
    amountGiven: 'दिलेली रक्कम',
    balanceDue: 'शिल्लक देय',
    termsConditions: 'अटी व शर्ती',
    term1: 'वस्तू सहमत कालावधीत मूळ स्थितीत परत केल्या पाहिजेत',
    term2: 'हरवलेल्या किंवा खराब झालेल्या वस्तूंचा पूर्ण प्रतिस्थापन खर्च आकारला जाईल',
    term3: 'बिलाच्या तारखेपासून 7 दिवसांत भुगतान केले जाणे आवश्यक आहे',
    term4: 'कोणतेही विवाद तातडीने कळविणे आवश्यक आहे',
    customerSignature: 'ग्राहकाची स्वाक्षरी',
    authorizedSignature: 'अधिकृत स्वाक्षरी',
    thankYou: 'आपल्या व्यवसायाबद्दल धन्यवाद!',
    generatedOn: 'निर्माण केलेले',
    companyName: 'अजय घडी भंडार',
    tagline: 'प्रीमियम इव्हेंट किराया समाधान',
    address1: 'शिपी गल्ली, येवला - 423401',
    address2: 'जिल्हा नाशिक, महाराष्ट्र',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+९१ ९२२६४७२२४९',
    phone2: '+९१ ९४०५५५७६६८'
  }
};

// Booking Invoice Translations
const bookingTranslations = {
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

// Generate Customer Bill/Invoice
export const generateCustomerBill = async (req, res) => {
  let browser;
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    if (!['en', 'mr'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Use "en" or "mr".'
      });
    }

    const t = customerTranslations[language];
    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const billNo = customer._id.toString().slice(-6);
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;

    const itemsTotal = (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalAmount = customer.totalAmount || itemsTotal + (customer.transportCost || 0) + (customer.maintenanceCharges || 0) + (customer.extraCharges || 0);

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
  <title>Invoice ${billNo}</title>
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

    .company-name {
      font-size: 22px;
      font-weight: bold;
      color: #8B4513;
      margin: 5px 0;
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

    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 5px;
    }

    .invoice-info h3, .customer-info h3 {
      color: #8B4513;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .info-row {
      margin-bottom: 3px;
      font-size: 12px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .table th, .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
      font-size: 12px;
    }

    .table th {
      background-color: #8B4513;
      color: white;
      font-weight: bold;
    }

    .total-section {
      margin-top: 20px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 5px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .total-row.final {
      font-weight: bold;
      font-size: 16px;
      color: #8B4513;
      border-top: 2px solid #8B4513;
      padding-top: 10px;
    }

    .payment-info {
      margin-top: 20px;
      padding: 15px;
      background: #f0f8ff;
      border-radius: 5px;
    }

    .payment-info h4 {
      color: #8B4513;
      margin-bottom: 10px;
    }

    .terms {
      margin-top: 20px;
      padding: 15px;
      background: #fff8dc;
      border-radius: 5px;
      font-size: 11px;
    }

    .terms h4 {
      color: #8B4513;
      margin-bottom: 8px;
    }

    .signatures {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .signature-box {
      width: 45%;
      text-align: center;
    }

    .signature-line {
      border-bottom: 1px solid #333;
      margin-top: 40px;
      margin-bottom: 5px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="phone-header">
        ${t.phone1}<br>${t.phone2}
      </div>

      <div class="logo-section">
        ${logoImg}
      </div>

      <div class="company-name">${t.companyName}</div>
      <div class="company-tagline">${t.tagline}</div>
      <div class="company-address">${t.address1}</div>
      <div class="company-address">${t.address2}</div>
      <div class="company-address">${t.email}</div>
    </div>

    <div class="invoice-details">
      <div class="invoice-info">
        <h3>${t.invoiceDetails}</h3>
        <div class="info-row"><strong>${t.invoiceNumber}</strong> ${billNo}</div>
        <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
        <div class="info-row"><strong>${t.dueDate}:</strong> ${dueDateStr}</div>
      </div>

      <div class="customer-info">
        <h3>${t.billTo}</h3>
        <div class="info-row"><strong>${customer.name}</strong></div>
        <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone}</div>
        ${customer.address ? `<div class="info-row"><strong>${t.address}:</strong> ${customer.address}</div>` : ''}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>${t.sNo}</th>
          <th>${t.itemDescription}</th>
          <th>${t.qty}</th>
          <th>${t.unitPrice}</th>
          <th>${t.amount}</th>
        </tr>
      </thead>
      <tbody>
        ${(customer.items || []).map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.name || item.itemName}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toLocaleString('en-IN')}</td>
            <td>₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-row">
        <span>${t.subtotal}:</span>
        <span>₹${itemsTotal.toLocaleString('en-IN')}</span>
      </div>
      ${customer.transportCost ? `
      <div class="total-row">
        <span>${t.transport}:</span>
        <span>₹${customer.transportCost.toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      ${customer.maintenanceCharges ? `
      <div class="total-row">
        <span>${t.maintenance}:</span>
        <span>₹${customer.maintenanceCharges.toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      ${customer.extraCharges ? `
      <div class="total-row">
        <span>${t.extraCharges}:</span>
        <span>₹${customer.extraCharges.toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      <div class="total-row final">
        <span>${t.totalDue}:</span>
        <span>₹${totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="payment-info">
      <h4>${t.paymentInformation}</h4>
      <div class="total-row">
        <span>${t.depositReceived}:</span>
        <span>₹${(customer.depositAmount || 0).toLocaleString('en-IN')}</span>
      </div>
      <div class="total-row">
        <span>${t.amountGiven}:</span>
        <span>₹${(customer.givenAmount || 0).toLocaleString('en-IN')}</span>
      </div>
      <div class="total-row final">
        <span>${t.balanceDue}:</span>
        <span>₹${(customer.remainingAmount || 0).toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="terms">
      <h4>${t.termsConditions}</h4>
      <ul>
        <li>${t.term1}</li>
        <li>${t.term2}</li>
        <li>${t.term3}</li>
        <li>${t.term4}</li>
      </ul>
    </div>

    <div class="signatures">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div>${t.customerSignature}</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div>${t.authorizedSignature}</div>
      </div>
    </div>

    <div class="footer">
      <p>${t.thankYou}</p>
      <p>${t.generatedOn}: ${dateStr}</p>
    </div>
  </div>
</body>
</html>`;

    console.log('📄 Starting Customer PDF generation...');

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer'
      ],
      timeout: 60000
    });

    const page = await browser.newPage();
    
    // Set a longer timeout for content loading
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0', 
      timeout: 60000 
    });

    // Wait a bit for fonts and styles to fully render
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      preferCSSPageSize: false
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('❌ PDF buffer is empty');
      return res.status(500).json({ 
        success: false, 
        message: 'PDF generation failed: Empty PDF buffer' 
      });
    }

    console.log(`✅ Customer PDF generated: ${pdfBuffer.length} bytes`);

    // Sanitize filename
    const sanitizedName = (customer.name || 'Customer')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const fileName = `Invoice_${sanitizedName}_${billNo}_${language.toUpperCase()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (browser) await browser.close();
    res.status(500).json({ success: false, message: 'Error generating customer bill', error: error.message });
  }
};

// Generate Booking Bill/Invoice
export const generateBookingBill = async (req, res) => {
  let browser;
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    if (!['en', 'mr'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Use "en" or "mr".'
      });
    }

    const t = bookingTranslations[language];
    const booking = await AdvancedBooking.findById(id).lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const billNo = booking._id ? booking._id.toString().slice(-6) : '000000';
    
    // Handle date parsing safely
    let dateStr = new Date().toLocaleDateString('en-IN');
    try {
      if (booking.bookingDate) {
        const bookingDate = new Date(booking.bookingDate);
        if (!isNaN(bookingDate.getTime())) {
          dateStr = `${bookingDate.getDate()}/${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()}`;
        }
      }
    } catch (e) {
      console.warn('Date parsing error:', e.message);
    }

    // Parse items safely
    let items = [];
    try {
      if (booking.items) {
        if (typeof booking.items === 'string') {
          items = JSON.parse(booking.items);
        } else if (Array.isArray(booking.items)) {
          items = booking.items;
        }
      }
      // Ensure items is an array
      if (!Array.isArray(items)) {
        items = [];
      }
    } catch (e) {
      console.warn('Items parsing error:', e.message);
      items = [];
    }

    // Calculate totals safely
    const itemsTotal = items.reduce((sum, item) => {
      const quantity = Number(item?.quantity) || 0;
      const price = Number(item?.price) || 0;
      return sum + (quantity * price);
    }, 0);
    const totalAmount = Number(booking.totalAmount) || itemsTotal || 0;

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
        <div class="info-row"><strong>${t.dueDate}:</strong> ${dateStr}</div>
      </div>
      
      <div class="bill-to">
        <div class="section-title">${t.billTo}</div>
        <div class="info-row"><strong>${(booking.customerName || 'N/A').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></div>
        <div class="info-row"><strong>${t.phone}:</strong> ${(booking.phone || 'N/A').toString()}</div>
        <div class="info-row"><strong>${t.email}:</strong> ${(booking.email || 'N/A').toString()}</div>
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
        <div class="detail-value">${(booking.startTime || 'N/A').toString()}</div>
      </div>
      <div class="detail-box">
        <div class="detail-label">${t.endTime}</div>
        <div class="detail-value">${(booking.endTime || 'N/A').toString()}</div>
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
        ${items.length > 0 ? items.map((item, index) => {
          const itemName = (item?.itemName || item?.name || 'N/A').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const quantity = Number(item?.quantity) || 0;
          const price = Number(item?.price) || 0;
          const amount = quantity * price;
          return `<tr>
            <td class="text-center">${index + 1}</td>
            <td>${itemName}</td>
            <td class="text-center">${quantity}</td>
            <td class="text-right">Rs. ${price.toLocaleString('en-IN')}</td>
            <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
          </tr>`;
        }).join('') : '<tr><td colspan="5" class="text-center">No items found</td></tr>'}
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
      <strong>${t.notes}:</strong> ${booking.notes.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')}
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

    console.log('📄 Starting Booking PDF generation...');
    console.log('Booking data:', {
      id: booking._id,
      customerName: booking.customerName,
      itemsCount: items.length,
      totalAmount: totalAmount
    });

    let pdfBuffer;
    try {
      // Try to launch Puppeteer with Chrome
      const launchOptions = {
        headless: 'new',
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        timeout: 60000
      };

      // Try to launch browser
      try {
        browser = await puppeteer.launch(launchOptions);
      } catch (launchError) {
        console.error('First launch attempt failed:', launchError.message);
        // Try with executablePath if Chrome is installed in default location
        const possiblePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.CHROME_PATH
        ].filter(Boolean);

        let launched = false;
        for (const executablePath of possiblePaths) {
          try {
            if (fs.existsSync(executablePath)) {
              console.log(`Trying to use Chrome at: ${executablePath}`);
              browser = await puppeteer.launch({
                ...launchOptions,
                executablePath: executablePath
              });
              launched = true;
              break;
            }
          } catch (e) {
            console.warn(`Failed to use Chrome at ${executablePath}:`, e.message);
          }
        }

        if (!launched) {
          throw new Error(`Could not launch Chrome. Please run: npx puppeteer browsers install chrome. Original error: ${launchError.message}`);
        }
      }

      const page = await browser.newPage();
      
      // Set a longer timeout for content loading
      try {
        await page.setContent(htmlContent, { 
          waitUntil: 'networkidle0', 
          timeout: 60000 
        });
      } catch (contentError) {
        console.error('Error setting page content:', contentError.message);
        // Try with a simpler wait condition
        await page.setContent(htmlContent, { 
          waitUntil: 'domcontentloaded', 
          timeout: 60000 
        });
      }

      // Wait a bit for fonts and styles to fully render
      await new Promise(resolve => setTimeout(resolve, 1000));

      pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
        printBackground: true,
        preferCSSPageSize: false
      });

      await browser.close();
      browser = null; // Clear reference after closing
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError.message);
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
        browser = null;
      }
      throw puppeteerError; // Re-throw to be caught by outer catch
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('❌ PDF buffer is empty');
      return res.status(500).json({ 
        success: false, 
        message: 'PDF generation failed: Empty PDF buffer' 
      });
    }

    console.log(`✅ Booking PDF generated: ${pdfBuffer.length} bytes`);

    // Sanitize filename
    const sanitizedName = (booking.customerName || 'Customer')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const fileName = `BookingBill_${sanitizedName}_${billNo}_${language.toUpperCase()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error generating booking bill:', error);
    console.error('Error stack:', error.stack);
    console.error('Booking ID:', req.params.id);
    
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    // Return detailed error message
    const errorMessage = error.message || 'Unknown error occurred';
    res.status(500).json({ 
      success: false, 
      message: `Error generating booking bill: ${errorMessage}`,
      error: errorMessage
    });
  }
};