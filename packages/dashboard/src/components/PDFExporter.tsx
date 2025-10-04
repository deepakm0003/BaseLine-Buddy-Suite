import React from 'react';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

interface PDFExporterProps {
  reportData: any;
  onExport: () => void;
  isExporting: boolean;
}

const PDFExporter: React.FC<PDFExporterProps> = ({ reportData, onExport, isExporting }) => {
  const generatePDF = async () => {
    try {
      onExport();
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set default font
      pdf.setFont('helvetica');
      
      // Add header with background
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Add title with white text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Baseline Compliance Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add generation date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // Reset text color
      pdf.setTextColor(0, 0, 0);
      
      let yPosition = 60;
      
      // Add summary section with background
      pdf.setFillColor(248, 250, 252); // Light gray background
      pdf.rect(15, yPosition - 5, pageWidth - 30, 50, 'F');
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary', 25, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Summary in two columns
      const leftCol = 25;
      const rightCol = pageWidth / 2 + 10;
      
      pdf.text(`Files Scanned: ${reportData.files.scanned}`, leftCol, yPosition);
      pdf.text(`Errors: ${reportData.summary.errors}`, rightCol, yPosition);
      yPosition += 8;
      
      pdf.text(`Files with Issues: ${reportData.files.withIssues}`, leftCol, yPosition);
      pdf.text(`Warnings: ${reportData.summary.warnings}`, rightCol, yPosition);
      yPosition += 8;
      
      pdf.text(`Total Issues: ${reportData.summary.total}`, leftCol, yPosition);
      pdf.text(`Info: ${reportData.summary.info}`, rightCol, yPosition);
      
      yPosition += 25;
      
      // Add Baseline status section
      pdf.setFillColor(240, 253, 244); // Light green background
      pdf.rect(15, yPosition - 5, pageWidth - 30, 40, 'F');
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Baseline Status', 25, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Status in three columns
      const col1 = 25;
      const col2 = pageWidth / 3 + 10;
      const col3 = (pageWidth * 2) / 3 - 10;
      
      pdf.text(`Widely Available: ${reportData.summary.baselineWidely}`, col1, yPosition);
      pdf.text(`Newly Available: ${reportData.summary.baselineNewly}`, col2, yPosition);
      pdf.text(`Limited Support: ${reportData.summary.total - reportData.summary.baselineWidely - reportData.summary.baselineNewly}`, col3, yPosition);
      
      yPosition += 25;
      
      // Add issues section
      if (reportData.issues.length > 0) {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Issues Found', 25, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        reportData.issues.forEach((issue: any, index: number) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 30;
          }
          
          // Issue box with background
          const severityColor = issue.severity === 'error' ? [254, 226, 226] : 
                               issue.severity === 'warning' ? [254, 243, 199] : [219, 234, 254];
          
          pdf.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
          pdf.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
          
          // Issue number and title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${issue.feature}`, 25, yPosition);
          
          // Severity badge
          const severityText = issue.severity.toUpperCase();
          const severityWidth = pdf.getTextWidth(severityText) + 8;
          pdf.setFillColor(severityColor[0] - 20, severityColor[1] - 20, severityColor[2] - 20);
          pdf.rect(pageWidth - 25 - severityWidth, yPosition - 3, severityWidth, 6, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(8);
          pdf.text(severityText, pageWidth - 25 - severityWidth + 4, yPosition);
          pdf.setTextColor(0, 0, 0);
          
          yPosition += 8;
          
          // File and message
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`File: ${issue.file}`, 25, yPosition);
          yPosition += 5;
          pdf.text(`Message: ${issue.message}`, 25, yPosition);
          
          if (issue.suggestion) {
            yPosition += 5;
            pdf.setTextColor(0, 100, 0);
            pdf.text(`Suggestion: ${issue.suggestion}`, 25, yPosition);
            pdf.setTextColor(0, 0, 0);
          }
          
          yPosition += 15;
        });
      } else {
        // No issues found
        pdf.setFillColor(240, 253, 244);
        pdf.rect(20, yPosition - 5, pageWidth - 40, 20, 'F');
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 150, 0);
        pdf.text('No Baseline issues found! All features are compliant.', pageWidth / 2, yPosition + 5, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
      }
      
      // Add footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Footer background
        pdf.setFillColor(248, 250, 252);
        pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        // Footer text
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Generated by Baseline Buddy Suite', pageWidth / 2, pageHeight - 12, { align: 'center' });
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
      }
      
      // Save the PDF
      pdf.save(`baseline-compliance-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isExporting}
      className={`
        inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
        ${isExporting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        }
      `}
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Report
        </>
      )}
    </button>
  );
};

export default PDFExporter;
