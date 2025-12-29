import jsPDF from 'jspdf';

export interface PDFExportOptions {
  title: string;
  insights: string;
  structuredData?: any;
  analysisType: string;
  generatedAt: Date;
}

export function exportAnalysisToPDF(options: PDFExportOptions): void {
  const { title, insights, structuredData, analysisType, generatedAt } = options;

  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  let currentY = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4;

    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, margin, currentY);
      currentY += lineHeight;
    });

    currentY += 5; // Add spacing after paragraph
  };

  // Header
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, 25);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  currentY = 50;

  // Metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Analysis Type: ${analysisType}`, margin, currentY);
  currentY += 6;
  doc.text(`Generated: ${generatedAt.toLocaleString()}`, margin, currentY);
  currentY += 15;

  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Parse markdown insights to plain text
  const parseMarkdown = (markdown: string): string[] => {
    const sections: string[] = [];
    const lines = markdown.split('\n');

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Headers
      if (trimmed.startsWith('### ')) {
        sections.push(`\n${trimmed.replace('### ', '')}\n`);
      } else if (trimmed.startsWith('## ')) {
        sections.push(`\n${trimmed.replace('## ', '')}\n`);
      } else if (trimmed.startsWith('# ')) {
        sections.push(`\n${trimmed.replace('# ', '')}\n`);
      }
      // Lists
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        sections.push(`  • ${trimmed.substring(2)}`);
      } else if (/^\d+\.\s/.test(trimmed)) {
        sections.push(`  ${trimmed}`);
      }
      // Bold text
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        sections.push(trimmed.replace(/\*\*/g, ''));
      }
      // Regular paragraphs
      else {
        sections.push(trimmed);
      }
    });

    return sections;
  };

  const parsedSections = parseMarkdown(insights);

  // Add parsed content
  parsedSections.forEach((section) => {
    const isHeader = section.startsWith('\n') && section.endsWith('\n');
    const text = section.trim();

    if (text) {
      if (isHeader) {
        addWrappedText(text, 14, true);
      } else {
        addWrappedText(text, 10, false);
      }
    }
  });

  // Add structured data summary if available
  if (structuredData) {
    currentY += 10;
    checkPageBreak(20);

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, maxWidth, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Metrics Summary', margin + 5, currentY + 7);
    currentY += 15;

    // Add key metrics if they exist
    if (structuredData.keyMetrics) {
      const metrics = structuredData.keyMetrics;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (metrics.totalEmissions !== undefined) {
        doc.text(`Total Emissions: ${metrics.totalEmissions.toLocaleString()} kg CO2e`, margin, currentY);
        currentY += 6;
      }

      if (metrics.primaryMode) {
        doc.text(`Primary Mode: ${metrics.primaryMode} (${metrics.primaryModePercentage?.toFixed(1)}%)`, margin, currentY);
        currentY += 6;
      }

      if (metrics.trend) {
        doc.text(`Trend: ${metrics.trend}`, margin, currentY);
        currentY += 6;
      }
    }

    // Add recommendations summary
    if (structuredData.recommendations && structuredData.recommendations.length > 0) {
      currentY += 10;
      checkPageBreak(20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommendations:', margin, currentY);
      currentY += 8;

      structuredData.recommendations.forEach((rec: any, index: number) => {
        checkPageBreak(20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.title} [${rec.priority.toUpperCase()}]`, margin, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(rec.description, maxWidth - 10);
        descLines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin + 5, currentY);
          currentY += 5;
        });

        if (rec.estimatedReduction > 0) {
          doc.text(`   Potential Reduction: ${rec.estimatedReduction.toLocaleString()} kg CO2e`, margin + 5, currentY);
          currentY += 8;
        }
      });
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `CFIP - Carbon Footprint Intelligence Platform | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `${title.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  doc.save(filename);
}

// Export report to PDF
export function exportReportToPDF(reportData: any): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  let currentY = margin;

  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(reportData.name || 'Emissions Report', margin, 25);

  // Reset and add report details
  doc.setTextColor(0, 0, 0);
  currentY = 50;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Type: ${reportData.type}`, margin, currentY);
  currentY += 6;
  doc.text(`Period: ${new Date(reportData.dateFrom).toLocaleDateString()} - ${new Date(reportData.dateTo).toLocaleDateString()}`, margin, currentY);
  currentY += 6;
  doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, margin, currentY);
  currentY += 15;

  // Add separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Summary section
  if (reportData.summary) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, currentY);
    currentY += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Emissions: ${reportData.summary.totalEmissions?.toLocaleString()} kg CO2e`, margin, currentY);
    currentY += 6;
    doc.text(`Total Calculations: ${reportData.summary.totalCalculations}`, margin, currentY);
    currentY += 6;
    doc.text(`Average per Shipment: ${reportData.summary.averageEmissionsPerShipment?.toFixed(2)} kg CO2e`, margin, currentY);
    currentY += 15;
  }

  // Save
  const filename = `Report-${Date.now()}.pdf`;
  doc.save(filename);
}
