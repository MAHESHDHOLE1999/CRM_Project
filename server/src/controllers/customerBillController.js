// File: backend/controllers/customerBillController.js
// COMPLETE & UPDATED - With Receiver Name Field

import puppeteer from 'puppeteer';
import Customer from '../models/Customer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translations = {
  en: {
    billTitle: 'RENTAL INVOICE',
    invoiceDetails: 'Invoice Details',
    invoiceNumber: 'Customer #',
    date: 'Registration Date',
    dueDate: 'Check-in Date',
    billTo: 'Customer Details',
    customerName: 'Customer Name',
    receiverName: 'Receiver Name',
    phone: 'Phone',
    address: 'Address',
    itemDescription: 'Item Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    sNo: 'S.No',
    subtotal: 'Subtotal',
    totalExtraCharges: 'Total Extra Charges',
    depositAmount: 'Deposit Amount',
    maintenanceCharges: 'Maintenance Charges',
    transportCost: 'Transport Cost',
    totalDue: 'TOTAL AMOUNT',
    paymentInformation: 'Payment Information',
    depositReceived: 'Deposit Received',
    amountGiven: 'Amount Given',
    balanceDue: 'Balance Due',
    termsConditions: 'Terms & Conditions',
    term1: 'This is a rental invoice for items on rent.',
    term2: 'Items remain rented until checkout date.',
    term3: 'Full payment must be settled upon checkout.',
    term4: 'Extra charges apply for overtime hours.',
    rentalStatus: 'Rental Status',
    checkInTime: 'Check-in Time',
    days: 'Days',
    hours: 'Hours',
    hourlyRate: 'Rate/hr',
    notes: 'Notes',
    customerSignature: 'Customer Signature',
    authorizedSignature: 'Authorized Signature',
    thankYou: 'Thank you for renting with us!',
    generatedOn: 'Generated on',
    companyName: 'AJAY GADHI BHANDAR',
    tagline: 'Premium Event Rental Solutions',
    address1: 'Shipi Galli, Yevla - 423401',
    address2: 'District Nashik, Maharashtra',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+91 9226472249',
    phone2: '+91 9405557668',
    status: 'Status',
    charges: 'Extra Charges',
    checkOutDate: 'Checkout Date',
    checkOutTime: 'Checkout Time'
  },
  mr: {
    billTitle: 'किराया बिल',
    invoiceDetails: 'बिल तपशील',
    invoiceNumber: 'ग्राहक क्र. #',
    date: 'नोंदणी तारीख',
    dueDate: 'चेक-इन तारीख',
    billTo: 'ग्राहक तपशील',
    customerName: 'ग्राहक नाव',
    receiverName: 'प्राप्तकर्ता नाव',
    phone: 'फोन',
    address: 'पता',
    itemDescription: 'वस्तूचे वर्णन',
    qty: 'प्रमाण',
    unitPrice: 'एकक किंमत',
    amount: 'रक्कम',
    sNo: 'क्र.',
    subtotal: 'उप-एकूण',
    totalExtraCharges: 'एकूण अतिरिक्त शुल्क',
    depositAmount: 'जमा रक्कम',
    maintenanceCharges: 'रक्षणाचे शुल्क',
    transportCost: 'वाहतूक खर्च',
    totalDue: 'एकूण रक्कम',
    paymentInformation: 'भुगतान माहिती',
    depositReceived: 'जमा केलेली रक्कम',
    amountGiven: 'दिलेली रक्कम',
    balanceDue: 'शिल्लक देय',
    termsConditions: 'अटी व शर्ती',
    term1: 'हे किराये का बिल आहे.',
    term2: 'वस्तू चेक-आउट तारखेपर्यंत किरायावर राहतील.',
    term3: 'चेक-आउटवेळी संपूर्ण भुगतान करणे आवश्यक आहे.',
    term4: 'ओव्हरटाइम तासांसाठी अतिरिक्त शुल्क लागू आहे.',
    rentalStatus: 'किराया स्थिती',
    checkInTime: 'चेक-इन वेळ',
    days: 'दिवस',
    hours: 'तास',
    hourlyRate: 'दर/तास',
    notes: 'टिप्पणी',
    customerSignature: 'ग्राहकाची स्वाक्षरी',
    authorizedSignature: 'अधिकृत स्वाक्षरी',
    thankYou: 'आमच्याकडे किरायावर दिल्याबद्दल धन्यवाद!',
    generatedOn: 'निर्माण केलेले',
    companyName: 'अजय घडी भंडार',
    tagline: 'प्रीमियम इव्हेंट किराया समाधान',
    address1: 'शिपी गल्ली, येवला - 423401',
    address2: 'जिल्हा नाशिक, महाराष्ट्र',
    email: 'info@ajaygadhibhandar.com',
    phone1: '+९१ ९२२६४७२२४९',
    phone2: '+९१ ९४०५५५७६६८',
    status: 'स्थिती',
    charges: 'अतिरिक्त शुल्क',
    checkOutDate: 'चेक-आउट तारीख',
    checkOutTime: 'चेक-आउट वेळ'
  }
};

export const generateCustomerBill = async (req, res) => {
  let browser;
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;

    if (!['en', 'mr'].includes(language)) {
      logger.warn(`Invalid language requested: ${language}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    const t = translations[language];
    
    logger.info(`Fetching customer for bill generation - Customer ID: ${id}`);
    
    // ✅ FETCH CUSTOMER
    const customer = await Customer.findById(id);

    if (!customer) {
      logger.warn(`Customer not found - Customer ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    logger.info(`Customer found: ${customer.name}`);

    // ✅ GET BILL DATA
    const billData = customer.getBillData();
    
    logger.info(`Bill data retrieved successfully`);
    logger.debug(`Number of items with charges: ${billData.itemsWithCharges.length}`);

    const billNo = billData.billNo;
    const itemsWithCharges = billData.itemsWithCharges || [];
    const summary = billData.summary || {};

    // Format dates
    const regDate = new Date(customer.registrationDate);
    const dateStr = `${regDate.getDate()}/${regDate.getMonth() + 1}/${regDate.getFullYear()}`;
    
    const checkInDate = customer.checkInDate ? new Date(customer.checkInDate) : regDate;
    const checkInDateStr = `${checkInDate.getDate()}/${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

    // Load logo
    let logoImg = '';
    const logoPath = path.join(__dirname, '../images/logo.png');
    if (fs.existsSync(logoPath)) {
      try {
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = logoData.toString('base64');
        logoImg = `<img src="data:image/png;base64,${logoBase64}" style="max-width: 200px; max-height: 100px; object-fit: contain;" />`;
        logger.info(`Logo loaded successfully`);
      } catch (e) {
        logger.warn(`Logo not found, continuing without logo - Error: ${e.message}`);
      }
    } else {
      logger.debug(`Logo file not found at path: ${logoPath}`);
    }

    // ✅ BUILD HTML
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
      line-height: 1.5;
    }
    
    .page {
      width: 100%;
      padding: 20px;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 15px;
      border-bottom: 3px solid #8B4513;
      padding-bottom: 10px;
      position: relative;
    }
    
    .phone-header {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 9px;
      font-weight: bold;
      line-height: 1.3;
    }
    
    .bill-title {
      font-size: 16px;
      font-weight: bold;
      color: #8B4513;
      margin: 5px 0;
      text-transform: uppercase;
    }
    
    .company-info {
      font-size: 9px;
      color: #666;
      margin: 2px 0;
    }
    
    .invoice-header {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .invoice-info, .bill-to {
      flex: 1;
      padding: 8px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 9px;
    }
    
    .section-title {
      color: #8B4513;
      font-size: 9px;
      font-weight: bold;
      margin-bottom: 3px;
      text-transform: uppercase;
      border-bottom: 2px solid #8B4513;
      padding-bottom: 2px;
    }
    
    .invoice-number {
      font-size: 13px;
      color: #DC143C;
      font-weight: bold;
      margin: 3px 0;
    }
    
    .info-row {
      font-size: 8px;
      margin: 1px 0;
      color: #555;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 7px;
    }
    
    thead {
      background: #8B4513;
      color: white;
    }
    
    th {
      padding: 4px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #8B4513;
    }
    
    td {
      padding: 4px;
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
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    
    .summary-box {
      width: 250px;
      padding: 8px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 8px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    
    .summary-row.total {
      background: #8B4513;
      color: white;
      padding: 6px;
      margin: 3px -8px -8px -8px;
      font-weight: bold;
      font-size: 9px;
    }
    
    .payment-section {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .payment-box {
      flex: 1;
      padding: 8px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 8px;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    
    .balance-value {
      color: #DC143C;
      font-weight: bold;
    }
    
    .footer-text {
      text-align: center;
      font-size: 7px;
      color: #999;
      margin-top: 10px;
      padding-top: 5px;
      border-top: 1px solid #ddd;
    }
    
    .status-badge {
      display: inline-block;
      padding: 1px 5px;
      background: #4CAF50;
      color: white;
      font-size: 7px;
      border-radius: 2px;
      font-weight: bold;
    }
    
    .status-badge.active {
      background: #2196F3;
    }
    
    .status-badge.completed {
      background: #4CAF50;
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
      ${logoImg}
      <div class="bill-title">${t.billTitle}</div>
      <div class="company-info">${t.tagline}</div>
      <div class="company-info">${t.address1} | ${t.address2}</div>
      <div class="company-info">📧 ${t.email}</div>
    </div>
    
    <div class="invoice-header">
      <div class="invoice-info">
        <div class="section-title">${t.invoiceDetails}</div>
        <div class="invoice-number">${t.invoiceNumber}${billNo}</div>
        <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
        <div class="info-row"><strong>${t.dueDate}:</strong> ${checkInDateStr}</div>
      </div>
      
      <!-- ✅ CHANGED: Updated bill-to section with Receiver Name -->
      <div class="bill-to">
        <div class="section-title">${t.billTo}</div>
        <div class="info-row"><strong>${t.customerName}:</strong> ${customer.name || 'N/A'}</div>
        ${customer.receiverName ? `<div class="info-row"><strong>${t.receiverName}:</strong> ${customer.receiverName}</div>` : ''}
        <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
        <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
      </div>
    </div>
    
    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>${t.sNo}</th>
          <th>${t.itemDescription}</th>
          <th style="text-align: center; width: 5%;">${t.qty}</th>
          <th style="text-align: right; width: 8%;">${t.unitPrice}</th>
          <th style="text-align: right; width: 8%;">${t.amount}</th>
          <th style="width: 8%;">${t.checkOutDate}</th>
          <th style="width: 7%;">${t.checkOutTime}</th>
          <th style="text-align: center; width: 4%;">${t.days}</th>
          <th style="text-align: center; width: 4%;">${t.hours}</th>
          <th style="text-align: right; width: 7%;">${t.hourlyRate}</th>
          <th style="text-align: right; width: 8%;">${t.charges}</th>
        </tr>
      </thead>
      <tbody>
        ${itemsWithCharges.map((item) => `
          <tr>
            <td class="text-center">${item.index}</td>
            <td>${item.itemName}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">₹ ${(item.price || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">₹ ${(item.amount || 0).toLocaleString('en-IN')}</td>
            <td>${item.checkOutDate ? new Date(item.checkOutDate).toLocaleDateString('en-IN') : '-'}</td>
            <td>${item.checkOutTime || '-'}</td>
            <td class="text-center">${item.rentalDays}</td>
            <td class="text-center">${item.extraHours}</td>
            <td class="text-right">₹ ${(item.hourlyRate || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">₹ ${(item.extraCharges || 0).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="totals-section">
      <div class="summary-box">
        <div class="summary-row">
          <span>${t.subtotal}:</span>
          <span>₹ ${(summary.itemsTotal || 0).toLocaleString('en-IN')}</span>
        </div>
        ${summary.totalExtraCharges > 0 ? `<div class="summary-row">
          <span>${t.totalExtraCharges}:</span>
          <span>₹ ${(summary.totalExtraCharges || 0).toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${summary.maintenanceCharges > 0 ? `<div class="summary-row">
          <span>${t.maintenanceCharges}:</span>
          <span>₹ ${(summary.maintenanceCharges || 0).toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${summary.transportCost > 0 ? `<div class="summary-row">
          <span>${t.transportCost}:</span>
          <span>₹ ${(summary.transportCost || 0).toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${summary.depositAmount > 0 ? `<div class="summary-row">
          <span>${t.depositAmount}:</span>
          <span>₹ ${(summary.depositAmount || 0).toLocaleString('en-IN')}</span>
        </div>` : ''}
        <div class="summary-row total">
          <span>${t.totalDue}:</span>
          <span>₹ ${(summary.totalAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <!-- Payment -->
    <div class="payment-section">
      <div class="payment-box">
        <div class="section-title">${t.paymentInformation}</div>
        <div class="payment-row">
          <span>${t.depositReceived}:</span>
          <span>₹ ${(summary.depositAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.amountGiven}:</span>
          <span>₹ ${(summary.givenAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.balanceDue}:</span>
          <span class="balance-value">₹ ${(summary.remainingAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <div class="footer-text">
      ${t.thankYou} 🙏<br>
      ${t.generatedOn}: ${new Date().toLocaleString('en-IN')}
    </div>
  </div>
</body>
</html>`;

    logger.info(`Building HTML content for bill generation`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 30000
    });

    logger.info(`Puppeteer browser launched successfully`);

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

    logger.info(`HTML content set in browser page`);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '8mm', right: '5mm', bottom: '8mm', left: '5mm' },
      printBackground: true
    });

    await browser.close();

    if (!pdfBuffer || pdfBuffer.length === 0) {
      logger.error(`PDF buffer is empty or generation failed`);
      return res.status(500).json({ success: false, message: 'PDF generation failed' });
    }

    logger.info(`PDF generated successfully - Size: ${pdfBuffer.length} bytes`);

    const fileName = `Bill_${customer.name}_${billNo}_${language.toUpperCase()}.pdf`;
    
    logger.info(`Sending PDF file: ${fileName}`);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    logger.error(`Error generating bill: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    
    if (browser) {
      try {
        await browser.close();
        logger.info(`Browser closed after error`);
      } catch (e) {
        logger.error(`Error closing browser: ${e.message}`);
      }
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error generating bill', 
      error: error.message 
    });
  }
};