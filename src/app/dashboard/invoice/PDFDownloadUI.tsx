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
    const tableMargin = 5;
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
    doc.setFillColor(240, 240, 240); // Light grey fill color
    doc.rect(margin, companyInfoStartY - 5, tableWidth, 60, 'F'); // Company info box with fill
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

    // Brand Details Section with Box
    const brandDetailsStartY = companyInfoStartY + 70;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.setFillColor(245, 245, 245); // Slightly lighter grey fill color for brand box
    doc.rect(margin, brandDetailsStartY - 5, tableWidth, 60, 'F'); // Brand info box with fill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Brand Details', margin + 10, brandDetailsStartY);
    if (selectedOrder.brand.img) {
      doc.addImage(selectedOrder.brand.img, 'JPEG', margin + 10, brandDetailsStartY + 10, 30, 30);
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Brand: ${selectedOrder.brand.title}`, margin + 40, brandDetailsStartY + 10);
    doc.text(`Description: ${selectedOrder.brand.description}`, margin + 40, brandDetailsStartY + 20, {
      maxWidth: tableWidth - 40,
    });

    // Line Break for next section
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, brandDetailsStartY + 70, pageWidth - margin, brandDetailsStartY + 70);

    // Order Details Section with Box
    const orderDetailsStartY = brandDetailsStartY + 75;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.setFillColor(250, 250, 250); // Even lighter grey for order details box
    doc.rect(margin, orderDetailsStartY - 5, tableWidth, 40, 'F'); // Order details box with fill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Order Details', margin + 10, orderDetailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Order Title: ${selectedOrder.title}`, margin + 10, orderDetailsStartY + 10);
    doc.text(`Description: ${selectedOrder.description}`, margin + 10, orderDetailsStartY + 20, {
      maxWidth: tableWidth - 20,
    });

    // Table Section with Box
    const tableStartY = orderDetailsStartY + 50;
    const tableRowHeight = 8;
    const tableHeaderY = tableStartY;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.setFillColor(220, 220, 220); // Light grey for table header
    doc.rect(margin, tableHeaderY, tableWidth, rowHeight, 'F'); // Table header box with fill

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Item', margin + 5, tableHeaderY + 5);
    doc.text('Price', margin + tableWidth / 4, tableHeaderY + 5, { align: 'center' });
    doc.text('Discount Price', margin + tableWidth / 2, tableHeaderY + 5, { align: 'center' });
    doc.text('Total Amount', margin + (tableWidth * 3) / 4, tableHeaderY + 5, { align: 'center' });
    doc.text('Quantity', margin + tableWidth - 10, tableHeaderY + 5, { align: 'right' });

    // Table Row (Item Details)
    const tableRowY = tableHeaderY + rowHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(selectedOrder.title, margin + 5, tableRowY + 5);
    doc.text(`$${selectedOrder.price.toFixed(2)}`, margin + tableWidth / 4, tableRowY + 5, { align: 'center' });
    doc.text(`$${selectedOrder.discountPrice.toFixed(2)}`, margin + tableWidth / 2, tableRowY + 5, { align: 'center' });
    doc.text(`$${selectedOrder.totalAmount.toFixed(2)}`, margin + (tableWidth * 3) / 4, tableRowY + 5, { align: 'center' });
    doc.text('1', margin + tableWidth - 10, tableRowY + 5, { align: 'right' });

    // Payment Details Section with Box
    const paymentDetailsStartY = tableRowY + 30;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.setFillColor(235, 235, 235); // Light fill color for payment details box
    doc.rect(margin, paymentDetailsStartY - 5, tableWidth, 50, 'F'); // Payment details box with fill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Payment Details', margin + 10, paymentDetailsStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Total Amount: $${selectedOrder.price.toFixed(2)}`, margin + 10, paymentDetailsStartY + 10);
    doc.text(`Discount Price: $${selectedOrder.discountPrice.toFixed(2)}`, margin + 10, paymentDetailsStartY + 20);
    doc.text(`Total Amount Due: $${selectedOrder.totalAmount.toFixed(2)}`, margin + 10, paymentDetailsStartY + 30);
    doc.text(`Payment Due: ${currentDate}`, margin + 10, paymentDetailsStartY + 40);

    // Status Section
    const statusStartY = paymentDetailsStartY + 60;
    doc.setFont('helvetica', 'bold');
    doc.text(`Status: ${selectedOrder.status}`, margin + 10, statusStartY);

    // Footer Section with Contact Info Box
    const footerStartY = pageHeight - 60;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.setFillColor(240, 240, 240); // Footer box color
    doc.rect(margin, footerStartY - 30, tableWidth, 30, 'F'); // Footer box with fill
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);


    // Barcode Section
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, selectedOrder.id, {
      format: 'CODE128',
      displayValue: false,
    });
    const barcodeImage = barcodeCanvas.toDataURL('image/png');
    doc.addImage(barcodeImage, 'PNG', pageWidth - 60, footerStartY - 15, 50, 20);

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
