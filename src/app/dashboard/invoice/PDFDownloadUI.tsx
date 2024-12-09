import React from 'react';
import { Button } from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { jsPDF } from 'jspdf';

interface PDFDownloadUIProps {
  selectedOrder: any; 
}

const PDFDownloadUI: React.FC<PDFDownloadUIProps> = ({ selectedOrder }) => {
  const handleDownloadPDF = () => {
    if (!selectedOrder) return;

    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setLineWidth(0.5);

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Number: #${selectedOrder.id}`, 14, 30);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 14, 35);

    doc.setFillColor(240, 240, 240); 
    doc.rect(14, 40, 180, 50, 'F'); 
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Company Info', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('Company Name: Vehware Inc.', 14, 60);
    doc.text('Address: 123 Main Street, City, Country', 14, 65);
    doc.text('Phone: +123456789', 14, 70);
    doc.text('Email: support@vehware.com', 14, 75);
    doc.text('Website: www.vehware.com', 14, 80);

    doc.setFillColor(255, 255, 255); 
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

    doc.setFillColor(240, 240, 240); 
    doc.rect(14, 140, 180, 60, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Brand Details', 14, 150);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Brand: ${selectedOrder.brand.title}`, 14, 160);
    doc.text(`Brand Description: ${selectedOrder.brand.description}`, 14, 165);

    
    const imageYOffset = selectedOrder.brand.img ? 170 : 165; 
    if (selectedOrder.brand.img) {
      doc.addImage(selectedOrder.brand.img, 'JPEG', 14, imageYOffset, 50, 50); 
    }

    const paymentDetailsY = imageYOffset + 60;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(14, paymentDetailsY, 195, paymentDetailsY); 

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details', 14, paymentDetailsY + 10); 
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Amount: $${selectedOrder.price.toFixed(2)}`, 14, paymentDetailsY + 20);
    doc.text(`Payment Due: ${currentDate}`, 14, paymentDetailsY + 25);

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
        '&:hover': {  backgroundColor: 'blue',  color: 'white' },
        fontWeight: 600,
        padding: '10px 10px',
     
      }}
    >
      Download PDF
    </Button>
  );
};

export default PDFDownloadUI;
