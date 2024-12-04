import React from 'react';
import { Button } from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { jsPDF } from 'jspdf';

interface PDFDownloadUIProps {
  selectedOrder: any; // Ensure to type this according to the structure of your order
}

const PDFDownloadUI: React.FC<PDFDownloadUIProps> = ({ selectedOrder }) => {
  const handleDownloadPDF = () => {
    if (!selectedOrder) return;

    const doc = new jsPDF();

    // Page Setup
    doc.setFont('helvetica', 'normal');
    doc.setLineWidth(0.5);

    // Add Title and Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 20);

    // Add Invoice Number and Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number: #${selectedOrder.id}`, 14, 30);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 14, 35);

    // Add Company Info in a Box
    doc.setFillColor(240, 240, 240); // Light gray background for the box
    doc.rect(14, 40, 180, 50, 'F'); // Draw the box
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Company Info', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('Company Name: Vehware Inc.', 14, 60);
    doc.text('Address: 123 Main Street, City, Country', 14, 65);
    doc.text('Phone: +123456789', 14, 70);
    doc.text('Email: support@vehware.com', 14, 75);
    doc.text('Website: www.vehware.com', 14, 80);

    // Add Order Details Section (With Box and Padding)
    doc.setFillColor(255, 255, 255); // White background for this box
    doc.rect(14, 90, 180, 60, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 14, 100);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order Title: ${selectedOrder.title}`, 14, 110);
    doc.text(`Description: ${selectedOrder.description}`, 14, 115);
    doc.text(`Discount Price: $${selectedOrder.discountPrice.toFixed(2)}`, 14, 120);
    doc.text(`Price: $${selectedOrder.price.toFixed(2)}`, 14, 125);
    doc.text(`Status: ${selectedOrder.status}`, 14, 130);

    // Add Brand Info Section (With Box)
    doc.setFillColor(240, 240, 240); // Light gray background for brand info box
    doc.rect(14, 140, 180, 60, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Brand Details', 14, 150);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Brand: ${selectedOrder.brand.title}`, 14, 160);
    doc.text(`Brand Description: ${selectedOrder.brand.description}`, 14, 165);

    // Add Brand Image if available
    const imageYOffset = selectedOrder.brand.img ? 170 : 165; // Adjusting image position dynamically if image exists
    if (selectedOrder.brand.img) {
      doc.addImage(selectedOrder.brand.img, 'JPEG', 14, imageYOffset, 50, 50); // Adjust image size and position
    }

    // Adjusting the start position of "Payment Details" below the image
    const paymentDetailsY = imageYOffset + 60; // Adding space for the image and next section

    // Add a Horizontal Line to Separate Footer Section
    doc.setDrawColor(0, 0, 0); // Black color
    doc.setLineWidth(0.5);
    doc.line(14, paymentDetailsY, 195, paymentDetailsY); // Line below the content

    // Footer Section (Total and Payment Info)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 14, paymentDetailsY + 10); // Adjust position based on image
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Amount: $${selectedOrder.price.toFixed(2)}`, 14, paymentDetailsY + 20);
    doc.text(`Payment Due: ${currentDate}`, 14, paymentDetailsY + 25);

    // Save the PDF as a file
    doc.save(`${selectedOrder.title}-Invoice.pdf`);
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      color="primary"
      startIcon={<SaveAlt />}
      sx={{
        backgroundColor: '#3498DB',
        color: '#fff',
        '&:hover': { backgroundColor: '#2980B9' },
        fontWeight: 600,
        padding: '10px 20px',
      }}
    >
      Download PDF
    </Button>
  );
};

export default PDFDownloadUI;
