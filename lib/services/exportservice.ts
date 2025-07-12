// /lib/services/exportService.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/lib/supabaseClient';

interface PDFOptions {
  title: string;
  content: string;
  format: 'guide' | 'report' | 'checklist';
  includeWorksheets?: boolean;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export class ExportService {
  // Generate PDF from content
  async generatePDF(options: PDFOptions): Promise<{ url: string; blob: Blob }> {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set up fonts and colors
      const primaryColor = options.branding?.primaryColor || '#7C3AED';
      const secondaryColor = options.branding?.secondaryColor || '#6B7280';
      
      // Add header
      this.addPDFHeader(doc, options.title, primaryColor);
      
      // Add content based on format
      let yPosition = 60;
      
      switch (options.format) {
        case 'guide':
          yPosition = this.addGuideContent(doc, options.content, yPosition);
          break;
        case 'report':
          yPosition = this.addReportContent(doc, options.content, yPosition);
          break;
        case 'checklist':
          yPosition = this.addChecklistContent(doc, options.content, yPosition);
          break;
      }
      
      // Add worksheets if requested
      if (options.includeWorksheets) {
        doc.addPage();
        this.addWorksheets(doc, options.title);
      }
      
      // Add footer to all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        this.addPDFFooter(doc, i, pageCount);
      }
      
      // Generate blob
      const blob = doc.output('blob');
      
      // Upload to storage
      const fileName = `${this.sanitizeFileName(options.title)}-${Date.now()}.pdf`;
      const { data: upload, error } = await supabase.storage
        .from('downloads')
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          cacheControl: '3600'
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('downloads')
        .getPublicUrl(fileName);

      return { url: publicUrl, blob };
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  // Add PDF header
  private addPDFHeader(doc: jsPDF, title: string, primaryColor: string): void {
    // Add colored header bar
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add logo placeholder
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 40, 20, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('IVC ACCOUNTING', 30, 22, { align: 'center' });
    
    // Add title
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 105, 25, { align: 'center' });
  }

  // Add guide content
  private addGuideContent(doc: jsPDF, content: string, startY: number): number {
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    // Parse content into sections
    const sections = this.parseContentSections(content);
    let yPosition = startY;
    
    sections.forEach((section, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Add section header
      doc.setFontSize(16);
      doc.setTextColor(124, 58, 237);
      doc.text(section.title, 20, yPosition);
      yPosition += 10;
      
      // Add section content
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(section.content, 170);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10; // Add spacing between sections
    });
    
    return yPosition;
  }

  // Add report content
  private addReportContent(doc: jsPDF, content: string, startY: number): number {
    // Add executive summary box
    doc.setFillColor(245, 245, 245);
    doc.rect(15, startY, 180, 40, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Executive Summary', 20, startY + 10);
    
    doc.setFontSize(10);
    const summary = this.extractSummary(content);
    const summaryLines = doc.splitTextToSize(summary, 170);
    let yPos = startY + 20;
    summaryLines.slice(0, 3).forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 5;
    });
    
    // Continue with regular content
    return this.addGuideContent(doc, content, startY + 50);
  }

  // Add checklist content
  private addChecklistContent(doc: jsPDF, content: string, startY: number): number {
    const checklistItems = this.extractChecklistItems(content);
    let yPosition = startY;
    
    doc.setFontSize(12);
    
    checklistItems.forEach((item, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Add checkbox
      doc.rect(20, yPosition - 4, 4, 4);
      
      // Add item text
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(item, 160);
      lines.forEach((line: string, lineIndex: number) => {
        doc.text(line, 30, yPosition + (lineIndex * 5));
      });
      
      yPosition += lines.length * 5 + 8;
    });
    
    return yPosition;
  }

  // Add worksheets
  private addWorksheets(doc: jsPDF, title: string): void {
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text('Worksheets', 105, 40, { align: 'center' });
    
    // Add worksheet sections
    const worksheets = [
      {
        title: 'Action Items',
        lines: 10
      },
      {
        title: 'Key Takeaways',
        lines: 8
      },
      {
        title: 'Implementation Timeline',
        lines: 6
      }
    ];
    
    let yPosition = 60;
    
    worksheets.forEach(worksheet => {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 40;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(worksheet.title, 20, yPosition);
      yPosition += 10;
      
      // Add lines for writing
      doc.setDrawColor(200, 200, 200);
      for (let i = 0; i < worksheet.lines; i++) {
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;
      }
      
      yPosition += 10;
    });
  }

  // Add PDF footer
  private addPDFFooter(doc: jsPDF, currentPage: number, totalPages: number): void {
    doc.setFontSize(10);
    doc.setTextColor(150);
    
    // Page numbers
    doc.text(
      `Page ${currentPage} of ${totalPages}`,
      105,
      285,
      { align: 'center' }
    );
    
    // Copyright
    doc.setFontSize(8);
    doc.text(
      `© ${new Date().getFullYear()} IVC Accounting. All rights reserved.`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Helper methods
  private sanitizeFileName(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  private parseContentSections(content: string): Array<{ title: string; content: string }> {
    // Simple parsing - in production, use a proper markdown parser
    const sections = content.split(/\n#{1,3}\s+/);
    return sections
      .filter(s => s.trim())
      .map(section => {
        const lines = section.split('\n');
        return {
          title: lines[0] || 'Section',
          content: lines.slice(1).join('\n').trim()
        };
      });
  }

  private extractSummary(content: string): string {
    // Extract first paragraph or executive summary
    const paragraphs = content.split('\n\n');
    return paragraphs[0] || content.substring(0, 300) + '...';
  }

  private extractChecklistItems(content: string): string[] {
    // Extract bullet points or numbered items
    const lines = content.split('\n');
    return lines
      .filter(line => line.match(/^[\-\*\•]\s+/) || line.match(/^\d+\.\s+/))
      .map(line => line.replace(/^[\-\*\•\d\.]\s+/, '').trim());
  }

  // Generate other export formats
  async exportAsHTML(title: string, content: string): Promise<string> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { color: #7C3AED; }
    h2 { color: #6B7280; }
    .header {
      border-bottom: 2px solid #7C3AED;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      color: #9CA3AF;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <p>Generated by IVC Accounting</p>
  </div>
  <div class="content">
    ${this.markdownToHTML(content)}
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} IVC Accounting. All rights reserved.</p>
  </div>
</body>
</html>`;
    
    return html;
  }

  private markdownToHTML(markdown: string): string {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\* (.+)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }
}

export const exportService = new ExportService();