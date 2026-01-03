// import pdf from 'html-pdf';
// import Customer from '../models/Customer.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // =====================================================
// // LANGUAGE TRANSLATIONS
// // =====================================================
// const translations = {
//   en: {
//     invoiceDetails: 'Invoice Details',
//     invoiceNumber: 'Invoice #',
//     date: 'Date',
//     dueDate: 'Due Date',
//     billTo: 'Bill To',
//     phone: 'Phone',
//     address: 'Address',
//     itemDescription: 'Item Description',
//     qty: 'Qty',
//     unitPrice: 'Unit Price',
//     amount: 'Amount',
//     sNo: 'S.No',
//     subtotal: 'Subtotal',
//     transport: 'Transport',
//     maintenance: 'Maintenance',
//     extraCharges: 'Extra Charges',
//     totalDue: 'TOTAL DUE',
//     paymentInformation: 'Payment Information',
//     depositReceived: 'Deposit Received',
//     amountGiven: 'Amount Given',
//     balanceDue: 'Balance Due',
//     termsConditions: 'Terms & Conditions',
//     term1: 'Items must be returned in original condition within agreed timeframe',
//     term2: 'Lost or damaged items will be charged at full replacement cost',
//     term3: 'Payment must be settled within 7 days of invoice date',
//     term4: 'Any disputes must be reported immediately',
//     customerSignature: 'Customer Signature',
//     authorizedSignature: 'Authorized Signature',
//     thankYou: 'Thank you for your business!',
//     generatedOn: 'Generated on',
//     companyName: 'AJAY GADHI BHANDAR',
//     tagline: 'Premium Event Rental Solutions',
//     address1: 'Shipi Galli, Yevla - 423401',
//     address2: 'District Nashik, Maharashtra',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '2651189',
//     phone2: '2658489'
//   },
//   mr: {
//     invoiceDetails: 'बिल तपशील',
//     invoiceNumber: 'बिल क्रमांक #',
//     date: 'तारीख',
//     dueDate: 'देय तारीख',
//     billTo: 'चलन पत्ता',
//     phone: 'फोन',
//     address: 'पता',
//     itemDescription: 'वस्तूचे वर्णन',
//     qty: 'प्रमाण',
//     unitPrice: 'एकक किंमत',
//     amount: 'रक्कम',
//     sNo: 'क्र.',
//     subtotal: 'उप-एकूण',
//     transport: 'वाहतूक',
//     maintenance: 'देखभाल',
//     extraCharges: 'अतिरिक्त शुल्क',
//     totalDue: 'एकूण देय',
//     paymentInformation: 'भुगतान माहिती',
//     depositReceived: 'जमा केलेली रक्कम',
//     amountGiven: 'दिलेली रक्कम',
//     balanceDue: 'शिल्लक देय',
//     termsConditions: 'अटी व शर्ती',
//     term1: 'वस्तू सहमत कालावधीत मूळ स्थितीत परत केल्या पाहिजेत',
//     term2: 'हरवलेल्या किंवा खराब झालेल्या वस्तूंचा पूर्ण प्रतिस्थापन खर्च आकारला जाईल',
//     term3: 'बिलाच्या तारखेपासून 7 दिवसांत भुगतान केले जाणे आवश्यक आहे',
//     term4: 'कोणतेही विवाद तातडीने कळविणे आवश्यक आहे',
//     customerSignature: 'ग्राहकाची स्वाक्षरी',
//     authorizedSignature: 'अधिकृत स्वाक्षरी',
//     thankYou: 'आपल्या व्यवसायाबद्दल धन्यवाद!',
//     generatedOn: 'निर्माण केलेले',
//     companyName: 'अजय घडी भंडार',
//     tagline: 'प्रीमियम इव्हेंट किराया समाधान',
//     address1: 'शिपी गल्ली, येवला - 423401',
//     address2: 'जिल्हा नाशिक, महाराष्ट्र',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '2651189',
//     phone2: '2658489'
//   }
// };

// // =====================================================
// // HELPER FUNCTION: Build HTML Content
// // =====================================================
// function buildBillHTML(customer, language, logoImg, billNo, dateStr, dueDateStr, itemsTotal, totalAmount, translations) {
//   const t = translations[language];
  
//   let html = `<!DOCTYPE html>
// <html lang="${language}">
// <head>
//   <meta charset="UTF-8">
//   <title>Invoice</title>
//   <style>
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     html, body {
//       height: 100%;
//       width: 100%;
//     }
    
//     body {
//       font-family: Arial, sans-serif;
//       background: white;
//       padding: 10px;
//       color: #333;
//       line-height: 1.3;
//     }
    
//     .invoice-container {
//       background: white;
//       padding: 15px;
//       border: 2px solid #8B4513;
//       min-height: 100%;
//     }
    
//     .header {
//       position: relative;
//       text-align: center;
//       margin-bottom: 12px;
//       border-bottom: 3px solid #8B4513;
//       padding-bottom: 10px;
//     }
    
//     .phone-header {
//       position: absolute;
//       top: 0;
//       right: 0;
//       font-size: 9px;
//       color: #8B4513;
//       font-weight: bold;
//       line-height: 1.2;
//     }
    
//     .logo-section {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       gap: 10px;
//       margin-bottom: 5px;
//     }
    
//     .logo-img {
//       width: 150px;
//       height: 60px;
//       object-fit: contain;
//     }
    
//     .company-name {
//       font-size: 18px;
//       font-weight: bold;
//       color: #8B4513;
//       margin-bottom: 2px;
//     }
    
//     .company-tagline {
//       font-size: 9px;
//       color: #666;
//       margin-bottom: 2px;
//     }
    
//     .company-address {
//       font-size: 8px;
//       color: #666;
//       line-height: 1.2;
//       margin-bottom: 1px;
//     }
    
//     .contact-info {
//       font-size: 8px;
//       color: #666;
//       margin-top: 2px;
//     }
    
//     .invoice-header {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 12px;
//       gap: 10px;
//     }
    
//     .invoice-info, .bill-to {
//       flex: 1;
//       padding: 8px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .section-title {
//       color: #8B4513;
//       font-size: 9px;
//       font-weight: bold;
//       margin-bottom: 4px;
//       text-transform: uppercase;
//       border-bottom: 1px solid #8B4513;
//       padding-bottom: 2px;
//     }
    
//     .invoice-number {
//       font-size: 12px;
//       color: #DC143C;
//       font-weight: bold;
//       margin: 3px 0;
//     }
    
//     .info-row {
//       font-size: 8px;
//       margin: 2px 0;
//       color: #555;
//     }
    
//     .items-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 10px;
//       font-size: 8px;
//     }
    
//     .items-table thead {
//       background: #8B4513;
//       color: white;
//     }
    
//     .items-table th {
//       padding: 6px;
//       text-align: left;
//       font-size: 8px;
//       font-weight: bold;
//       border: 1px solid #8B4513;
//     }
    
//     .items-table td {
//       padding: 5px 6px;
//       font-size: 8px;
//       border: 1px solid #ddd;
//     }
    
//     .items-table tbody tr:nth-child(odd) {
//       background: #f9f9f9;
//     }
    
//     .text-right {
//       text-align: right;
//     }
    
//     .text-center {
//       text-align: center;
//     }
    
//     .totals-section {
//       margin-bottom: 10px;
//       display: flex;
//       justify-content: flex-end;
//     }
    
//     .summary-box {
//       width: 220px;
//       padding: 8px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .summary-row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 3px;
//       font-size: 8px;
//     }
    
//     .summary-row.total {
//       background: #8B4513;
//       color: white;
//       padding: 6px;
//       margin: 5px -8px -8px -8px;
//       font-weight: bold;
//       font-size: 9px;
//     }
    
//     .summary-label {
//       color: #666;
//       font-weight: 500;
//     }
    
//     .summary-row.total .summary-label {
//       color: white;
//     }
    
//     .payment-section {
//       display: flex;
//       gap: 10px;
//       margin-bottom: 10px;
//     }
    
//     .payment-box {
//       flex: 1;
//       padding: 8px;
//       background: #f5f5f5;
//       border: 1px solid #ddd;
//     }
    
//     .payment-row {
//       display: flex;
//       justify-content: space-between;
//       font-size: 8px;
//       margin-bottom: 2px;
//     }
    
//     .payment-label {
//       color: #666;
//       font-weight: 500;
//     }
    
//     .payment-value {
//       font-weight: bold;
//       color: #333;
//     }
    
//     .balance-value {
//       color: #DC143C;
//     }
    
//     .terms-section {
//       background: #f5f5f5;
//       padding: 8px;
//       border: 1px solid #ddd;
//       margin-bottom: 10px;
//     }
    
//     .terms-section h3 {
//       color: #8B4513;
//       font-size: 9px;
//       font-weight: bold;
//       margin-bottom: 4px;
//       text-transform: uppercase;
//       border-bottom: 1px solid #8B4513;
//       padding-bottom: 2px;
//     }
    
//     .terms-list {
//       font-size: 7px;
//       color: #555;
//       line-height: 1.3;
//     }
    
//     .terms-list li {
//       margin-bottom: 2px;
//       margin-left: 12px;
//     }
    
//     .footer {
//       display: flex;
//       justify-content: space-between;
//       margin-top: 15px;
//       padding-top: 10px;
//       border-top: 1px solid #ddd;
//     }
    
//     .signature-box {
//       width: 120px;
//       text-align: center;
//       font-size: 7px;
//     }
    
//     .signature-line {
//       border-top: 1px solid #000;
//       margin-bottom: 3px;
//       height: 15px;
//     }
    
//     .footer-text {
//       text-align: center;
//       font-size: 7px;
//       color: #999;
//       margin-top: 10px;
//       padding-top: 5px;
//       border-top: 1px solid #ddd;
//     }
    
//     .empty-row {
//       height: 0px;
//     }
//   </style>
// </head>
// <body>
//   <div class="invoice-container">
//     <!-- HEADER -->
//     <div class="header">
//       <div class="phone-header">
//         📞 ${t.phone1}<br>${t.phone2}
//       </div>
//       <div class="logo-section">
//         ${logoImg}
//       </div>
//       <div class="company-name">${t.companyName}</div>
//       <div class="company-tagline">${t.tagline}</div>
//       <div class="company-address">
//         ${t.address1}<br>${t.address2}
//       </div>
//       <div class="contact-info">📧 ${t.email}</div>
//     </div>
    
//     <!-- INVOICE INFO & BILL TO -->
//     <div class="invoice-header">
//       <div class="invoice-info">
//         <div class="section-title">${t.invoiceDetails}</div>
//         <div class="invoice-number">${t.invoiceNumber}${billNo}</div>
//         <div class="info-row"><strong>${t.date}:</strong> ${dateStr}</div>
//         <div class="info-row"><strong>${t.dueDate}:</strong> ${dueDateStr}</div>
//       </div>
      
//       <div class="bill-to">
//         <div class="section-title">${t.billTo}</div>
//         <div class="info-row"><strong>${customer.name || 'N/A'}</strong></div>
//         <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
//         <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
//       </div>
//     </div>
    
//     <!-- ITEMS TABLE -->
//     <table class="items-table">
//       <thead>
//         <tr>
//           <th style="width: 8%;">${t.sNo}</th>
//           <th style="width: 48%;">${t.itemDescription}</th>
//           <th style="width: 12%;" class="text-center">${t.qty}</th>
//           <th style="width: 16%;" class="text-right">${t.unitPrice}</th>
//           <th style="width: 16%;" class="text-right">${t.amount}</th>
//         </tr>
//       </thead>
//       <tbody>`;

//   // Add items safely
//   if (customer.items && Array.isArray(customer.items) && customer.items.length > 0) {
//     customer.items.forEach((item, index) => {
//       const itemName = item.itemName || 'Unknown Item';
//       const quantity = item.quantity || 0;
//       const price = item.price || 0;
//       const amount = quantity * price;
      
//       html += `<tr>
//         <td class="text-center">${index + 1}</td>
//         <td>${itemName}</td>
//         <td class="text-center">${quantity}</td>
//         <td class="text-right">Rs. ${price.toLocaleString('en-IN')}</td>
//         <td class="text-right">Rs. ${amount.toLocaleString('en-IN')}</td>
//       </tr>`;
//     });
//   } else {
//     html += `<tr><td colspan="5" class="text-center">No items</td></tr>`;
//   }

//   html += `<tr class="empty-row"><td colspan="5"></td></tr>
//         <tr class="empty-row"><td colspan="5"></td></tr>
//         <tr class="empty-row"><td colspan="5"></td></tr>
//       </tbody>
//     </table>
    
//     <!-- TOTALS -->
//     <div class="totals-section">
//       <div class="summary-box">
//         <div class="summary-row">
//           <span class="summary-label">${t.subtotal}:</span>
//           <span>Rs. ${itemsTotal.toLocaleString('en-IN')}</span>
//         </div>`;

//   if (customer.transportCost && customer.transportCost > 0) {
//     html += `<div class="summary-row">
//       <span class="summary-label">${t.transport}:</span>
//       <span>Rs. ${customer.transportCost.toLocaleString('en-IN')}</span>
//     </div>`;
//   }

//   if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
//     html += `<div class="summary-row">
//       <span class="summary-label">${t.maintenance}:</span>
//       <span>Rs. ${customer.maintenanceCharges.toLocaleString('en-IN')}</span>
//     </div>`;
//   }

//   if (customer.extraCharges && customer.extraCharges > 0) {
//     html += `<div class="summary-row">
//       <span class="summary-label">${t.extraCharges}:</span>
//       <span>Rs. ${customer.extraCharges.toLocaleString('en-IN')}</span>
//     </div>`;
//   }

//   html += `<div class="summary-row total">
//         <span class="summary-label">${t.totalDue}:</span>
//         <span>Rs. ${totalAmount.toLocaleString('en-IN')}</span>
//       </div>
//       </div>
//     </div>
    
//     <!-- PAYMENT INFO -->
//     <div class="payment-section">
//       <div class="payment-box">
//         <div class="section-title">${t.paymentInformation}</div>
//         <div class="payment-row">
//           <span class="payment-label">${t.depositReceived}:</span>
//           <span class="payment-value">Rs. ${(customer.depositAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span class="payment-label">${t.amountGiven}:</span>
//           <span class="payment-value">Rs. ${(customer.givenAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//         <div class="payment-row">
//           <span class="payment-label">${t.balanceDue}:</span>
//           <span class="payment-value balance-value">Rs. ${(customer.remainingAmount || 0).toLocaleString('en-IN')}</span>
//         </div>
//       </div>
//     </div>
    
//     <!-- TERMS & CONDITIONS -->
//     <div class="terms-section">
//       <h3>${t.termsConditions}</h3>
//       <ul class="terms-list">
//         <li>${t.term1}</li>
//         <li>${t.term2}</li>
//         <li>${t.term3}</li>
//         <li>${t.term4}</li>
//       </ul>
//     </div>
    
//     <!-- FOOTER WITH SIGNATURES -->
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

//   return html;
// }

// // =====================================================
// // MAIN FUNCTION: Generate Bill
// // =====================================================
// export const generateBill = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { language = 'en' } = req.query;
    
//     console.log('🔵 GENERATE BILL - Starting');
//     console.log(`   Customer ID: ${id}`);
//     console.log(`   Language: ${language}`);

//     // ✅ Validate language parameter
//     if (!['en', 'mr'].includes(language)) {
//       console.error('❌ Invalid language:', language);
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid language. Use: en (English) or mr (Marathi)'
//       });
//     }

//     const t = translations[language];

//     // ✅ Fetch customer from database
//     const customer = await Customer.findById(id).lean();

//     if (!customer) {
//       console.error('❌ Customer not found:', id);
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     console.log(`✅ Customer found: ${customer.name}`);

//     // ✅ Prepare data with safe defaults
//     const billNo = customer._id.toString().slice(-6);
//     const today = new Date();
//     const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
//     const dueDate = new Date();
//     dueDate.setDate(dueDate.getDate() + 7);
//     const dueDateStr = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;

//     // ✅ Calculate totals safely
//     let itemsTotal = 0;
//     if (customer.items && Array.isArray(customer.items)) {
//       itemsTotal = customer.items.reduce((sum, item) => {
//         return sum + ((item.quantity || 0) * (item.price || 0));
//       }, 0);
//     }

//     const totalAmount = itemsTotal + 
//       (customer.transportCost || 0) + 
//       (customer.maintenanceCharges || 0) + 
//       (customer.extraCharges || 0);

//     console.log(`   Bill Amount: Rs. ${totalAmount}`);

//     // ✅ Load logo (non-critical failure)
//     let logoImg = '';
//     const logoPath = path.join(__dirname, '../images/logo.png');
    
//     if (fs.existsSync(logoPath)) {
//       try {
//         const logoData = fs.readFileSync(logoPath);
//         const logoBase64 = logoData.toString('base64');
//         logoImg = `<img src="data:image/png;base64,${logoBase64}" class="logo-img" alt="Logo">`;
//         console.log('✅ Logo loaded successfully');
//       } catch (err) {
//         console.warn('⚠️ Logo loading error:', err.message);
//       }
//     } else {
//       console.warn('⚠️ Logo file not found at:', logoPath);
//     }

//     // ✅ Build HTML content
//     console.log('📝 Building HTML content...');
//     const htmlContent = buildBillHTML(
//       customer, 
//       language, 
//       logoImg, 
//       billNo, 
//       dateStr, 
//       dueDateStr, 
//       itemsTotal, 
//       totalAmount, 
//       translations
//     );

//     console.log(`   HTML size: ${htmlContent.length} bytes`);

//     // ✅ PDF generation options
//     const options = {
//       format: 'A4',
//       margin: '5mm',
//       timeout: 30000,
//       quality: 100,
//       orientation: 'portrait'
//     };

//     console.log('🔄 Converting HTML to PDF...');

//     // ✅ Generate PDF
//     pdf.create(htmlContent, options).toBuffer((err, buffer) => {
//       if (err) {
//         console.error('❌ PDF Generation Error:');
//         console.error('   Message:', err.message);
//         console.error('   Code:', err.code);
        
//         // Log more details for debugging
//         if (err.stack) {
//           console.error('   Stack:', err.stack.substring(0, 500));
//         }

//         return res.status(500).json({
//           success: false,
//           message: 'Error generating PDF',
//           error: err.message,
//           hint: 'Check server logs for detailed error information'
//         });
//       }

//       if (!buffer || buffer.length === 0) {
//         console.error('❌ PDF buffer is empty');
//         return res.status(500).json({
//           success: false,
//           message: 'PDF generation produced empty buffer'
//         });
//       }

//       console.log(`✅ PDF generated successfully (${buffer.length} bytes)`);

//       // ✅ Send PDF to client
//       const fileExtension = language === 'mr' ? '_Marathi' : '_English';
//       const fileName = `Invoice_${customer.name}_${billNo}${fileExtension}.pdf`;

//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Length', buffer.length);
//       res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
//       res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//       res.setHeader('Pragma', 'no-cache');
//       res.setHeader('Expires', '0');

//       console.log(`📥 Sending PDF: ${fileName}`);
//       res.send(buffer);
//     });

//   } catch (error) {
//     console.error('❌ Bill Generation Exception:');
//     console.error('   Message:', error.message);
//     console.error('   Stack:', error.stack);

//     res.status(500).json({
//       success: false,
//       message: 'Error generating bill',
//       error: error.message
//     });
//   }
// };

// import pdf from 'html-pdf';
// import Customer from '../models/Customer.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // =====================================================
// // LANGUAGE TRANSLATIONS
// // =====================================================
// const translations = {
//   en: {
//     invoiceDetails: 'Invoice Details',
//     invoiceNumber: 'Invoice #',
//     date: 'Date',
//     dueDate: 'Due Date',
//     billTo: 'Bill To',
//     phone: 'Phone',
//     address: 'Address',
//     itemDescription: 'Item Description',
//     qty: 'Qty',
//     unitPrice: 'Unit Price',
//     amount: 'Amount',
//     sNo: 'S.No',
//     subtotal: 'Subtotal',
//     transport: 'Transport',
//     maintenance: 'Maintenance',
//     extraCharges: 'Extra Charges',
//     totalDue: 'TOTAL DUE',
//     paymentInformation: 'Payment Information',
//     depositReceived: 'Deposit Received',
//     amountGiven: 'Amount Given',
//     balanceDue: 'Balance Due',
//     termsConditions: 'Terms & Conditions',
//     term1: 'Items must be returned in original condition within agreed timeframe',
//     term2: 'Lost or damaged items will be charged at full replacement cost',
//     term3: 'Payment must be settled within 7 days of invoice date',
//     term4: 'Any disputes must be reported immediately',
//     customerSignature: 'Customer Signature',
//     authorizedSignature: 'Authorized Signature',
//     thankYou: 'Thank you for your business!',
//     generatedOn: 'Generated on',
//     companyName: 'AJAY GADHI BHANDAR',
//     tagline: 'Premium Event Rental Solutions',
//     address1: 'Shipi Galli, Yevla - 423401',
//     address2: 'District Nashik, Maharashtra',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '2651189',
//     phone2: '2658489'
//   },
//   mr: {
//     invoiceDetails: 'बिल तपशील',
//     invoiceNumber: 'बिल क्रमांक #',
//     date: 'तारीख',
//     dueDate: 'देय तारीख',
//     billTo: 'चलन पत्ता',
//     phone: 'फोन',
//     address: 'पता',
//     itemDescription: 'वस्तूचे वर्णन',
//     qty: 'प्रमाण',
//     unitPrice: 'एकक किंमत',
//     amount: 'रक्कम',
//     sNo: 'क्र.',
//     subtotal: 'उप-एकूण',
//     transport: 'वाहतूक',
//     maintenance: 'देखभाल',
//     extraCharges: 'अतिरिक्त शुल्क',
//     totalDue: 'एकूण देय',
//     paymentInformation: 'भुगतान माहिती',
//     depositReceived: 'जमा केलेली रक्कम',
//     amountGiven: 'दिलेली रक्कम',
//     balanceDue: 'शिल्लक देय',
//     termsConditions: 'अटी व शर्ती',
//     term1: 'वस्तू सहमत कालावधीत मूळ स्थितीत परत केल्या पाहिजेत',
//     term2: 'हरवलेल्या किंवा खराब झालेल्या वस्तूंचा पूर्ण प्रतिस्थापन खर्च आकारला जाईल',
//     term3: 'बिलाच्या तारखेपासून 7 दिवसांत भुगतान केले जाणे आवश्यक आहे',
//     term4: 'कोणतेही विवाद तातडीने कळविणे आवश्यक आहे',
//     customerSignature: 'ग्राहकाची स्वाक्षरी',
//     authorizedSignature: 'अधिकृत स्वाक्षरी',
//     thankYou: 'आपल्या व्यवसायाबद्दल धन्यवाद!',
//     generatedOn: 'निर्माण केलेले',
//     companyName: 'अजय घडी भंडार',
//     tagline: 'प्रीमियम इव्हेंट किराया समाधान',
//     address1: 'शिपी गल्ली, येवला - 423401',
//     address2: 'जिल्हा नाशिक, महाराष्ट्र',
//     email: 'info@ajaygadhibhandar.com',
//     phone1: '2651189',
//     phone2: '2658489'
//   }
// };

// // =====================================================
// // MAIN FUNCTION: Generate Bill
// // =====================================================
// export const generateBill = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { language = 'en' } = req.query;
    
//     // ✅ Validate language parameter
//     if (!['en', 'mr'].includes(language)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid language. Use: en (English) or mr (Marathi)'
//       });
//     }

//     const t = translations[language];
//     const customerId = id;

//     console.log(`📄 Generating bill for customer: ${customerId} in ${language.toUpperCase()}`);

//     // Get customer data
//     const customer = await Customer.findById(customerId).lean();

//     if (!customer) {
//       console.error('❌ Customer not found:', customerId);
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

//     console.log(`✅ Customer found: ${customer.name}`);

//     const billNo = customer._id.toString().slice(-6);
//     const today = new Date();
//     const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
//     const dueDate = new Date();
//     dueDate.setDate(dueDate.getDate() + 7);
//     const dueDateStr = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;

//     const itemsTotal = customer.items.reduce((sum, item) => 
//       sum + (item.quantity * item.price), 0
//     );

//     const totalAmount = itemsTotal + 
//       (customer.transportCost || 0) + 
//       (customer.maintenanceCharges || 0) + 
//       (customer.extraCharges || 0);

//     // Load logo if it exists
//     const logoPath = path.join(__dirname, '../images/logo.png');
//     let logoImg = '';

//     if (fs.existsSync(logoPath)) {
//       try {
//         const logoData = fs.readFileSync(logoPath);
//         const logoBase64 = logoData.toString('base64');
//         logoImg = '<img src="data:image/png;base64,' + logoBase64 + '" class="logo-img" alt="Logo">';
//         console.log('✅ Logo loaded successfully');
//       } catch (err) {
//         console.warn('⚠️ Logo loading error:', err.message);
//       }
//     }

//     // Create HTML invoice using string concatenation
//     let htmlContent = '<!DOCTYPE html><html lang="' + language + '"><head><meta charset="UTF-8"><style>';
    
//     htmlContent += `
//       @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
      
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//       }
      
//       body {
//         font-family: ${language === 'mr' ? "'Noto Sans Devanagari', Arial, sans-serif" : "Arial, sans-serif"};
//         background: white;
//         padding: 15px;
//         color: #333;
//       }
      
//       .invoice-container {
//         background: white;
//         padding: 25px;
//         border: 2px solid #8B4513;
//       }
      
//       .header {
//         position: relative;
//         text-align: center;
//         margin-bottom: 20px;
//         border-bottom: 3px solid #8B4513;
//         padding-bottom: 15px;
//       }
      
//       .phone-header {
//         position: absolute;
//         top: 0;
//         right: 0;
//         font-size: 11px;
//         color: #8B4513;
//         font-weight: bold;
//         line-height: 1.3;
//       }
      
//       .logo-section {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         gap: 15px;
//         margin-bottom: 10px;
//       }
      
//       .logo-img {
//         width: 25rem;
//         height: 12rem;
//         object-fit: contain;
//       }
      
//       .company-name {
//         font-size: 26px;
//         font-weight: bold;
//         color: #8B4513;
//         margin-bottom: 5px;
//         letter-spacing: ${language === 'mr' ? '0.3px' : '0px'};
//         word-spacing: ${language === 'mr' ? '0.15em' : 'normal'};
//       }
      
//       .company-tagline {
//         font-size: 12px;
//         color: #666;
//         margin-bottom: 5px;
//       }
      
//       .company-address {
//         font-size: 11px;
//         color: #666;
//         line-height: 1.4;
//       }
      
//       .contact-info {
//         font-size: 10px;
//         color: #666;
//         margin-top: 8px;
//       }
      
//       .invoice-header {
//         display: flex;
//         justify-content: space-between;
//         margin-bottom: 25px;
//         gap: 15px;
//       }
      
//       .invoice-info, .bill-to {
//         flex: 1;
//         padding: 12px;
//         background: #f5f5f5;
//         border: 1px solid #ddd;
//       }
      
//       .section-title {
//         color: #8B4513;
//         font-size: 11px;
//         font-weight: bold;
//         margin-bottom: 8px;
//         text-transform: uppercase;
//         border-bottom: 2px solid #8B4513;
//         padding-bottom: 5px;
//       }
      
//       .invoice-number {
//         font-size: 16px;
//         color: #DC143C;
//         font-weight: bold;
//         margin: 8px 0;
//       }
      
//       .info-row {
//         font-size: 10px;
//         margin: 4px 0;
//         color: #555;
//       }
      
//       .items-table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-bottom: 20px;
//       }
      
//       .items-table thead {
//         background: #8B4513;
//         color: white;
//       }
      
//       .items-table th {
//         padding: 10px;
//         text-align: left;
//         font-size: 10px;
//         font-weight: bold;
//         border: 1px solid #8B4513;
//       }
      
//       .items-table td {
//         padding: 10px;
//         font-size: 10px;
//         border: 1px solid #ddd;
//       }
      
//       .items-table tbody tr:nth-child(odd) {
//         background: #f9f9f9;
//       }
      
//       .text-right {
//         text-align: right;
//       }
      
//       .text-center {
//         text-align: center;
//       }
      
//       .totals-section {
//         margin-bottom: 20px;
//         display: flex;
//         justify-content: flex-end;
//       }
      
//       .summary-box {
//         width: 280px;
//         padding: 12px;
//         background: #f5f5f5;
//         border: 1px solid #ddd;
//       }
      
//       .summary-row {
//         display: flex;
//         justify-content: space-between;
//         margin-bottom: 8px;
//         font-size: 10px;
//       }
      
//       .summary-row.total {
//         background: #8B4513;
//         color: white;
//         padding: 10px;
//         margin: 8px -12px -12px -12px;
//         font-weight: bold;
//         font-size: 11px;
//       }
      
//       .summary-label {
//         color: #666;
//         font-weight: 500;
//       }
      
//       .summary-row.total .summary-label {
//         color: white;
//       }
      
//       .payment-section {
//         display: flex;
//         gap: 15px;
//         margin-bottom: 20px;
//       }
      
//       .payment-box {
//         flex: 1;
//         padding: 12px;
//         background: #f5f5f5;
//         border: 1px solid #ddd;
//       }
      
//       .payment-row {
//         display: flex;
//         justify-content: space-between;
//         font-size: 10px;
//         margin: 6px 0;
//       }
      
//       .payment-label {
//         color: #666;
//         font-weight: 500;
//       }
      
//       .payment-value {
//         font-weight: bold;
//         color: #333;
//       }
      
//       .balance-value {
//         color: #DC143C;
//       }
      
//       .terms-section {
//         background: #f5f5f5;
//         padding: 12px;
//         border: 1px solid #ddd;
//         margin-bottom: 20px;
//       }
      
//       .terms-section h3 {
//         color: #8B4513;
//         font-size: 10px;
//         font-weight: bold;
//         margin-bottom: 8px;
//         text-transform: uppercase;
//         border-bottom: 2px solid #8B4513;
//         padding-bottom: 5px;
//       }
      
//       .terms-list {
//         font-size: 9px;
//         color: #555;
//         line-height: 1.5;
//       }
      
//       .terms-list li {
//         margin-bottom: 4px;
//         margin-left: 15px;
//       }
      
//       .footer {
//         display: flex;
//         justify-content: space-between;
//         margin-top: 30px;
//         padding-top: 20px;
//         border-top: 1px solid #ddd;
//       }
      
//       .signature-box {
//         width: 180px;
//         text-align: center;
//         font-size: 9px;
//       }
      
//       .signature-line {
//         border-top: 1px solid #000;
//         margin-bottom: 5px;
//         height: 25px;
//       }
      
//       .footer-text {
//         text-align: center;
//         font-size: 9px;
//         color: #999;
//         margin-top: 20px;
//         padding-top: 10px;
//         border-top: 1px solid #ddd;
//       }
      
//       .empty-row {
//         height: 20px;
//       }
//     </style></head><body>`;

//     htmlContent += '<div class="invoice-container">';
    
//     // Header with logo
//     htmlContent += '<div class="header"><div class="phone-header">📞 ' + t.phone1 + '<br>' + t.phone2 + '</div><div class="logo-section">' + logoImg + '</div>';
//     htmlContent += '<div class="company-name">' + t.companyName + '</div>';
//     htmlContent += '<div class="company-tagline">' + t.tagline + '</div>';
//     htmlContent += '<div class="company-address">' + t.address1 + '<br>' + t.address2 + '</div>';
//     htmlContent += '<div class="contact-info">📧 ' + t.email + '</div></div>';
    
//     // Invoice Info
//     htmlContent += '<div class="invoice-header"><div class="invoice-info"><div class="section-title">' + t.invoiceDetails + '</div><div class="invoice-number">' + t.invoiceNumber + billNo + '</div>';
//     htmlContent += '<div class="info-row"><strong>' + t.date + ':</strong> ' + dateStr + '</div><div class="info-row"><strong>' + t.dueDate + ':</strong> ' + dueDateStr + '</div></div>';
    
//     htmlContent += '<div class="bill-to"><div class="section-title">' + t.billTo + '</div><div class="info-row"><strong>' + customer.name + '</strong></div>';
//     htmlContent += '<div class="info-row"><strong>' + t.phone + ':</strong> ' + customer.phone + '</div><div class="info-row"><strong>' + t.address + ':</strong> ' + (customer.address || '-') + '</div></div></div>';
    
//     // Items Table
//     htmlContent += '<table class="items-table"><thead><tr><th style="width: 8%;">' + t.sNo + '</th><th style="width: 48%;">' + t.itemDescription + '</th><th style="width: 12%;" class="text-center">' + t.qty + '</th><th style="width: 16%;" class="text-right">' + t.unitPrice + '</th><th style="width: 16%;" class="text-right">' + t.amount + '</th></tr></thead><tbody>';
    
//     customer.items.forEach((item, index) => {
//       const amount = (item.quantity || 0) * (item.price || 0);
//       htmlContent += '<tr><td class="text-center">' + (index + 1) + '</td><td>' + (item.itemName || '') + '</td><td class="text-center">' + (item.quantity || 0) + '</td><td class="text-right">Rs. ' + (item.price || 0) + '</td><td class="text-right">Rs. ' + amount.toLocaleString('en-IN') + '</td></tr>';
//     });
    
//     htmlContent += '<tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr></tbody></table>';
    
//     // Totals
//     htmlContent += '<div class="totals-section"><div class="summary-box"><div class="summary-row"><span class="summary-label">' + t.subtotal + ':</span><span>Rs. ' + itemsTotal.toLocaleString('en-IN') + '</span></div>';
    
//     if (customer.transportCost && customer.transportCost > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">' + t.transport + ':</span><span>Rs. ' + customer.transportCost.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">' + t.maintenance + ':</span><span>Rs. ' + customer.maintenanceCharges.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     if (customer.extraCharges && customer.extraCharges > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">' + t.extraCharges + ':</span><span>Rs. ' + customer.extraCharges.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     htmlContent += '<div class="summary-row total"><span class="summary-label">' + t.totalDue + ':</span><span>Rs. ' + totalAmount.toLocaleString('en-IN') + '</span></div></div></div>';
    
//     // Payment Details
//     htmlContent += '<div class="payment-section"><div class="payment-box"><div class="section-title">' + t.paymentInformation + '</div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">' + t.depositReceived + ':</span><span class="payment-value">Rs. ' + (customer.depositAmount || 0).toLocaleString('en-IN') + '</span></div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">' + t.amountGiven + ':</span><span class="payment-value">Rs. ' + (customer.givenAmount || 0).toLocaleString('en-IN') + '</span></div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">' + t.balanceDue + ':</span><span class="payment-value balance-value">Rs. ' + (customer.remainingAmount || 0).toLocaleString('en-IN') + '</span></div></div></div>';
    
//     // Terms
//     htmlContent += '<div class="terms-section"><h3>' + t.termsConditions + '</h3><ul class="terms-list"><li>' + t.term1 + '</li><li>' + t.term2 + '</li><li>' + t.term3 + '</li><li>' + t.term4 + '</li></ul></div>';
    
//     // Footer
//     htmlContent += '<div class="footer"><div class="signature-box"><div class="signature-line"></div><div>' + t.customerSignature + '</div></div><div class="signature-box"><div class="signature-line"></div><div>' + t.authorizedSignature + '</div></div></div>';
//     htmlContent += '<div class="footer-text">' + t.thankYou + ' 🙏<br>' + t.generatedOn + ': ' + new Date().toLocaleString('en-IN') + '</div>';
    
//     htmlContent += '</div></body></html>';

//     // Convert HTML to PDF
//     const options = {
//       format: 'A4',
//       margin: '0px',
//       timeout: 30000
//     };

//     pdf.create(htmlContent, options).toBuffer((err, buffer) => {
//       if (err) {
//         console.error('❌ PDF generation error:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Error generating PDF',
//           error: err.message
//         });
//       }

//       const fileExtension = language === 'mr' ? '_Marathi' : '_English';
//       const fileName = `Invoice_${customer.name}_${billNo}${fileExtension}.pdf`;
      
//       console.log(`✅ PDF generated successfully: ${fileName}`);

//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//       res.send(buffer);
//     });

//   } catch (error) {
//     console.error('❌ Bill generation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating bill',
//       error: error.message
//     });
//   }
// };


import puppeteer from 'puppeteer';
import Customer from '../models/Customer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translations = {
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

export const generateBill = async (req, res) => {
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
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;

    const itemsTotal = (customer.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalAmount = itemsTotal + (customer.transportCost || 0) + (customer.maintenanceCharges || 0) + (customer.extraCharges || 0);

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
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="phone-header">📞 ${t.phone1}<br>${t.phone2}</div>
      <div class="logo-section">${logoImg}</div>
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
        <div class="info-row"><strong>${customer.name || 'N/A'}</strong></div>
        <div class="info-row"><strong>${t.phone}:</strong> ${customer.phone || 'N/A'}</div>
        <div class="info-row"><strong>${t.address}:</strong> ${customer.address || 'N/A'}</div>
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
        ${(customer.items || []).map((item, index) => {
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
        ${customer.transportCost && customer.transportCost > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.transport}:</span>
          <span>Rs. ${customer.transportCost.toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${customer.maintenanceCharges && customer.maintenanceCharges > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.maintenance}:</span>
          <span>Rs. ${customer.maintenanceCharges.toLocaleString('en-IN')}</span>
        </div>` : ''}
        ${customer.extraCharges && customer.extraCharges > 0 ? `<div class="summary-row">
          <span class="summary-label">${t.extraCharges}:</span>
          <span>Rs. ${customer.extraCharges.toLocaleString('en-IN')}</span>
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

    console.log('📄 Starting PDF generation...');

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
      console.error('❌ PDF buffer is empty');
      return res.status(500).json({ success: false, message: 'PDF generation failed' });
    }

    console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);

    const fileName = `Invoice_${customer.name}_${billNo}_${language.toUpperCase()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (browser) await browser.close();
    res.status(500).json({ success: false, message: 'Error generating bill', error: error.message });
  }
};