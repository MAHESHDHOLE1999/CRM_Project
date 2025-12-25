// import pdf from 'html-pdf';
// import Customer from '../models/Customer.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const generateBill = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customerId = id;

//     // Get customer data
//     const customer = await Customer.findById(customerId).lean();

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: 'Customer not found'
//       });
//     }

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
//       } catch (err) {
//         console.warn('Logo loading error:', err.message);
//       }
//     }

//     // Create HTML invoice using string concatenation
//     let htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
    
//     htmlContent += `
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//       }
      
//       body {
//         font-family: Arial, sans-serif;
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
//         text-align: center;
//         margin-bottom: 20px;
//         border-bottom: 3px solid #8B4513;
//         padding-bottom: 15px;
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
//     htmlContent += '<div class="header"><div class="logo-section">' + logoImg + '<div><div class="company-name">AJAY GADHI BHANDAR</div><div class="company-tagline">Premium Event Rental Solutions</div></div></div>';
//     htmlContent += '<div class="company-address">Shipi Galli, Yevla - 423401<br>District Nashik, Maharashtra</div>';
//     htmlContent += '<div class="contact-info">📞 2651189 / 2658489 | 📧 info@ajaygadhibhandar.com</div></div>';
    
//     // Invoice Info
//     htmlContent += '<div class="invoice-header"><div class="invoice-info"><div class="section-title">Invoice Details</div><div class="invoice-number">Invoice #' + billNo + '</div>';
//     htmlContent += '<div class="info-row"><strong>Date:</strong> ' + dateStr + '</div><div class="info-row"><strong>Due Date:</strong> ' + dueDateStr + '</div></div>';
    
//     htmlContent += '<div class="bill-to"><div class="section-title">Bill To</div><div class="info-row"><strong>' + customer.name + '</strong></div>';
//     htmlContent += '<div class="info-row"><strong>Phone:</strong> ' + customer.phone + '</div><div class="info-row"><strong>Address:</strong> ' + (customer.address || '-') + '</div></div></div>';
    
//     // Items Table
//     htmlContent += '<table class="items-table"><thead><tr><th style="width: 8%;">S.No</th><th style="width: 48%;">Item Description</th><th style="width: 12%;" class="text-center">Qty</th><th style="width: 16%;" class="text-right">Unit Price</th><th style="width: 16%;" class="text-right">Amount</th></tr></thead><tbody>';
    
//     customer.items.forEach((item, index) => {
//       const amount = (item.quantity || 0) * (item.price || 0);
//       htmlContent += '<tr><td class="text-center">' + (index + 1) + '</td><td>' + (item.itemName || '') + '</td><td class="text-center">' + (item.quantity || 0) + '</td><td class="text-right">Rs. ' + (item.price || 0) + '</td><td class="text-right">Rs. ' + amount.toLocaleString('en-IN') + '</td></tr>';
//     });
    
//     htmlContent += '<tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr></tbody></table>';
    
//     // Totals
//     htmlContent += '<div class="totals-section"><div class="summary-box"><div class="summary-row"><span class="summary-label">Subtotal:</span><span>Rs. ' + itemsTotal.toLocaleString('en-IN') + '</span></div>';
    
//     if (customer.transportCost && customer.transportCost > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">Transport:</span><span>Rs. ' + customer.transportCost.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">Maintenance:</span><span>Rs. ' + customer.maintenanceCharges.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     if (customer.extraCharges && customer.extraCharges > 0) {
//       htmlContent += '<div class="summary-row"><span class="summary-label">Extra Charges:</span><span>Rs. ' + customer.extraCharges.toLocaleString('en-IN') + '</span></div>';
//     }
    
//     htmlContent += '<div class="summary-row total"><span class="summary-label">TOTAL DUE:</span><span>Rs. ' + totalAmount.toLocaleString('en-IN') + '</span></div></div></div>';
    
//     // Payment Details
//     htmlContent += '<div class="payment-section"><div class="payment-box"><div class="section-title">Payment Information</div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">Deposit Received:</span><span class="payment-value">Rs. ' + (customer.depositAmount || 0).toLocaleString('en-IN') + '</span></div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">Amount Given:</span><span class="payment-value">Rs. ' + (customer.givenAmount || 0).toLocaleString('en-IN') + '</span></div>';
//     htmlContent += '<div class="payment-row"><span class="payment-label">Balance Due:</span><span class="payment-value balance-value">Rs. ' + (customer.remainingAmount || 0).toLocaleString('en-IN') + '</span></div></div></div>';
    
//     // Terms
//     htmlContent += '<div class="terms-section"><h3>Terms & Conditions</h3><ul class="terms-list"><li>Items must be returned in original condition within agreed timeframe</li><li>Lost or damaged items will be charged at full replacement cost</li><li>Payment must be settled within 7 days of invoice date</li><li>Any disputes must be reported immediately</li></ul></div>';
    
//     // Footer
//     htmlContent += '<div class="footer"><div class="signature-box"><div class="signature-line"></div><div>Customer Signature</div></div><div class="signature-box"><div class="signature-line"></div><div>Authorized Signature</div></div></div>';
//     htmlContent += '<div class="footer-text">Thank you for your business! 🙏<br>Generated on: ' + new Date().toLocaleString('en-IN') + '</div>';
    
//     htmlContent += '</div></body></html>';

//     // Convert HTML to PDF
//     const options = {
//       format: 'A4',
//       margin: '0px',
//       timeout: 30000
//     };

//     pdf.create(htmlContent, options).toBuffer((err, buffer) => {
//       if (err) {
//         console.error('PDF generation error:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Error generating PDF',
//           error: err.message
//         });
//       }

//       const fileName = `Invoice_${customer.name}_${billNo}.pdf`;
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//       res.send(buffer);
//     });

//   } catch (error) {
//     console.error('Bill generation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating bill',
//       error: error.message
//     });
//   }
// };

import pdf from 'html-pdf';
import Customer from '../models/Customer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = id;

    // Get customer data
    const customer = await Customer.findById(customerId).lean();

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

    const itemsTotal = customer.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );

    const totalAmount = itemsTotal + 
      (customer.transportCost || 0) + 
      (customer.maintenanceCharges || 0) + 
      (customer.extraCharges || 0);

    // Load logo if it exists
    const logoPath = path.join(__dirname, '../images/logo.png');
    let logoImg = '';

    if (fs.existsSync(logoPath)) {
      try {
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = logoData.toString('base64');
        logoImg = '<img src="data:image/png;base64,' + logoBase64 + '" class="logo-img" alt="Logo">';
      } catch (err) {
        console.warn('Logo loading error:', err.message);
      }
    }

    // Create HTML invoice using string concatenation
    let htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>';
    
    htmlContent += `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: Arial, sans-serif;
        background: white;
        padding: 15px;
        color: #333;
      }
      
      .invoice-container {
        background: white;
        padding: 25px;
        border: 2px solid #8B4513;
      }
      
      .header {
        position: relative;
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 3px solid #8B4513;
        padding-bottom: 15px;
      }
      
      .phone-header {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 11px;
        color: #8B4513;
        font-weight: bold;
        line-height: 1.3;
      }
      
      .logo-section {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }
      
      .logo-img {
        width: 25rem;
        height: 12rem;
        object-fit: contain;
      }
      
      .company-name {
        font-size: 26px;
        font-weight: bold;
        color: #8B4513;
        margin-bottom: 5px;
      }
      
      .company-tagline {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .company-address {
        font-size: 11px;
        color: #666;
        line-height: 1.4;
      }
      
      .contact-info {
        font-size: 10px;
        color: #666;
        margin-top: 8px;
      }
      
      .invoice-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        gap: 15px;
      }
      
      .invoice-info, .bill-to {
        flex: 1;
        padding: 12px;
        background: #f5f5f5;
        border: 1px solid #ddd;
      }
      
      .section-title {
        color: #8B4513;
        font-size: 11px;
        font-weight: bold;
        margin-bottom: 8px;
        text-transform: uppercase;
        border-bottom: 2px solid #8B4513;
        padding-bottom: 5px;
      }
      
      .invoice-number {
        font-size: 16px;
        color: #DC143C;
        font-weight: bold;
        margin: 8px 0;
      }
      
      .info-row {
        font-size: 10px;
        margin: 4px 0;
        color: #555;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .items-table thead {
        background: #8B4513;
        color: white;
      }
      
      .items-table th {
        padding: 10px;
        text-align: left;
        font-size: 10px;
        font-weight: bold;
        border: 1px solid #8B4513;
      }
      
      .items-table td {
        padding: 10px;
        font-size: 10px;
        border: 1px solid #ddd;
      }
      
      .items-table tbody tr:nth-child(odd) {
        background: #f9f9f9;
      }
      
      .text-right {
        text-align: right;
      }
      
      .text-center {
        text-align: center;
      }
      
      .totals-section {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
      }
      
      .summary-box {
        width: 280px;
        padding: 12px;
        background: #f5f5f5;
        border: 1px solid #ddd;
      }
      
      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 10px;
      }
      
      .summary-row.total {
        background: #8B4513;
        color: white;
        padding: 10px;
        margin: 8px -12px -12px -12px;
        font-weight: bold;
        font-size: 11px;
      }
      
      .summary-label {
        color: #666;
        font-weight: 500;
      }
      
      .summary-row.total .summary-label {
        color: white;
      }
      
      .payment-section {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .payment-box {
        flex: 1;
        padding: 12px;
        background: #f5f5f5;
        border: 1px solid #ddd;
      }
      
      .payment-row {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        margin: 6px 0;
      }
      
      .payment-label {
        color: #666;
        font-weight: 500;
      }
      
      .payment-value {
        font-weight: bold;
        color: #333;
      }
      
      .balance-value {
        color: #DC143C;
      }
      
      .terms-section {
        background: #f5f5f5;
        padding: 12px;
        border: 1px solid #ddd;
        margin-bottom: 20px;
      }
      
      .terms-section h3 {
        color: #8B4513;
        font-size: 10px;
        font-weight: bold;
        margin-bottom: 8px;
        text-transform: uppercase;
        border-bottom: 2px solid #8B4513;
        padding-bottom: 5px;
      }
      
      .terms-list {
        font-size: 9px;
        color: #555;
        line-height: 1.5;
      }
      
      .terms-list li {
        margin-bottom: 4px;
        margin-left: 15px;
      }
      
      .footer {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      
      .signature-box {
        width: 180px;
        text-align: center;
        font-size: 9px;
      }
      
      .signature-line {
        border-top: 1px solid #000;
        margin-bottom: 5px;
        height: 25px;
      }
      
      .footer-text {
        text-align: center;
        font-size: 9px;
        color: #999;
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #ddd;
      }
      
      .empty-row {
        height: 20px;
      }
    </style></head><body>`;

    htmlContent += '<div class="invoice-container">';
    
    // Header with logo
    // htmlContent += '<div class="header"><div class="phone-header">📞 2651189<br>2658489</div><div class="logo-section">' + logoImg + '<div><div class="company-name">AJAY GADHI BHANDAR</div><div class="company-tagline">Premium Event Rental Solutions</div></div></div>';
    htmlContent += '<div class="header"><div class="phone-header">📞 2651189<br>2658489</div><div class="logo-section">' + logoImg + '</div>';
    htmlContent += '<div class="company-address">Shipi Galli, Yevla - 423401<br>District Nashik, Maharashtra</div>';
    htmlContent += '<div class="contact-info">📧 info@ajaygadhibhandar.com</div></div>';
    
    // Invoice Info
    htmlContent += '<div class="invoice-header"><div class="invoice-info"><div class="section-title">Invoice Details</div><div class="invoice-number">Invoice #' + billNo + '</div>';
    htmlContent += '<div class="info-row"><strong>Date:</strong> ' + dateStr + '</div><div class="info-row"><strong>Due Date:</strong> ' + dueDateStr + '</div></div>';
    
    htmlContent += '<div class="bill-to"><div class="section-title">Bill To</div><div class="info-row"><strong>' + customer.name + '</strong></div>';
    htmlContent += '<div class="info-row"><strong>Phone:</strong> ' + customer.phone + '</div><div class="info-row"><strong>Address:</strong> ' + (customer.address || '-') + '</div></div></div>';
    
    // Items Table
    htmlContent += '<table class="items-table"><thead><tr><th style="width: 8%;">S.No</th><th style="width: 48%;">Item Description</th><th style="width: 12%;" class="text-center">Qty</th><th style="width: 16%;" class="text-right">Unit Price</th><th style="width: 16%;" class="text-right">Amount</th></tr></thead><tbody>';
    
    customer.items.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.price || 0);
      htmlContent += '<tr><td class="text-center">' + (index + 1) + '</td><td>' + (item.itemName || '') + '</td><td class="text-center">' + (item.quantity || 0) + '</td><td class="text-right">Rs. ' + (item.price || 0) + '</td><td class="text-right">Rs. ' + amount.toLocaleString('en-IN') + '</td></tr>';
    });
    
    htmlContent += '<tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr><tr class="empty-row"><td colspan="5"></td></tr></tbody></table>';
    
    // Totals
    htmlContent += '<div class="totals-section"><div class="summary-box"><div class="summary-row"><span class="summary-label">Subtotal:</span><span>Rs. ' + itemsTotal.toLocaleString('en-IN') + '</span></div>';
    
    if (customer.transportCost && customer.transportCost > 0) {
      htmlContent += '<div class="summary-row"><span class="summary-label">Transport:</span><span>Rs. ' + customer.transportCost.toLocaleString('en-IN') + '</span></div>';
    }
    
    if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
      htmlContent += '<div class="summary-row"><span class="summary-label">Maintenance:</span><span>Rs. ' + customer.maintenanceCharges.toLocaleString('en-IN') + '</span></div>';
    }
    
    if (customer.extraCharges && customer.extraCharges > 0) {
      htmlContent += '<div class="summary-row"><span class="summary-label">Extra Charges:</span><span>Rs. ' + customer.extraCharges.toLocaleString('en-IN') + '</span></div>';
    }
    
    htmlContent += '<div class="summary-row total"><span class="summary-label">TOTAL DUE:</span><span>Rs. ' + totalAmount.toLocaleString('en-IN') + '</span></div></div></div>';
    
    // Payment Details
    htmlContent += '<div class="payment-section"><div class="payment-box"><div class="section-title">Payment Information</div>';
    htmlContent += '<div class="payment-row"><span class="payment-label">Deposit Received:</span><span class="payment-value">Rs. ' + (customer.depositAmount || 0).toLocaleString('en-IN') + '</span></div>';
    htmlContent += '<div class="payment-row"><span class="payment-label">Amount Given:</span><span class="payment-value">Rs. ' + (customer.givenAmount || 0).toLocaleString('en-IN') + '</span></div>';
    htmlContent += '<div class="payment-row"><span class="payment-label">Balance Due:</span><span class="payment-value balance-value">Rs. ' + (customer.remainingAmount || 0).toLocaleString('en-IN') + '</span></div></div></div>';
    
    // Terms
    htmlContent += '<div class="terms-section"><h3>Terms & Conditions</h3><ul class="terms-list"><li>Items must be returned in original condition within agreed timeframe</li><li>Lost or damaged items will be charged at full replacement cost</li><li>Payment must be settled within 7 days of invoice date</li><li>Any disputes must be reported immediately</li></ul></div>';
    
    // Footer
    htmlContent += '<div class="footer"><div class="signature-box"><div class="signature-line"></div><div>Customer Signature</div></div><div class="signature-box"><div class="signature-line"></div><div>Authorized Signature</div></div></div>';
    htmlContent += '<div class="footer-text">Thank you for your business! 🙏<br>Generated on: ' + new Date().toLocaleString('en-IN') + '</div>';
    
    htmlContent += '</div></body></html>';

    // Convert HTML to PDF
    const options = {
      format: 'A4',
      margin: '0px',
      timeout: 30000
    };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error('PDF generation error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error generating PDF',
          error: err.message
        });
      }

      const fileName = `Invoice_${customer.name}_${billNo}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    });

  } catch (error) {
    console.error('Bill generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bill',
      error: error.message
    });
  }
};