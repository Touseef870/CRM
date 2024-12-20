import React from 'react';
import { Button, Box, Typography, Grid, Paper } from '@mui/material';
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
    const margin = 15;

    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Invoice', margin, 20);

    // Date and Invoice Number
    const currentDate = new Date().toLocaleDateString();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Invoice Number: #${selectedOrder.id}`, margin, 30);
    doc.text(`Date: ${currentDate}`, margin, 35);

    // Company Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Company Info', margin, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Vehware Inc.', margin, 60);
    doc.text('123 Main Street, City, Country', margin, 65);
    doc.text('Phone: +123456789', margin, 70);
    doc.text('Email: support@vehware.com', margin, 75);
    doc.text('Website: www.vehware.com', margin, 80);

    // Brand Details
    const brandDetailsStartY = 95;
    if (selectedOrder.brand.img) {
      doc.addImage(selectedOrder.brand.img, 'JPEG', margin, brandDetailsStartY, 30, 30);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Brand Details', margin + 40, brandDetailsStartY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Brand: ${selectedOrder.brand.title}`, margin + 40, brandDetailsStartY + 10);
    doc.text(`Description: ${selectedOrder.brand.description}`, margin + 40, brandDetailsStartY + 20, {
      maxWidth: pageWidth - margin * 2 - 40,
    });

    // Order Details
    const orderDetailsStartY = brandDetailsStartY + 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Order Details', margin, orderDetailsStartY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Order Title: ${selectedOrder.title}`, margin, orderDetailsStartY + 10);
    doc.text(`Description: ${selectedOrder.description}`, margin, orderDetailsStartY + 20, {
      maxWidth: pageWidth - margin * 2,
    });

    // Table Section
    const tableStartY = orderDetailsStartY + 40;

    // Add headers with proper alignment
    doc.setFont('helvetica', 'bold');
    doc.text('Item', margin, tableStartY);
    doc.text('Price', pageWidth / 2, tableStartY, { align: 'center' });
    doc.text('Quantity', pageWidth - margin, tableStartY, { align: 'right' });

    // Add table data with proper alignment and consistent row spacing
    doc.setFont('helvetica', 'normal');
    const rowHeight = 10; // Row height for table entries
    const tableDataY = tableStartY + rowHeight;

    doc.text(selectedOrder.title, margin, tableDataY);
    doc.text(`$${selectedOrder.price.toFixed(2)}`, pageWidth / 2, tableDataY, { align: 'center' });
    doc.text('1', pageWidth - margin, tableDataY, { align: 'right' });

    // Payment Details
    const paymentDetailsStartY = tableDataY + 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', margin, paymentDetailsStartY);

    doc.setFont('helvetica', 'normal');
    doc.text(`Discount Price: $${selectedOrder.discountPrice.toFixed(2)}`, margin, paymentDetailsStartY + 10);
    doc.text(`Total Amount: $${selectedOrder.price.toFixed(2)}`, margin, paymentDetailsStartY + 20);
    doc.text(`Payment Due: ${currentDate}`, margin, paymentDetailsStartY + 30);

    // Status
    const statusStartY = paymentDetailsStartY + 40;
    doc.setFont('helvetica', 'bold');
    doc.text(`Status: ${selectedOrder.status}`, margin, statusStartY);

    // Footer Section
    const footerStartY = doc.internal.pageSize.getHeight() - 40;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('Thank you for your business!', margin, footerStartY);
    doc.text('www.vehware.com', margin, footerStartY + 10);

    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, selectedOrder.id, {
      format: 'CODE128',
      displayValue: false,
    });
    const barcodeImage = barcodeCanvas.toDataURL('image/png');
    doc.addImage(barcodeImage, 'PNG', pageWidth - 60, footerStartY - 10, 50, 20);

    // Save the document as a PDF
    doc.save(`${selectedOrder.title}-Invoice.pdf`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Button
        onClick={handleDownloadPDF}
        color="primary"
        startIcon={<SaveAlt />}
        sx={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#45A049',
          },
        }}
      >
        Download Invoice
      </Button>
    </Box>
  );
};

export default PDFDownloadUI;
