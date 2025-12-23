import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCustomerBill = (customer) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Ajay Gadhi Bandar', 105, 20, { align: 'center' });
  
  // Add customer details
  doc.setFontSize(12);
  doc.text(`Customer: ${customer.name}`, 20, 40);
  doc.text(`Phone: ${customer.phone}`, 20, 50);
  
  // Add table
  doc.autoTable({
    startY: 60,
    head: [['Description', 'Amount']],
    body: [
      ['Total Amount', `₹${customer.totalAmount}`],
      ['Deposit', `₹${customer.depositAmount}`],
      ['Given Amount', `₹${customer.givenAmount}`],
      ['Remaining', `₹${customer.remainingAmount}`],
    ],
  });
  
  doc.save(`bill-${customer.name}.pdf`);
};