// // File: backend/controllers/customerBillController.js
// import puppeteer from 'puppeteer';
// import Customer from '../models/Customer.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const translations = {
//   en: {
//     billTitle: 'RENTAL INVOICE',
//     invoiceDetails: 'Invoice Details',
//     invoiceNumber: 'Customer #',
//     date: 'Registration Date',
//     dueDate: 'Check-in Date',
//     billTo: 'Customer Details',
//     phone: 'Phone',
//     email: 'Email',
//     address: 'Address',
//     itemDescription: 'Item Description',
//     qty: 'Qty',
//     unitPrice: 'Unit Price',
//     amount: 'Amount',
//     sNo: 'S.No',
//     subtotal: 'Subtotal',
//     depositAmount: 'Deposit Amount',
//     totalDue: 'TOTAL AMOUNT',
//     paymentInformation: 'Payment Information',
//     depositReceived: 'Deposit Received',
//     amountGiven: 'Amount Given',
//     balanceDue: 'Balance Due',
//     termsConditions: 'Terms & Conditions',
//     term1: 'This is a rental invoice for items on rent.',
//     term2: 'Items remain rented until checkout date.',
//     term3: 'Full payment must be settled upon checkout.',
//     term4: 'Extra charges apply for overtime hours.',
//     rentalStatus: 'Rental Status',
//     checkInTime: 'Check-in Time',
//     checkOutTime: 'Check-out Time',
//     notes: 'Notes',
//     customerSignature: 'Customer Signature',
//     authorizedSignature: 'Authorized Signature',
//     thankYou: 'Thank you for renting with us!',
//     generatedOn: 'Generated on',
//     companyName: 'AJAY GADHI BHANDAR',
//     tagline: 'Premium Event Rental Solutions',
//     address1: 'Shipi Galli, Yevla - 423401',
//     address2: 'District Nashik, Maharashtra',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '+91 9226472249',
//     phone2: '+91 9405557668',
//     status: 'Status',
//     rentalDuration: 'Rental Duration',
//     days: 'Days',
//     hours: 'Hours',
//     extraCharges: 'Extra Charges'
//   },
//   mr: {
//     billTitle: 'किराया बिल',
//     invoiceDetails: 'बिल तपशील',
//     invoiceNumber: 'ग्राहक क्र. #',
//     date: 'नोंदणी तारीख',
//     dueDate: 'चेक-इन तारीख',
//     billTo: 'ग्राहक तपशील',
//     phone: 'फोन',
//     email: 'ईमेल',
//     address: 'पता',
//     itemDescription: 'वस्तूचे वर्णन',
//     qty: 'प्रमाण',
//     unitPrice: 'एकक किंमत',
//     amount: 'रक्कम',
//     sNo: 'क्र.',
//     subtotal: 'उप-एकूण',
//     depositAmount: 'जमा रक्कम',
//     totalDue: 'एकूण रक्कम',
//     paymentInformation: 'भुगतान माहिती',
//     depositReceived: 'जमा केलेली रक्कम',
//     amountGiven: 'दिलेली रक्कम',
//     balanceDue: 'शिल्लक देय',
//     termsConditions: 'अटी व शर्ती',
//     term1: 'हे किराये का बिल आहे.',
//     term2: 'वस्तू चेक-आउट तारखेपर्यंत किरायावर राहतील.',
//     term3: 'चेक-आउटवेळी संपूर्ण भुगतान करणे आवश्यक आहे.',
//     term4: 'ओव्हरटाइम तासांसाठी अतिरिक्त शुल्क लागू आहे.',
//     rentalStatus: 'किराया स्थिती',
//     checkInTime: 'चेक-इन वेळ',
//     checkOutTime: 'चेक-आउट वेळ',
//     notes: 'टिप्पणी',
//     customerSignature: 'ग्राहकाची स्वाक्षरी',
//     authorizedSignature: 'अधिकृत स्वाक्षरी',
//     thankYou: 'आमच्याकडे किरायावर दिल्याबद्दल धन्यवाद!',
//     generatedOn: 'निर्माण केलेले',
//     companyName: 'अजय घडी भंडार',
//     tagline: 'प्रीमियम इव्हेंट किराया समाधान',
//     address1: 'शिपी गल्ली, येवला - 423401',
//     address2: 'जिल्हा नाशिक, महाराष्ट्र',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '+९१ ९२२६४७२२४९',
//     phone2: '+९१ ९४०५५५७६६८',
//     status: 'स्थिती',
//     rentalDuration: 'किराया कालावधी',
//     days: 'दिवस',
//     hours: 'तास',
//     extraCharges: 'अतिरिक्त शुल्क'
//   }
// };

// export const generateCustomerBill = async (req, res) => {
//   let browser;
//   try {
//     const { id } = req.params;
//     const { language = 'en' } = req.query;

//     if (!['en', 'mr'].includes(language)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid language'
//       });
//     }

//     const t = translations[language];
//     const customer = await Customer.findById(id).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const billNo = customer._id.toString().slice(-6);
//     const regDate = new Date(customer.registrationDate);
//     const dateStr = `${regDate.getDate()}/${regDate.getMonth() + 1}/${regDate.getFullYear()}`;
    
//     const checkInDate = customer.checkInDate ? new Date(customer.checkInDate) : regDate;
//     const checkInDateStr = `${checkInDate.getDate()}/${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

//     // Parse items
//     let items = [];
//     try {
//       items = typeof customer.items === 'string' ? JSON.parse(customer.items) : customer.items || [];
//     } catch (e) {
//       items = [];
//     }

//     const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//     const totalAmount = customer.totalAmount || itemsTotal;

//     // Load logo
//     let logoImg = '';
//     const logoPath = path.join(__dirname, '../images/logo.png');
//     if (fs.existsSync(logoPath)) {
//       const logoData = fs.readFileSync(logoPath);
//       const logoBase64 = logoData.toString('base64');
//       logoImg = `<img src="data:image/png;base64,${logoBase64}" style="max-width: 300px; max-height: 150px; object-fit: contain;" />`;
//     }

//     const htmlContent = `<!DOCTYPE html>
// <html lang="${language}">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${t.billTitle} ${billNo}</title>
//   <style>
//     @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
    
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     body {
//       font-family: ${language === 'mr' ? "'Noto Sans Devanagari', Arial, sans-serif" : "Arial, sans-serif"};
//       background: white;
//       color: #333;
//       line-height: 1.6;
//     }
    
//     .page {
//       width: 100%;
//       padding: 20px;
//       background: white;
//     }
    
//     .header {
//       text-align: center;
//       margin-bottom: 20px;
//       border-bottom: 3px solid #8B4513;
//       padding-bottom: 15px;
//       position: relative;
//     }
    
//     .phone-header {
//       position: absolute;
//       top: 5px;
//       right: 0;
//       font-size: 10px;
//       font-weight: bold;
//       line-height: 1.4;
//     }
    
//     .logo-section {
//       margin-bottom: 10px;
//     }
    
//     .bill-title {
//       font-size: 18px;
//       font-weight: bold;
//       color: #8B4513;
//       margin: 8px 0;
//       text-transform: uppercase;
//       letter-spacing: 1px;
//     }
    
//     .company-tagline {
//       font-size: 11px;
//       color: #666;
//       margin: 3px 0;
//     }
    
//     .company-address {
//       font-size: 10px;
//       color: #666;
//       margin: 2px 0;
//     }
    
//     .contact-info {
//       font-size: 9px;
//       color: #666;
//       margin-top: 5px;
//     }
    
//     .invoice-header {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 20px;
//     }
    
//     .invoice-info, .bill-to {
//       flex: 1;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .section-title {
//       color: #8B4513;
//       font-size: 10px;
//       font-weight: bold;
//       margin-bottom: 5px;
//       text-transform: uppercase;
//       border-bottom: 2px solid #8B4513;
//       padding-bottom: 3px;
//     }
    
//     .invoice-number {
//       font-size: 14px;
//       color: #DC143C;
//       font-weight: bold;
//       margin: 5px 0;
//     }
    
//     .info-row {
//       font-size: 9px;
//       margin: 2px 0;
//       color: #555;
//     }
    
//     .rental-details {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 15px;
//       font-size: 9px;
//     }
    
//     .detail-box {
//       flex: 1;
//       padding: 8px;
//       background: #f0f8ff;
//       border: 1px solid #87ceeb;
//     }
    
//     .detail-label {
//       color: #8B4513;
//       font-weight: bold;
//       font-size: 8px;
//       text-transform: uppercase;
//       margin-bottom: 2px;
//     }
    
//     .detail-value {
//       font-size: 10px;
//       color: #333;
//     }
    
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 15px 0;
//       font-size: 9px;
//     }
    
//     thead {
//       background: #8B4513;
//       color: white;
//     }
    
//     th {
//       padding: 8px;
//       text-align: left;
//       font-weight: bold;
//       border: 1px solid #8B4513;
//     }
    
//     td {
//       padding: 8px;
//       border: 1px solid #ddd;
//     }
    
//     tbody tr:nth-child(odd) {
//       background: #f9f9f9;
//     }
    
//     .text-right {
//       text-align: right;
//     }
    
//     .text-center {
//       text-align: center;
//     }
    
//     .totals-section {
//       margin-bottom: 15px;
//       display: flex;
//       justify-content: flex-end;
//     }
    
//     .summary-box {
//       width: 250px;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .summary-row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 5px;
//       font-size: 9px;
//     }
    
//     .summary-row.total {
//       background: #8B4513;
//       color: white;
//       padding: 8px;
//       margin: 5px -10px -10px -10px;
//       font-weight: bold;
//       font-size: 10px;
//     }
    
//     .summary-label {
//       font-weight: 500;
//     }
    
//     .payment-section {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 15px;
//     }
    
//     .payment-box {
//       flex: 1;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//       font-size: 9px;
//     }
    
//     .payment-row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 3px;
//     }
    
//     .balance-value {
//       color: #DC143C;
//       font-weight: bold;
//     }
    
//     .terms-section {
//       background: #f5f5f5;
//       padding: 10px;
//       border: 1px solid #ddd;
//       margin-bottom: 15px;
//       font-size: 8px;
//     }
    
//     .terms-section h3 {
//       color: #8B4513;
//       font-size: 9px;
//       font-weight: bold;
//       margin-bottom: 5px;
//       text-transform: uppercase;
//       border-bottom: 2px solid #8B4513;
//       padding-bottom: 3px;
//     }
    
//     .terms-list {
//       margin-left: 15px;
//     }
    
//     .terms-list li {
//       margin-bottom: 2px;
//       line-height: 1.4;
//     }
    
//     .footer {
//       display: flex;
//       justify-content: space-between;
//       margin-top: 20px;
//       padding-top: 10px;
//       border-top: 1px solid #ddd;
//     }
    
//     .signature-box {
//       width: 150px;
//       text-align: center;
//       font-size: 8px;
//     }
    
//     .signature-line {
//       border-top: 1px solid #000;
//       margin-bottom: 3px;
//       height: 20px;
//     }
    
//     .footer-text {
//       text-align: center;
//       font-size: 8px;
//       color: #999;
//       margin-top: 15px;
//       padding-top: 5px;
//       border-top: 1px solid #ddd;
//     }
    
//     .empty-row {
//       height: 15px;
//     }
    
//     .status-badge {
//       display: inline-block;
//       padding: 2px 8px;
//       background: #4CAF50;
//       color: white;
//       font-size: 8px;
//       border-radius: 3px;
//       font-weight: bold;
//     }
    
//     .status-badge.active {
//       background: #2196F3;
//     }
    
//     .status-badge.completed {
//       background: #4CAF50;
//     }
    
//     .status-badge.cancelled {
//       background: #F44336;
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <div class="header">
//       <div class="phone-header">📞 ${t.phone1}<br>${t.phone2}</div>
//       <div class="logo-section">${logoImg}</div>
//       <div class="bill-title">${t.billTitle}</div>
//       <div class="company-tagline">${t.tagline}</div>
//       <div class="company-address">${t.address1}<br>${t.address2}</div>
//       <div class="contact-info">📧 ${t.email}</div>
//     </div>
    
//     <div class="invoice-header">
//       <div class="invoice-info">
//         <div class="section-title">${t.invoiceDetails}</div>
//         <div class="invoice-number">${t.invoiceNumber}${billNo}</div>
//         <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
//         <div class="info-row"><strong>${t.dueDate}:</strong> ${checkInDateStr}</div>
//       </div>
      
//       <div class="bill-to">
//         <div class="section-title">${t.billTo}</div>
//         <div class="info-row"><strong>${customer.name || 'N/A'}</strong></div>
//         <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
//         <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
//       </div>
//     </div>
    
//     <div class="rental-details">
//       <div class="detail-box">
//         <div class="detail-label">${t.rentalStatus}</div>
//         <div class="detail-value">
//           <span class="status-badge ${customer.status?.toLowerCase()}">${customer.status || 'Active'}</span>
//         </div>
//       </div>
//       <div class="detail-box">
//         <div class="detail-label">${t.checkInTime}</div>
//         <div class="detail-value">${customer.checkInTime || 'N/A'}</div>
//       </div>
//       <div class="detail-box">
//         <div class="detail-label">${t.rentalDuration}</div>
//         <div class="detail-value">${customer.rentalDays || 0} ${t.days}, ${customer.extraHours || 0} ${t.hours}</div>
//       </div>
//     </div>
    
//     <table>
//       <thead>
//         <tr>
//           <th style="width: 8%;">${t.sNo}</th>
//           <th style="width: 48%;">${t.itemDescription}</th>
//           <th style="width: 12%; text-align: center;">${t.qty}</th>
//           <th style="width: 16%; text-align: right;">${t.unitPrice}</th>
//           <th style="width: 16%; text-align: right;">${t.amount}</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${items.map((item, index) => {
//           const amount = (item.quantity || 0) * (item.price || 0);
//           return `<tr>
//             <td class="text-center">${index + 1}</td>
//             <td>${item.itemName || 'N/A'}</td>
//             <td class="text-center">${item.quantity || 0}</td>
//             <td class="text-right">Rs. ${(item.price || 0).toLocaleString('en-IN')}</td>
//             <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
//           </tr>`;
//         }).join('')}
//         <tr class="empty-row"><td colspan="5"></td></tr>
//         <tr class="empty-row"><td colspan="5"></td></tr>
//       </tbody>
//     </table>
    
//     <div class="totals-section">
//       <div class="summary-box">
//         <div class="summary-row">
//           <span class="summary-label">${t.subtotal}:</span>
//           <span>Rs. ${itemsTotal.toLocaleString('en-IN')}</span>
//         </div>
//         ${customer.depositAmount && customer.depositAmount > 0 ? `<div class="summary-row">
//           <span class="summary-label">${t.depositAmount}:</span>
//           <span>Rs. ${customer.depositAmount.toLocaleString('en-IN')}</span>
//         </div>` : ''}
//         ${customer.extraCharges && customer.extraCharges > 0 ? `<div class="summary-row">
//           <span class="summary-label">${t.extraCharges}:</span>
//           <span>Rs. ${customer.extraCharges.toLocaleString('en-IN')}</span>
//         </div>` : ''}
//         <div class="summary-row total">
//           <span class="summary-label">${t.totalDue}:</span>
//           <span>Rs. ${totalAmount.toLocaleString('en-IN')}</span>
//         </div>
//       </div>
//     </div>
    
//     <div class="payment-section">
//       <div class="payment-box">
//         <div class="section-title">${t.paymentInformation}</div>
//         <div class="payment-row">
//           <span>${t.depositReceived}:</span>
//           <span>Rs. ${(customer.depositAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span>${t.amountGiven}:</span>
//           <span>Rs. ${(customer.givenAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span>${t.balanceDue}:</span>
//           <span class="balance-value">Rs. ${(customer.remainingAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//       </div>
//     </div>
    
//     ${customer.notes ? `<div style="background: #fffacd; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 9px;">
//       <strong>${t.notes}:</strong> ${customer.notes}
//     </div>` : ''}
    
//     <div class="terms-section">
//       <h3>${t.termsConditions}</h3>
//       <ul class="terms-list">
//         <li>${t.term1}</li>
//         <li>${t.term2}</li>
//         <li>${t.term3}</li>
//         <li>${t.term4}</li>
//       </ul>
//     </div>
    
//     <div class="footer">
//       <div class="signature-box">
//         <div class="signature-line"></div>
//         <div>${t.customerSignature}</div>
//       </div>
//       <div class="signature-box">
//         <div class="signature-line"></div>
//         <div>${t.authorizedSignature}</div>
//       </div>
//     </div>
    
//     <div class="footer-text">
//       ${t.thankYou} 🙏<br>
//       ${t.generatedOn}: ${new Date().toLocaleString('en-IN')}
//     </div>
//   </div>
// </body>
// </html>`;

//     console.log('📄 Starting Customer PDF generation...');

//     browser = await puppeteer.launch({
//       headless: 'new',
//       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
//       timeout: 30000
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
//       printBackground: true
//     });

//     await browser.close();

//     if (!pdfBuffer || pdfBuffer.length === 0) {
//       console.error('❌ PDF buffer is empty');
//       return res.status(500).json({ success: false, message: 'PDF generation failed' });
//     }

//     console.log(`✅ Customer PDF generated: ${pdfBuffer.length} bytes`);

//     const fileName = `Bill_${customer.name}_${billNo}_${language.toUpperCase()}.pdf`;
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     if (browser) await browser.close();
//     res.status(500).json({ success: false, message: 'Error generating bill', error: error.message });
//   }
// };

//Version: 1.2
// File: backend/controllers/customerBillController.js
// UPDATED: Display per-item extra charges on rental invoice

// import puppeteer from 'puppeteer';
// import Customer from '../models/Customer.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const translations = {
//   en: {
//     billTitle: 'RENTAL INVOICE',
//     invoiceDetails: 'Invoice Details',
//     invoiceNumber: 'Customer #',
//     date: 'Registration Date',
//     dueDate: 'Check-in Date',
//     billTo: 'Customer Details',
//     phone: 'Phone',
//     email: 'Email',
//     address: 'Address',
//     itemDescription: 'Item Description',
//     qty: 'Qty',
//     unitPrice: 'Unit Price',
//     amount: 'Amount',
//     sNo: 'S.No',
//     subtotal: 'Subtotal',
//     extraChargesPerItem: 'Extra Charges (per item)',
//     totalExtraCharges: 'Total Extra Charges',
//     depositAmount: 'Deposit Amount',
//     totalDue: 'TOTAL AMOUNT',
//     paymentInformation: 'Payment Information',
//     depositReceived: 'Deposit Received',
//     amountGiven: 'Amount Given',
//     balanceDue: 'Balance Due',
//     termsConditions: 'Terms & Conditions',
//     term1: 'This is a rental invoice for items on rent.',
//     term2: 'Items remain rented until checkout date.',
//     term3: 'Full payment must be settled upon checkout.',
//     term4: 'Extra charges apply for overtime hours.',
//     rentalStatus: 'Rental Status',
//     checkInTime: 'Check-in Time',
//     rentalDuration: 'Rental Duration',
//     days: 'Days',
//     hours: 'Hours',
//     hourlyRate: 'Hourly Rate',
//     notes: 'Notes',
//     customerSignature: 'Customer Signature',
//     authorizedSignature: 'Authorized Signature',
//     thankYou: 'Thank you for renting with us!',
//     generatedOn: 'Generated on',
//     companyName: 'AJAY GADHI BHANDAR',
//     tagline: 'Premium Event Rental Solutions',
//     address1: 'Shipi Galli, Yevla - 423401',
//     address2: 'District Nashik, Maharashtra',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '+91 9226472249',
//     phone2: '+91 9405557668',
//     status: 'Status',
//     charges: 'Charges',
//     rate: 'Rate/hr'
//   },
//   mr: {
//     billTitle: 'किराया बिल',
//     invoiceDetails: 'बिल तपशील',
//     invoiceNumber: 'ग्राहक क्र. #',
//     date: 'नोंदणी तारीख',
//     dueDate: 'चेक-इन तारीख',
//     billTo: 'ग्राहक तपशील',
//     phone: 'फोन',
//     email: 'ईमेल',
//     address: 'पता',
//     itemDescription: 'वस्तूचे वर्णन',
//     qty: 'प्रमाण',
//     unitPrice: 'एकक किंमत',
//     amount: 'रक्कम',
//     sNo: 'क्र.',
//     subtotal: 'उप-एकूण',
//     extraChargesPerItem: 'अतिरिक्त शुल्क (प्रति वस्तू)',
//     totalExtraCharges: 'एकूण अतिरिक्त शुल्क',
//     depositAmount: 'जमा रक्कम',
//     totalDue: 'एकूण रक्कम',
//     paymentInformation: 'भुगतान माहिती',
//     depositReceived: 'जमा केलेली रक्कम',
//     amountGiven: 'दिलेली रक्कम',
//     balanceDue: 'शिल्लक देय',
//     termsConditions: 'अटी व शर्ती',
//     term1: 'हे किराये का बिल आहे.',
//     term2: 'वस्तू चेक-आउट तारखेपर्यंत किरायावर राहतील.',
//     term3: 'चेक-आउटवेळी संपूर्ण भुगतान करणे आवश्यक आहे.',
//     term4: 'ओव्हरटाइम तासांसाठी अतिरिक्त शुल्क लागू आहे.',
//     rentalStatus: 'किराया स्थिती',
//     checkInTime: 'चेक-इन वेळ',
//     rentalDuration: 'किराया कालावधी',
//     days: 'दिवस',
//     hours: 'तास',
//     hourlyRate: 'प्रति तास दर',
//     notes: 'टिप्पणी',
//     customerSignature: 'ग्राहकाची स्वाक्षरी',
//     authorizedSignature: 'अधिकृत स्वाक्षरी',
//     thankYou: 'आमच्याकडे किरायावर दिल्याबद्दल धन्यवाद!',
//     generatedOn: 'निर्माण केलेले',
//     companyName: 'अजय घडी भंडार',
//     tagline: 'प्रीमियम इव्हेंट किराया समाधान',
//     address1: 'शिपी गल्ली, येवला - 423401',
//     address2: 'जिल्हा नाशिक, महाराष्ट्र',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '+९१ ९२२६४७२२४९',
//     phone2: '+९१ ९४०५५५७६६८',
//     status: 'स्थिती',
//     charges: 'शुल्क',
//     rate: 'दर/तास'
//   }
// };

// export const generateCustomerBill = async (req, res) => {
//   let browser;
//   try {
//     const { id } = req.params;
//     const { language = 'en' } = req.query;

//     if (!['en', 'mr'].includes(language)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid language'
//       });
//     }

//     const t = translations[language];
//     const customer = await Customer.findById(id).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     const billNo = customer._id.toString().slice(-6);
//     const regDate = new Date(customer.registrationDate);
//     const dateStr = `${regDate.getDate()}/${regDate.getMonth() + 1}/${regDate.getFullYear()}`;
    
//     const checkInDate = customer.checkInDate ? new Date(customer.checkInDate) : regDate;
//     const checkInDateStr = `${checkInDate.getDate()}/${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

//     // Parse items
//     let items = [];
//     try {
//       items = typeof customer.items === 'string' ? JSON.parse(customer.items) : customer.items || [];
//     } catch (e) {
//       items = [];
//     }

//     // ✅ Extract per-item checkout data and extra charges
//     const itemsCheckoutData = customer.itemsCheckoutData || {};
//     let itemsWithExtraCharges = items.map(item => {
//       const itemKey = item.itemId || item._id;
//       const checkoutData = itemsCheckoutData[itemKey] || {};
//       return {
//         ...item,
//         itemId: itemKey,
//         rentalDays: checkoutData.rentalDays || 0,
//         extraHours: checkoutData.extraHours || 0,
//         hourlyRate: checkoutData.hourlyRate || 0,
//         extraCharges: checkoutData.extraCharges || 0
//       };
//     });

//     const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
//     // ✅ Calculate total extra charges from all items
//     let totalExtraChargesAmount = 0;
//     itemsWithExtraCharges.forEach(item => {
//       totalExtraChargesAmount += item.extraCharges || 0;
//     });

//     const totalAmount = customer.totalAmount || itemsTotal;

//     // Load logo
//     let logoImg = '';
//     const logoPath = path.join(__dirname, '../images/logo.png');
//     if (fs.existsSync(logoPath)) {
//       const logoData = fs.readFileSync(logoPath);
//       const logoBase64 = logoData.toString('base64');
//       logoImg = `<img src="data:image/png;base64,${logoBase64}" style="max-width: 300px; max-height: 150px; object-fit: contain;" />`;
//     }

//     const htmlContent = `<!DOCTYPE html>
// <html lang="${language}">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${t.billTitle} ${billNo}</title>
//   <style>
//     @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
    
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     body {
//       font-family: ${language === 'mr' ? "'Noto Sans Devanagari', Arial, sans-serif" : "Arial, sans-serif"};
//       background: white;
//       color: #333;
//       line-height: 1.6;
//     }
    
//     .page {
//       width: 100%;
//       padding: 20px;
//       background: white;
//     }
    
//     .header {
//       text-align: center;
//       margin-bottom: 20px;
//       border-bottom: 3px solid #8B4513;
//       padding-bottom: 15px;
//       position: relative;
//     }
    
//     .phone-header {
//       position: absolute;
//       top: 5px;
//       right: 0;
//       font-size: 10px;
//       font-weight: bold;
//       line-height: 1.4;
//     }
    
//     .logo-section {
//       margin-bottom: 10px;
//     }
    
//     .bill-title {
//       font-size: 18px;
//       font-weight: bold;
//       color: #8B4513;
//       margin: 8px 0;
//       text-transform: uppercase;
//       letter-spacing: 1px;
//     }
    
//     .company-tagline {
//       font-size: 11px;
//       color: #666;
//       margin: 3px 0;
//     }
    
//     .company-address {
//       font-size: 10px;
//       color: #666;
//       margin: 2px 0;
//     }
    
//     .contact-info {
//       font-size: 9px;
//       color: #666;
//       margin-top: 5px;
//     }
    
//     .invoice-header {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 20px;
//     }
    
//     .invoice-info, .bill-to {
//       flex: 1;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .section-title {
//       color: #8B4513;
//       font-size: 10px;
//       font-weight: bold;
//       margin-bottom: 5px;
//       text-transform: uppercase;
//       border-bottom: 2px solid #8B4513;
//       padding-bottom: 3px;
//     }
    
//     .invoice-number {
//       font-size: 14px;
//       color: #DC143C;
//       font-weight: bold;
//       margin: 5px 0;
//     }
    
//     .info-row {
//       font-size: 9px;
//       margin: 2px 0;
//       color: #555;
//     }
    
//     .rental-details {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 15px;
//       font-size: 9px;
//     }
    
//     .detail-box {
//       flex: 1;
//       padding: 8px;
//       background: #f0f8ff;
//       border: 1px solid #87ceeb;
//     }
    
//     .detail-label {
//       color: #8B4513;
//       font-weight: bold;
//       font-size: 8px;
//       text-transform: uppercase;
//       margin-bottom: 2px;
//     }
    
//     .detail-value {
//       font-size: 10px;
//       color: #333;
//     }
    
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 15px 0;
//       font-size: 9px;
//     }
    
//     thead {
//       background: #8B4513;
//       color: white;
//     }
    
//     th {
//       padding: 8px;
//       text-align: left;
//       font-weight: bold;
//       border: 1px solid #8B4513;
//     }
    
//     td {
//       padding: 8px;
//       border: 1px solid #ddd;
//     }
    
//     tbody tr:nth-child(odd) {
//       background: #f9f9f9;
//     }
    
//     .text-right {
//       text-align: right;
//     }
    
//     .text-center {
//       text-align: center;
//     }
    
//     .extra-charges-table {
//       width: 100%;
//       margin: 15px 0;
//       font-size: 8px;
//       border-collapse: collapse;
//     }
    
//     .extra-charges-table thead {
//       background: #FFE4B5;
//     }
    
//     .extra-charges-table th {
//       padding: 6px;
//       text-align: left;
//       font-weight: bold;
//       border: 1px solid #DEB887;
//       color: #8B4513;
//     }
    
//     .extra-charges-table td {
//       padding: 6px;
//       border: 1px solid #DEB887;
//     }
    
//     .extra-charges-table tbody tr:nth-child(odd) {
//       background: #FFF8DC;
//     }
    
//     .totals-section {
//       margin-bottom: 15px;
//       display: flex;
//       justify-content: flex-end;
//     }
    
//     .summary-box {
//       width: 280px;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .summary-row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 5px;
//       font-size: 9px;
//     }
    
//     .summary-row.total {
//       background: #8B4513;
//       color: white;
//       padding: 8px;
//       margin: 5px -10px -10px -10px;
//       font-weight: bold;
//       font-size: 10px;
//     }
    
//     .summary-label {
//       font-weight: 500;
//     }
    
//     .payment-section {
//       display: flex;
//       gap: 15px;
//       margin-bottom: 15px;
//     }
    
//     .payment-box {
//       flex: 1;
//       padding: 10px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//       font-size: 9px;
//     }
    
//     .payment-row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 3px;
//     }
    
//     .balance-value {
//       color: #DC143C;
//       font-weight: bold;
//     }
    
//     .terms-section {
//       background: #f5f5f5;
//       padding: 10px;
//       border: 1px solid #ddd;
//       margin-bottom: 15px;
//       font-size: 8px;
//     }
    
//     .terms-section h3 {
//       color: #8B4513;
//       font-size: 9px;
//       font-weight: bold;
//       margin-bottom: 5px;
//       text-transform: uppercase;
//       border-bottom: 2px solid #8B4513;
//       padding-bottom: 3px;
//     }
    
//     .terms-list {
//       margin-left: 15px;
//     }
    
//     .terms-list li {
//       margin-bottom: 2px;
//       line-height: 1.4;
//     }
    
//     .footer {
//       display: flex;
//       justify-content: space-between;
//       margin-top: 20px;
//       padding-top: 10px;
//       border-top: 1px solid #ddd;
//     }
    
//     .signature-box {
//       width: 150px;
//       text-align: center;
//       font-size: 8px;
//     }
    
//     .signature-line {
//       border-top: 1px solid #000;
//       margin-bottom: 3px;
//       height: 20px;
//     }
    
//     .footer-text {
//       text-align: center;
//       font-size: 8px;
//       color: #999;
//       margin-top: 15px;
//       padding-top: 5px;
//       border-top: 1px solid #ddd;
//     }
    
//     .empty-row {
//       height: 15px;
//     }
    
//     .status-badge {
//       display: inline-block;
//       padding: 2px 8px;
//       background: #4CAF50;
//       color: white;
//       font-size: 8px;
//       border-radius: 3px;
//       font-weight: bold;
//     }
    
//     .status-badge.active {
//       background: #2196F3;
//     }
    
//     .status-badge.completed {
//       background: #4CAF50;
//     }
    
//     .status-badge.cancelled {
//       background: #F44336;
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <div class="header">
//       <div class="phone-header">📞 ${t.phone1}<br>${t.phone2}</div>
//       <div class="logo-section">${logoImg}</div>
//       <div class="bill-title">${t.billTitle}</div>
//       <div class="company-tagline">${t.tagline}</div>
//       <div class="company-address">${t.address1}<br>${t.address2}</div>
//       <div class="contact-info">📧 ${t.email}</div>
//     </div>
    
//     <div class="invoice-header">
//       <div class="invoice-info">
//         <div class="section-title">${t.invoiceDetails}</div>
//         <div class="invoice-number">${t.invoiceNumber}${billNo}</div>
//         <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
//         <div class="info-row"><strong>${t.dueDate}:</strong> ${checkInDateStr}</div>
//       </div>
      
//       <div class="bill-to">
//         <div class="section-title">${t.billTo}</div>
//         <div class="info-row"><strong>${customer.name || 'N/A'}</strong></div>
//         <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
//         <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
//       </div>
//     </div>
    
//     <div class="rental-details">
//       <div class="detail-box">
//         <div class="detail-label">${t.rentalStatus}</div>
//         <div class="detail-value">
//           <span class="status-badge ${customer.status?.toLowerCase()}">${customer.status || 'Active'}</span>
//         </div>
//       </div>
//       <div class="detail-box">
//         <div class="detail-label">${t.checkInTime}</div>
//         <div class="detail-value">${customer.checkInTime || 'N/A'}</div>
//       </div>
//     </div>
    
//     <!-- Items Table -->
//     <table>
//       <thead>
//         <tr>
//           <th style="width: 8%;">${t.sNo}</th>
//           <th style="width: 48%;">${t.itemDescription}</th>
//           <th style="width: 12%; text-align: center;">${t.qty}</th>
//           <th style="width: 16%; text-align: right;">${t.unitPrice}</th>
//           <th style="width: 16%; text-align: right;">${t.amount}</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${items.map((item, index) => {
//           const amount = (item.quantity || 0) * (item.price || 0);
//           return `<tr>
//             <td class="text-center">${index + 1}</td>
//             <td>${item.itemName || 'N/A'}</td>
//             <td class="text-center">${item.quantity || 0}</td>
//             <td class="text-right">Rs. ${(item.price || 0).toLocaleString('en-IN')}</td>
//             <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
//           </tr>`;
//         }).join('')}
//         <tr class="empty-row"><td colspan="5"></td></tr>
//       </tbody>
//     </table>

//     <!-- Per-Item Extra Charges Table -->
//     ${itemsWithExtraCharges.some(item => item.extraCharges > 0) ? `
//     <div style="margin-bottom: 15px;">
//       <div style="color: #8B4513; font-size: 10px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">
//         ⏱️ ${t.extraChargesPerItem}
//       </div>
//       <table class="extra-charges-table">
//         <thead>
//           <tr>
//             <th style="width: 8%;">${t.sNo}</th>
//             <th style="width: 32%;">${t.itemDescription}</th>
//             <th style="width: 12%; text-align: center;">${t.days}</th>
//             <th style="width: 12%; text-align: center;">${t.hours}</th>
//             <th style="width: 15%; text-align: right;">${t.rate}</th>
//             <th style="width: 21%; text-align: right;">${t.charges}</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsWithExtraCharges.map((item, index) => {
//             if (!item.extraCharges || item.extraCharges === 0) return '';
//             return `<tr>
//               <td class="text-center">${index + 1}</td>
//               <td>${item.itemName || 'N/A'}</td>
//               <td class="text-center">${item.rentalDays || 0}</td>
//               <td class="text-center">${item.extraHours || 0}</td>
//               <td class="text-right">Rs. ${(item.hourlyRate || 0).toLocaleString('en-IN')}</td>
//               <td class="text-right">Rs. ${item.extraCharges.toLocaleString('en-IN')}</td>
//             </tr>`;
//           }).join('')}
//         </tbody>
//       </table>
//     </div>
//     ` : ''}

//     <!-- Summary Section -->
//     <div class="totals-section">
//       <div class="summary-box">
//         <div class="summary-row">
//           <span class="summary-label">${t.subtotal}:</span>
//           <span>Rs. ${itemsTotal.toLocaleString('en-IN')}</span>
//         </div>
//         ${totalExtraChargesAmount > 0 ? `<div class="summary-row">
//           <span class="summary-label">${t.totalExtraCharges}:</span>
//           <span>Rs. ${totalExtraChargesAmount.toLocaleString('en-IN')}</span>
//         </div>` : ''}
//         ${customer.depositAmount && customer.depositAmount > 0 ? `<div class="summary-row">
//           <span class="summary-label">${t.depositAmount}:</span>
//           <span>Rs. ${customer.depositAmount.toLocaleString('en-IN')}</span>
//         </div>` : ''}
//         <div class="summary-row total">
//           <span class="summary-label">${t.totalDue}:</span>
//           <span>Rs. ${totalAmount.toLocaleString('en-IN')}</span>
//         </div>
//       </div>
//     </div>
    
//     <!-- Payment Information -->
//     <div class="payment-section">
//       <div class="payment-box">
//         <div class="section-title">${t.paymentInformation}</div>
//         <div class="payment-row">
//           <span>${t.depositReceived}:</span>
//           <span>Rs. ${(customer.depositAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span>${t.amountGiven}:</span>
//           <span>Rs. ${(customer.givenAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span>${t.balanceDue}:</span>
//           <span class="balance-value">Rs. ${(customer.remainingAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//       </div>
//     </div>
    
//     ${customer.notes ? `<div style="background: #fffacd; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 9px;">
//       <strong>${t.notes}:</strong> ${customer.notes}
//     </div>` : ''}
    
//     <!-- Terms & Conditions -->
//     <div class="terms-section">
//       <h3>${t.termsConditions}</h3>
//       <ul class="terms-list">
//         <li>${t.term1}</li>
//         <li>${t.term2}</li>
//         <li>${t.term3}</li>
//         <li>${t.term4}</li>
//       </ul>
//     </div>
    
//     <!-- Signatures -->
//     <div class="footer">
//       <div class="signature-box">
//         <div class="signature-line"></div>
//         <div>${t.customerSignature}</div>
//       </div>
//       <div class="signature-box">
//         <div class="signature-line"></div>
//         <div>${t.authorizedSignature}</div>
//       </div>
//     </div>
    
//     <div class="footer-text">
//       ${t.thankYou} 🙏<br>
//       ${t.generatedOn}: ${new Date().toLocaleString('en-IN')}
//     </div>
//   </div>
// </body>
// </html>`;

//     console.log('📄 Starting Customer PDF generation with per-item extra charges...');

//     browser = await puppeteer.launch({
//       headless: 'new',
//       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
//       timeout: 30000
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
//       printBackground: true
//     });

//     await browser.close();

//     if (!pdfBuffer || pdfBuffer.length === 0) {
//       console.error('❌ PDF buffer is empty');
//       return res.status(500).json({ success: false, message: 'PDF generation failed' });
//     }

//     console.log(`✅ Customer PDF generated: ${pdfBuffer.length} bytes`);

//     const fileName = `Bill_${customer.name}_${billNo}_${language.toUpperCase()}.pdf`;
    
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Length', pdfBuffer.length);
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     if (browser) await browser.close();
//     res.status(500).json({ success: false, message: 'Error generating bill', error: error.message });
//   }
// };


//Version 2
// File: backend/controllers/customerBillController.js
// COMPLETE & FIXED: Display per-item checkout details in PDF bill

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
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    itemDescription: 'Item Description',
    qty: 'Qty',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    sNo: 'S.No',
    subtotal: 'Subtotal',
    totalExtraCharges: 'Total Extra Charges',
    depositAmount: 'Deposit Amount',
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
    rentalDuration: 'ITEM-WISE RENTAL DETAILS',
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
    checkOutDate: 'Check-out Date',
    checkOutTime: 'Check-out Time'
  },
  mr: {
    billTitle: 'किराया बिल',
    invoiceDetails: 'बिल तपशील',
    invoiceNumber: 'ग्राहक क्र. #',
    date: 'नोंदणी तारीख',
    dueDate: 'चेक-इन तारीख',
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
    totalExtraCharges: 'एकूण अतिरिक्त शुल्क',
    depositAmount: 'जमा रक्कम',
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
    rentalDuration: 'वस्तू-वार किराया तपशील',
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
      return res.status(400).json({
        success: false,
        message: 'Invalid language'
      });
    }

    const t = translations[language];
    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const billNo = customer._id.toString().slice(-6);
    const regDate = new Date(customer.registrationDate);
    const dateStr = `${regDate.getDate()}/${regDate.getMonth() + 1}/${regDate.getFullYear()}`;
    
    const checkInDate = customer.checkInDate ? new Date(customer.checkInDate) : regDate;
    const checkInDateStr = `${checkInDate.getDate()}/${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

    // ✅ Parse items
    let items = [];
    try {
      items = typeof customer.items === 'string' ? JSON.parse(customer.items) : customer.items || [];
    } catch (e) {
      items = [];
    }

    // ✅ Extract per-item checkout data and extra charges
    let itemsCheckoutData = customer.itemsCheckoutData || {};
    
    // Convert Map to object if needed
    if (itemsCheckoutData instanceof Map) {
      const tempObj = {};
      for (const [key, value] of itemsCheckoutData) {
        tempObj[key] = value;
      }
      itemsCheckoutData = tempObj;
    }

    // console.log('📋 Items Checkout Data:', itemsCheckoutData);
    logger.debug('📋 Items Checkout Data:', itemsCheckoutData);

    let itemsWithExtraCharges = items.map((item, idx) => {
      const itemKey = item.itemId?.toString() || item._id?.toString();
      const checkoutData = itemsCheckoutData[itemKey] || {};
      
      // console.log(`Item ${idx + 1} (${itemKey}):`, checkoutData);
      logger.debug(`Item ${idx + 1} (${itemKey}):`, checkoutData);

      return {
        ...item,
        itemId: itemKey,
        index: idx + 1,
        rentalDays: checkoutData.rentalDays || 0,
        extraHours: checkoutData.extraHours || 0,
        hourlyRate: checkoutData.hourlyRate || 0,
        extraCharges: checkoutData.extraCharges || 0,
        checkOutDate: checkoutData.checkOutDate || '',
        checkOutTime: checkoutData.checkOutTime || ''
      };
    });

    const itemsTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    // ✅ Calculate total extra charges from all items
    let totalExtraChargesAmount = 0;
    Object.keys(itemsCheckoutData).forEach(itemKey => {
      const itemData = itemsCheckoutData[itemKey];
      if (itemData && itemData.extraCharges) {
        totalExtraChargesAmount += parseFloat(itemData.extraCharges) || 0;
      }
    });

    // console.log('💰 Total Extra Charges:', totalExtraChargesAmount);
    logger.debug('💰 Total Extra Charges:', totalExtraChargesAmount);

    const totalAmount = customer.totalAmount || itemsTotal;

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
    
    .rental-details {
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
      font-size: 8px;
    }
    
    thead {
      background: #8B4513;
      color: white;
    }
    
    th {
      padding: 6px;
      text-align: left;
      font-weight: bold;
      border: 1px solid #8B4513;
    }
    
    td {
      padding: 6px;
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
    
    .rental-table thead {
      background: #8B4513;
      color: white;
    }
    
    .rental-table th {
      border: 1px solid #8B4513;
      color: white;
    }
    
    .rental-table td {
      border: 1px solid #ddd;
    }
    
    .rental-table tbody tr:nth-child(odd) {
      background: #f9f9f9;
    }
    
    .totals-section {
      margin-bottom: 15px;
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 280px;
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
      height: 12px;
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
        <div class="info-row"><strong>${t.dueDate}:</strong> ${checkInDateStr}</div>
      </div>
      
      <div class="bill-to">
        <div class="section-title">${t.billTo}</div>
        <div class="info-row"><strong>${customer.name || 'N/A'}</strong></div>
        <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
        <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
      </div>
    </div>
    
    <div class="rental-details">
      <div class="detail-box">
        <div class="detail-label">${t.rentalStatus}</div>
        <div class="detail-value">
          <span class="status-badge ${customer.status?.toLowerCase()}">${customer.status || 'Active'}</span>
        </div>
      </div>
      <div class="detail-box">
        <div class="detail-label">${t.checkInTime}</div>
        <div class="detail-value">${customer.checkInTime || 'N/A'}</div>
      </div>
    </div>
    
    <!-- Items Table with Per-Item Rental Details -->
    <table class="rental-table">
      <thead>
        <tr>
          <th style="width: 5%;">${t.sNo}</th>
          <th style="width: 14%;">${t.itemDescription}</th>
          <th style="width: 7%; text-align: center;">${t.qty}</th>
          <th style="width: 9%; text-align: right;">${t.unitPrice}</th>
          <th style="width: 11%; text-align: right;">${t.amount}</th>
          <th style="width: 10%;">${t.checkOutDate}</th>
          <th style="width: 9%;">${t.checkOutTime}</th>
          <th style="width: 7%; text-align: center;">${t.days}</th>
          <th style="width: 7%; text-align: center;">${t.hours}</th>
          <th style="width: 9%; text-align: right;">${t.hourlyRate}</th>
          <th style="width: 10%; text-align: right;">${t.charges}</th>
        </tr>
      </thead>
      <tbody>
        ${itemsWithExtraCharges.map((item, index) => {
          const amount = (item.quantity || 0) * (item.price || 0);
          const checkOutDateFormatted = item.checkOutDate 
            ? new Date(item.checkOutDate).toLocaleDateString('en-IN')
            : 'N/A';
          
          return `<tr>
            <td class="text-center">${item.index}</td>
            <td>${item.itemName || 'N/A'}</td>
            <td class="text-center">${item.quantity || 0}</td>
            <td class="text-right">Rs. ${(item.price || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
            <td>${checkOutDateFormatted}</td>
            <td>${item.checkOutTime || 'N/A'}</td>
            <td class="text-center">${item.rentalDays || 0}</td>
            <td class="text-center">${item.extraHours || 0}</td>
            <td class="text-right">Rs. ${(item.hourlyRate || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">Rs. ${(item.extraCharges || 0).toLocaleString('en-IN')}</td>
          </tr>`;
        }).join('')}
        <tr class="empty-row"><td colspan="11"></td></tr>
      </tbody>
    </table>

    <!-- Summary Section -->
    <div class="totals-section">
      <div class="summary-box">
        <div class="summary-row">
          <span class="summary-label">${t.subtotal}:</span>
          <span>Rs. ${itemsTotal.toLocaleString('en-IN')}</span>
        </div>
        ${totalExtraChargesAmount > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.totalExtraCharges}:</span>
          <span>Rs. ${totalExtraChargesAmount.toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${customer.depositAmount && customer.depositAmount > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.depositAmount}:</span>
          <span>Rs. ${customer.depositAmount.toLocaleString('en-IN')}</span>
        </div>` : ''}
        <div class="summary-row total">
          <span class="summary-label">${t.totalDue}:</span>
          <span>Rs. ${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <!-- Payment Information -->
    <div class="payment-section">
      <div class="payment-box">
        <div class="section-title">${t.paymentInformation}</div>
        <div class="payment-row">
          <span>${t.depositReceived}:</span>
          <span>Rs. ${(customer.depositAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.amountGiven}:</span>
          <span>Rs. ${(customer.givenAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div class="payment-row">
          <span>${t.balanceDue}:</span>
          <span class="balance-value">Rs. ${(customer.remainingAmount || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    ${customer.notes ? `<div style="background: #fffacd; padding: 10px; border: 1px solid #ddd; margin-bottom: 15px; font-size: 9px;">
      <strong>${t.notes}:</strong> ${customer.notes}
    </div>` : ''}
    
    <!-- Terms & Conditions -->
    <div class="terms-section">
      <h3>${t.termsConditions}</h3>
      <ul class="terms-list">
        <li>${t.term1}</li>
        <li>${t.term2}</li>
        <li>${t.term3}</li>
        <li>${t.term4}</li>
      </ul>
    </div>
    
    <!-- Signatures -->
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

    // console.log('📄 Starting Customer PDF generation with per-item rental details in table...');
    logger.debug('📄 Starting Customer PDF generation with per-item rental details in table...');

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

    // console.log(`✅ Customer PDF generated: ${pdfBuffer.length} bytes`);
    logger.info(`✅ Customer PDF generated: ${pdfBuffer.length} bytes`);

    const fileName = `Bill_${customer.name}_${billNo}_${language.toUpperCase()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    // console.error('❌ Error:', error.message);
    logger.error('❌ Error:', error.message);
    if (browser) await browser.close();
    res.status(500).json({ 
      success: false, 
      message: 'Error generating bill', 
      error: error.message 
    });
  }
};