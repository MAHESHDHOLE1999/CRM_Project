// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import Customer from '../models/Customer.js';

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

//     // Create PDF
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     // Page settings
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const margin = 15;

//     // Set font
//     doc.setFont('Arial', 'normal');

//     // ==========================================
//     // HEADER SECTION
//     // ==========================================

//     // Business name in Marathi (large, bold)
//     doc.setFont('Arial', 'bold');
//     doc.setFontSize(20);
//     doc.text('अजय गाढी भांडार', pageWidth / 2, 25, { align: 'center' });

//     // Phone numbers
//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(10);
//     doc.text('📞 2651189 / 2658489', pageWidth / 2, 32, { align: 'center' });

//     // Address
//     doc.setFontSize(9);
//     doc.text('शिपी गल्ली, येवला - 423401 (जि. नाशिक)', pageWidth / 2, 36, { align: 'center' });

//     // Description
//     doc.setFontSize(8);
//     const desc = 'आमचे येथे शुभकार्यासाठी गाढी, उषी, लोड, सोलापूर चादर, हलक्कट, दुल्हई, सत्रजी, शाही गाळीचा व छत्री,जनेटट, तांडपच्या, घोडेसाज, जेवणपाटी इत्यादी सामान भाड्याने मिळेल।';
//     const descY = doc.splitTextToSize(desc, pageWidth - 30);
//     doc.text(descY, margin, 42);

//     // ==========================================
//     // BILL DETAILS SECTION
//     // ==========================================

//     let yPosition = 60;

//     // Bill number and date
//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(10);

//     const billNo = customer._id.toString().slice(-6);
//     doc.text(`बिल क्रमांक / क्रमांक: ${billNo}`, margin, yPosition);

//     const today = new Date();
//     const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
//     doc.text(`दिनांक: ${dateStr}`, pageWidth / 2 + 30, yPosition);

//     yPosition += 8;

//     // Customer name
//     doc.setFont('Arial', 'bold');
//     doc.setFontSize(11);
//     doc.text(`ग्राहकाचे नाव: ${customer.name}`, margin, yPosition);

//     yPosition += 6;

//     // Customer details
//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(9);
//     doc.text(`फोन नंबर: ${customer.phone}`, margin, yPosition);

//     yPosition += 5;

//     doc.text(`पत्ता: ${customer.address || '-'}`, margin, yPosition);

//     yPosition += 5;

//     doc.text(`फिटर: ${customer.fitterName || '-'}`, margin, yPosition);

//     yPosition += 8;

//     // ==========================================
//     // ITEMS TABLE
//     // ==========================================

//     const tableData = customer.items.map((item, index) => [
//       index + 1,
//       item.itemName || '',
//       item.quantity || 0,
//       `₹${item.price || 0}`,
//       item.quantity ? `₹${(item.quantity * item.price).toLocaleString('en-IN')}` : '₹0'
//     ]);

//     doc.autoTable({
//       startY: yPosition,
//       head: [['क्र.', 'गाढीचे नाव', 'नग', 'दर नगास', 'रक्कम']],
//       body: tableData,
//       headStyles: {
//         fillColor: [139, 69, 19],
//         textColor: 255,
//         fontStyle: 'bold',
//         fontSize: 9,
//         halign: 'center',
//         valign: 'middle'
//       },
//       bodyStyles: {
//         fontSize: 9,
//         halign: 'center',
//         valign: 'middle'
//       },
//       columnStyles: {
//         0: { cellWidth: 15, halign: 'center' },
//         1: { cellWidth: 70, halign: 'left' },
//         2: { cellWidth: 20, halign: 'center' },
//         3: { cellWidth: 30, halign: 'right' },
//         4: { cellWidth: 35, halign: 'right' }
//       },
//       margin: { left: margin, right: margin },
//       didDrawPage: function(data) {
//         // Footer
//         const pageCount = doc.internal.pages.length - 1;
//         const pageSize = doc.internal.pageSize;
//         const pageHeight = pageSize.getHeight();
//         const pageWidth = pageSize.getWidth();
//         doc.setFontSize(10);
//         doc.text(
//           'Page ' + data.pageNumber + ' of ' + pageCount,
//           pageWidth / 2,
//           pageHeight - 10,
//           { align: 'center' }
//         );
//       }
//     });

//     yPosition = doc.lastAutoTable.finalY + 10;

//     // ==========================================
//     // CHARGES SECTION
//     // ==========================================

//     doc.setFont('Arial', 'bold');
//     doc.setFontSize(10);

//     const itemsTotal = customer.items.reduce((sum, item) => 
//       sum + (item.quantity * item.price), 0
//     );

//     // Items total
//     doc.text('गाढीची एकूण रक्कम:', pageWidth / 2 + 50, yPosition);
//     doc.text(`₹${itemsTotal.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });

//     yPosition += 6;

//     // Transport charges
//     if (customer.transportCost && customer.transportCost > 0) {
//       doc.text('वाहतूक खर्च:', pageWidth / 2 + 50, yPosition);
//       doc.text(`₹${customer.transportCost.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
//       yPosition += 6;
//     }

//     // Maintenance charges
//     if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
//       doc.text('देखभाल शुल्क:', pageWidth / 2 + 50, yPosition);
//       doc.text(`₹${customer.maintenanceCharges.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
//       yPosition += 6;
//     }

//     // Extra charges
//     if (customer.extraCharges && customer.extraCharges > 0) {
//       doc.text('अतिरिक्त खर्च:', pageWidth / 2 + 50, yPosition);
//       doc.text(`₹${customer.extraCharges.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
//       yPosition += 6;
//     }

//     // Separator line
//     doc.setDrawColor(139, 69, 19);
//     doc.line(pageWidth / 2 + 45, yPosition, pageWidth - margin, yPosition);

//     yPosition += 3;

//     // Total Amount (Grand Total)
//     doc.setFont('Arial', 'bold');
//     doc.setFontSize(11);
//     doc.text('एकूण रक्कम:', pageWidth / 2 + 50, yPosition);
//     doc.text(`₹${customer.totalAmount.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });

//     yPosition += 8;

//     // ==========================================
//     // PAYMENT DETAILS SECTION
//     // ==========================================

//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(9);

//     // Deposit
//     doc.text('जमा रक्कम:', margin, yPosition);
//     doc.text(`₹${(customer.depositAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);

//     yPosition += 5;

//     // Given amount
//     doc.setFont('Arial', 'bold');
//     doc.text('दिलेली रक्कम:', margin, yPosition);
//     doc.text(`₹${(customer.givenAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);

//     yPosition += 5;

//     // Remaining amount
//     doc.setFont('Arial', 'normal');
//     doc.text('बाकी रक्कम:', margin, yPosition);
//     doc.setTextColor(220, 20, 60);
//     doc.text(`₹${(customer.remainingAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);
//     doc.setTextColor(0, 0, 0);

//     yPosition += 8;

//     // ==========================================
//     // CHECKLIST TABLE
//     // ==========================================

//     const checklistHeaders = ['सामानाचे नाव', 'नग', 'बर नगास\nमेसे', 'कोठून कोठपर्यंत\nतारीख', 'दिवस', 'रक्कम\nमेसे'];

//     doc.autoTable({
//       startY: yPosition,
//       head: [checklistHeaders],
//       body: Array(5).fill(['', '', '', '', '', '']),
//       headStyles: {
//         fillColor: [139, 69, 19],
//         textColor: 255,
//         fontStyle: 'bold',
//         fontSize: 8,
//         halign: 'center',
//         valign: 'middle'
//       },
//       bodyStyles: {
//         fontSize: 8,
//         minCellHeight: 15
//       },
//       columnStyles: {
//         0: { cellWidth: 50 },
//         1: { cellWidth: 15, halign: 'center' },
//         2: { cellWidth: 25, halign: 'center' },
//         3: { cellWidth: 35, halign: 'center' },
//         4: { cellWidth: 15, halign: 'center' },
//         5: { cellWidth: 25, halign: 'right' }
//       },
//       margin: { left: margin, right: margin }
//     });

//     // ==========================================
//     // FOOTER NOTES
//     // ==========================================

//     yPosition = doc.lastAutoTable.finalY + 10;

//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(8);
//     doc.text('नोट्स:', margin, yPosition);

//     yPosition += 4;

//     doc.setFontSize(7);
//     const notes = [
//       '1. गाढी हरवल्यास किंवा नुकसान झाल्यास संपूर्ण बदली रक्कम देय असेल।',
//       '2. बिल मिळाल्यानंतर 7 दिवसांत रक्कम फेडणे अनिवार्य आहे।',
//       '3. कोणतेही वाद असल्यास तत्काळ संपर्क साधा.'
//     ];

//     notes.forEach((note, index) => {
//       const wrappedText = doc.splitTextToSize(note, pageWidth - 30);
//       doc.text(wrappedText, margin, yPosition);
//       yPosition += 3;
//     });

//     // ==========================================
//     // SIGNATURE SECTION
//     // ==========================================

//     yPosition = pageHeight - 30;

//     doc.setFont('Arial', 'normal');
//     doc.setFontSize(9);

//     // Customer signature
//     doc.text('ग्राहकाचा स्वाक्षर', margin, yPosition);
//     doc.line(margin, yPosition + 3, margin + 30, yPosition + 3);

//     // Business signature
//     doc.text('भांडारदारांचा स्वाक्षर', pageWidth - margin - 40, yPosition);
//     doc.line(pageWidth - margin - 40, yPosition + 3, pageWidth - margin, yPosition + 3);

//     // Generated date
//     doc.setFontSize(7);
//     doc.setTextColor(100, 100, 100);
//     doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, margin, pageHeight - 5);

//     // ==========================================
//     // SAVE AND SEND
//     // ==========================================

//     const fileName = `Bill_${customer.name}_${billNo}.pdf`;
    
//     // Save to buffer and send
//     const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error('Bill generation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error generating bill',
//       error: error.message
//     });
//   }
// };

import { jsPDF } from 'jspdf';
import Customer from '../models/Customer.js';

// Manual table drawing function
const drawTable = (doc, startY, headers, data, columnWidths) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const cellHeight = 7;
  const headerHeight = 8;
  
  let yPos = startY;
  
  // Draw header
  doc.setFillColor(139, 69, 19);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  
  let xPos = margin;
  headers.forEach((header, index) => {
    doc.rect(xPos, yPos, columnWidths[index], headerHeight, 'F');
    doc.text(header, xPos + 2, yPos + headerHeight - 2);
    xPos += columnWidths[index];
  });
  
  yPos += headerHeight;
  
  // Draw rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  data.forEach((row) => {
    xPos = margin;
    row.forEach((cell, index) => {
      doc.rect(xPos, yPos, columnWidths[index], cellHeight);
      doc.text(String(cell), xPos + 2, yPos + cellHeight - 2);
      xPos += columnWidths[index];
    });
    yPos += cellHeight;
  });
  
  return yPos;
};

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

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page settings
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // ==========================================
    // HEADER SECTION
    // ==========================================

    // Business name in Marathi (large, bold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('अजय गाढी भांडार', pageWidth / 2, 25, { align: 'center' });

    // Phone numbers
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('📞 2651189 / 2658489', pageWidth / 2, 32, { align: 'center' });

    // Address
    doc.setFontSize(9);
    doc.text('शिपी गल्ली, येवला - 423401 (जि. नाशिक)', pageWidth / 2, 36, { align: 'center' });

    // Description
    doc.setFontSize(8);
    const desc = 'आमचे येथे शुभकार्यासाठी गाढी, उषी, लोड, सोलापूर चादर, हलक्कट, दुल्हई, सत्रजी, शाही गाळीचा व छत्री,जनेटट, तांडपच्या, घोडेसाज, जेवणपाटी इत्यादी सामान भाड्याने मिळेल।';
    const descLines = doc.splitTextToSize(desc, pageWidth - 30);
    doc.text(descLines, margin, 42);

    // ==========================================
    // BILL DETAILS SECTION
    // ==========================================

    let yPosition = 60;

    // Bill number and date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const billNo = customer._id.toString().slice(-6);
    doc.text(`बिल क्रमांक / क्रमांक: ${billNo}`, margin, yPosition);

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`दिनांक: ${dateStr}`, pageWidth / 2 + 30, yPosition);

    yPosition += 8;

    // Customer name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`ग्राहकाचे नाव: ${customer.name}`, margin, yPosition);

    yPosition += 6;

    // Customer details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`फोन नंबर: ${customer.phone}`, margin, yPosition);

    yPosition += 5;

    doc.text(`पत्ता: ${customer.address || '-'}`, margin, yPosition);

    yPosition += 5;

    doc.text(`फिटर: ${customer.fitterName || '-'}`, margin, yPosition);

    yPosition += 10;

    // ==========================================
    // ITEMS TABLE - MANUAL DRAWING
    // ==========================================

    const tableHeaders = ['क्र.', 'गाढीचे नाव', 'नग', 'दर नगास', 'रक्कम'];
    const columnWidths = [15, 70, 20, 30, 35];
    
    const tableData = customer.items.map((item, index) => [
      String(index + 1),
      item.itemName || '',
      String(item.quantity || 0),
      `₹${item.price || 0}`,
      item.quantity ? `₹${(item.quantity * item.price).toLocaleString('en-IN')}` : '₹0'
    ]);

    // Draw header
    doc.setFillColor(139, 69, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    
    let xPos = margin;
    const headerY = yPosition;
    const headerHeight = 8;
    
    tableHeaders.forEach((header, index) => {
      doc.rect(xPos, headerY, columnWidths[index], headerHeight, 'F');
      doc.text(header, xPos + 2, headerY + headerHeight - 2);
      xPos += columnWidths[index];
    });

    yPosition += headerHeight;

    // Draw rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const cellHeight = 6;
    tableData.forEach((row) => {
      xPos = margin;
      row.forEach((cell, index) => {
        doc.rect(xPos, yPosition, columnWidths[index], cellHeight);
        doc.text(String(cell), xPos + 2, yPosition + cellHeight - 1);
        xPos += columnWidths[index];
      });
      yPosition += cellHeight;
    });

    yPosition += 5;

    // ==========================================
    // CHARGES SECTION
    // ==========================================

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);

    const itemsTotal = customer.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );

    // Items total
    doc.text('गाढीची एकूण रक्कम:', pageWidth / 2 + 50, yPosition);
    doc.text(`₹${itemsTotal.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });

    yPosition += 6;

    // Transport charges
    if (customer.transportCost && customer.transportCost > 0) {
      doc.text('वाहतूक खर्च:', pageWidth / 2 + 50, yPosition);
      doc.text(`₹${customer.transportCost.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;
    }

    // Maintenance charges
    if (customer.maintenanceCharges && customer.maintenanceCharges > 0) {
      doc.text('देखभाल शुल्क:', pageWidth / 2 + 50, yPosition);
      doc.text(`₹${customer.maintenanceCharges.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;
    }

    // Extra charges
    if (customer.extraCharges && customer.extraCharges > 0) {
      doc.text('अतिरिक्त खर्च:', pageWidth / 2 + 50, yPosition);
      doc.text(`₹${customer.extraCharges.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;
    }

    // Separator line
    doc.setDrawColor(139, 69, 19);
    doc.line(pageWidth / 2 + 45, yPosition, pageWidth - margin, yPosition);

    yPosition += 4;

    // Total Amount (Grand Total)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('एकूण रक्कम:', pageWidth / 2 + 50, yPosition);
    doc.text(`₹${customer.totalAmount.toLocaleString('en-IN')}`, pageWidth - margin - 10, yPosition, { align: 'right' });

    yPosition += 10;

    // ==========================================
    // PAYMENT DETAILS SECTION
    // ==========================================

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    // Deposit
    doc.text('जमा रक्कम:', margin, yPosition);
    doc.text(`₹${(customer.depositAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);

    yPosition += 5;

    // Given amount
    doc.setFont('helvetica', 'bold');
    doc.text('दिलेली रक्कम:', margin, yPosition);
    doc.text(`₹${(customer.givenAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);

    yPosition += 5;

    // Remaining amount
    doc.setFont('helvetica', 'normal');
    doc.text('बाकी रक्कम:', margin, yPosition);
    doc.setTextColor(220, 20, 60);
    doc.text(`₹${(customer.remainingAmount || 0).toLocaleString('en-IN')}`, pageWidth / 2 + 20, yPosition);
    doc.setTextColor(0, 0, 0);

    yPosition += 10;

    // ==========================================
    // CHECKLIST TABLE - MANUAL DRAWING
    // ==========================================

    const checklistHeaders = ['सामानाचे नाव', 'नग', 'बर नगास', 'कोठून कोठपर्यंत', 'दिवस', 'रक्कम'];
    const checklistColWidths = [50, 15, 25, 35, 15, 25];
    const checklistData = Array(5).fill(['', '', '', '', '', '']);

    // Draw checklist header
    doc.setFillColor(139, 69, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    
    xPos = margin;
    const checkHeaderY = yPosition;
    
    checklistHeaders.forEach((header, index) => {
      doc.rect(xPos, checkHeaderY, checklistColWidths[index], 7, 'F');
      doc.text(header, xPos + 2, checkHeaderY + 5);
      xPos += checklistColWidths[index];
    });

    yPosition += 7;

    // Draw checklist rows
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    checklistData.forEach(() => {
      xPos = margin;
      checklistColWidths.forEach((width) => {
        doc.rect(xPos, yPosition, width, 12);
        xPos += width;
      });
      yPosition += 12;
    });

    yPosition += 5;

    // ==========================================
    // FOOTER NOTES
    // ==========================================

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('नोट्स:', margin, yPosition);

    yPosition += 4;

    doc.setFontSize(7);
    const notes = [
      '1. गाढी हरवल्यास किंवा नुकसान झाल्यास संपूर्ण बदली रक्कम देय असेल।',
      '2. बिल मिळाल्यानंतर 7 दिवसांत रक्कम फेडणे अनिवार्य आहे।',
      '3. कोणतेही वाद असल्यास तत्काळ संपर्क साधा.'
    ];

    notes.forEach((note) => {
      const wrappedText = doc.splitTextToSize(note, pageWidth - 30);
      doc.text(wrappedText, margin, yPosition);
      yPosition += 3;
    });

    // ==========================================
    // SIGNATURE SECTION
    // ==========================================

    yPosition = pageHeight - 25;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    // Customer signature
    doc.text('ग्राहकाचा स्वाक्षर', margin, yPosition);
    doc.line(margin, yPosition + 3, margin + 30, yPosition + 3);

    // Business signature
    doc.text('भांडारदारांचा स्वाक्षर', pageWidth - margin - 40, yPosition);
    doc.line(pageWidth - margin - 40, yPosition + 3, pageWidth - margin, yPosition + 3);

    // Generated date
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, margin, pageHeight - 5);

    // ==========================================
    // SAVE AND SEND
    // ==========================================

    const fileName = `Bill_${customer.name}_${billNo}.pdf`;
    
    // Save to buffer and send
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Bill generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bill',
      error: error.message
    });
  }
};