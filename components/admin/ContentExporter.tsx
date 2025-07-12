import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Share2, FileText, Video } from 'lucide-react';

interface ContentExporterProps {
  content: string;
  title: string;
  keywords: string[];
  onExport: (format: string, content: string) => void;
}

export function ContentExporter({ content, title, keywords, onExport }: ContentExporterProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  const [exportedContent, setExportedContent] = useState('');

  const exportAs = async (format: string) => {
    const response = await fetch('/api/ai/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title, keywords, format })
    });
    
    const data = await response.json();
    setExportedContent(data.content);
    setExportFormat(format);
    setShowExportDialog(true);
    onExport(format, data.content);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export Content</CardTitle>
          <CardDescription>Transform your content for different platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => exportAs('email')}>
              <Mail className="w-4 h-4 mr-2" />
              Email Newsletter
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAs('social-series')}>
              <Share2 className="w-4 h-4 mr-2" />
              Social Series
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAs('pdf-guide')}>
              <FileText className="w-4 h-4 mr-2" />
              PDF Guide
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportAs('video-script')}>
              <Video className="w-4 h-4 mr-2" />
              Video Script
            </Button>
          </div>
        </CardContent>
      </Card>

      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Exported as {exportFormat}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportDialog(false)}
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your content has been transformed for {exportFormat}
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <pre className="whitespace-pre-wrap text-sm overflow-x-auto">{exportedContent}</pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigator.clipboard.writeText(exportedContent)}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 