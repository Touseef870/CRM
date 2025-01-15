import React from 'react';
import { Button, Box } from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

interface PDFDownloadUIProps {
  selectedOrder: any;
}

const PDFDownloadUI: React.FC<PDFDownloadUIProps> = ({ selectedOrder }) => {
  const handleDownloadPDF = () => {
    if (!selectedOrder) {
      alert('No order details available for download.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const rowHeight = 8;
    const tableWidth = pageWidth - margin * 2;

    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Invoice', margin, 30);

    // Date and Invoice Information
    const currentDate = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Client ID: ${selectedOrder.clientId}`, margin, 40);
    doc.text(`Session ID: ${selectedOrder.sessionId}`, margin, 50);
    doc.text(`Invoice ID: ${selectedOrder._id}`, margin, 60);
    doc.text(`Date: ${currentDate}`, margin, 70);

    // Company Info Section with Box
    const companyInfoStartY = 85;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, companyInfoStartY - 5, tableWidth, 60); // Company info box without fill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Company Info', margin + 10, companyInfoStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Vehware Inc.', margin + 10, companyInfoStartY + 10);
    doc.text('Wyoming, USA', margin + 10, companyInfoStartY + 20);
    doc.text('Phone: +18156155601', margin + 10, companyInfoStartY + 30);
    doc.text('Email: info@veh-ware.com', margin + 10, companyInfoStartY + 40);
    doc.text('Website: www.veh-ware.com', margin + 10, companyInfoStartY + 50);

    // Brand Details Section with Box (Only Title)
    const brandDetailsStartY = companyInfoStartY + 70;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, brandDetailsStartY - 5, tableWidth, 30); // Box for brand title section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Brand Details', margin + 10, brandDetailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Brand Title: ${selectedOrder.brand.title}`, margin + 10, brandDetailsStartY + 15); // Right-aligned

    // Line Break for next section
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
 
    // Order Details Section (Only Order Title)
    const orderDetailsStartY = brandDetailsStartY + 35;
    const tableStartY = orderDetailsStartY + 20;
    const tableHeaderY = tableStartY;
    doc.setDrawColor(0);
    doc.rect(margin, orderDetailsStartY - 5, tableWidth, 30); // Box for order details section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Order Details', margin + 10, orderDetailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Order Title: ${selectedOrder.title}`, margin + 20, orderDetailsStartY + 15);

    // Table Section



    // Table header

    // Draw only the outer border for the table header (no internal lines)
    // Single rectangle for the header (outer border only)

    // Table header content (no internal lines)
    doc.text('Item', margin + 5, tableHeaderY + rowHeight / 2 + 4); // Adjusted vertical alignment
    doc.text('Price', margin + tableWidth / 4, tableHeaderY + rowHeight / 2 + 4, { align: 'center' });
    doc.text('Discount Price', margin + tableWidth / 2, tableHeaderY + rowHeight / 2 + 4, { align: 'center' });
    doc.text('Total Amount', margin + (tableWidth * 3) / 4, tableHeaderY + rowHeight / 2 + 4, { align: 'center' });
    doc.text('Quantity', margin + tableWidth - 10, tableHeaderY + rowHeight / 2 + 4, { align: 'right' });

    // Table Row (Item Details)
    const tableRowY = tableHeaderY + rowHeight + 5; // Adjust space below header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Handle text overflow for item name (wrap text if too long)
    const itemText = selectedOrder.title;
    const itemLines = doc.splitTextToSize(itemText, tableWidth / 4 - 10); // Adjusted to fit the item's column width
    doc.text(itemLines, margin + 5, tableRowY + 5); // Draw text within the item's column

    // Adjust dynamic Y position based on text wrapping
    const adjustedY = tableRowY + (itemLines.length - 1) * 5; // Adjust based on number of lines

    // Price, Discount Price, and Total Amount
    doc.text(`$${selectedOrder.price.toFixed(2)}`, margin + tableWidth / 4, tableRowY + 10, { align: 'center' });
    doc.text(`$${selectedOrder.discountPrice.toFixed(2)}`, margin + tableWidth / 2, tableRowY + 10, { align: 'center' });
    doc.text(`$${selectedOrder.totalAmount.toFixed(2)}`, margin + (tableWidth * 3) / 4, tableRowY + 10, { align: 'center' });
    doc.text('1', margin + tableWidth - 10, tableRowY + 10, { align: 'right' });

    // Ensure no extra horizontal lines are drawn in the header




    // Payment Details Section
    const paymentDetailsStartY = tableRowY + 25; // Reduced the space before payment details
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, paymentDetailsStartY - 5, tableWidth, 50); // Box for payment details section (increased height for more room)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', margin + 10, paymentDetailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text('Discount Price:', margin + 10, paymentDetailsStartY + 20);
    doc.text(`$${selectedOrder.discountPrice.toFixed(2)}`, margin + 80, paymentDetailsStartY + 20);
    doc.text('Total Amount:', margin + 10, paymentDetailsStartY + 10);
    doc.text(`$${selectedOrder.price.toFixed(2)}`, margin + 80, paymentDetailsStartY + 10); // Right-aligned
    // Right-aligned
    doc.text('Status:', margin + 10, paymentDetailsStartY + 30);
    doc.text(`$${selectedOrder.status}`, margin + 80, paymentDetailsStartY + 30); // Right-aligned

    // Moved "Payment Due" inside the box
    doc.text('Payment Due:', margin + 10, paymentDetailsStartY + 40);
    doc.text(`${currentDate}`, margin + 80, paymentDetailsStartY + 40); // Right-aligned



    // Footer Section with Contact Info Box
    const footerStartY = pageHeight - 60;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, footerStartY - 30, tableWidth, 30); // Footer box without fill
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);



    // Save the document as a PDF
    doc.save(`${selectedOrder.title}-Invoice.pdf`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
      <Button
        onClick={handleDownloadPDF}
        color="primary"
        startIcon={<SaveAlt />}
        sx={{
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: '8px',
          marginRight: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#007BFF',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0056b3',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          },
          '@media (max-width: 480px)': {
            padding: '2px 20px',
            marginRight: '10px',
            margin: '6 auto',
          },
        }}
      >
        Download PDF
      </Button>
    </Box>
  );
};

export default PDFDownloadUI;
