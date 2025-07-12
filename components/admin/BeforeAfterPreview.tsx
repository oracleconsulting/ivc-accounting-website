import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BeforeAfterPreviewProps {
  originalContent: string;
  currentContent: string;
}

export function BeforeAfterPreview({ originalContent, currentContent }: BeforeAfterPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (!originalContent || originalContent === currentContent) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content Comparison</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      {showPreview && (
        <CardContent>
          <Tabs defaultValue="side-by-side">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="diff">Show Changes</TabsTrigger>
            </TabsList>
            <TabsContent value="side-by-side">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Original</h4>
                  <div className="p-3 bg-muted rounded-md text-sm max-h-64 overflow-y-auto">
                    {originalContent}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Current</h4>
                  <div className="p-3 bg-muted rounded-md text-sm max-h-64 overflow-y-auto">
                    {currentContent}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="diff">
              <div className="p-3 bg-muted rounded-md text-sm">
                {/* In a real implementation, you'd use a diff library here */}
                <p className="text-muted-foreground">
                  Showing differences between versions...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
} 