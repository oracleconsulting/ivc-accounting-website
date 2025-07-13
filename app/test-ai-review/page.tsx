'use client';

import React, { useState } from 'react';
import AIReviewPanel from '@/components/admin/AIReviewPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestAIReviewPage() {
  const [content, setContent] = useState(`# UK Tax Planning for Small Businesses

As a small business owner in the UK, understanding tax planning is crucial for maximizing your profits and minimizing your tax liabilities. With the ever-changing landscape of tax laws and regulations, navigating the complexities of tax planning can be a daunting task.

## Key Tax Planning Strategies

### 1. Choose the Right Business Structure

The business structure you choose can significantly impact your tax obligations. Sole proprietorships, partnerships, limited liability companies (LLCs), and corporations each have different tax implications.

### 2. Utilize Allowable Deductions

Take advantage of all eligible deductions to reduce your taxable income. Common deductions for small businesses include business expenses, depreciation of assets, employee salaries and benefits, and interest on business loans.

### 3. Manage Your Inventory Effectively

If your business deals with physical goods, proper inventory management can have tax implications. Consider using the first-in, first-out (FIFO) or weighted average cost method.

## Making Tax Digital (MTD) Compliance

The MTD initiative continues to evolve, with new requirements being phased in. Staying ahead of these changes can save you time and prevent costly penalties.

## R&D Tax Credits

Many businesses miss out on valuable R&D tax credits. If your business is developing new products, processes, or services, you might be eligible for significant tax relief.

## Conclusion

Effective tax planning requires ongoing attention and professional expertise. Contact us today to discuss how we can help optimize your tax position.`);

  const [keywords, setKeywords] = useState('tax planning, small business, UK tax, MTD, R&D credits');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Review Panel Test</h1>
        <p className="text-muted-foreground">
          Test the comprehensive AI review system with your content
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Content Editor</CardTitle>
            <CardDescription>
              Edit your content here and see the AI review results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="tax planning, small business, UK tax"
              />
            </div>
            <div>
              <Label htmlFor="content">Blog Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                placeholder="Enter your blog content here..."
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Word count: {content.split(/\s+/).length}</p>
              <p>Character count: {content.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Review Panel */}
        <div>
          <AIReviewPanel
            content={content}
            onContentUpdate={setContent}
            keywords={keywords.split(',').map(k => k.trim()).filter(k => k)}
            aiMode="comprehensive"
          />
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the AI Review Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Content Analysis:</strong> The AI analyzes your content for grammar, style, SEO, clarity, brand voice, and factual accuracy.</p>
            <p><strong>2. Scoring:</strong> Get scores for overall quality, readability, SEO optimization, and brand alignment.</p>
            <p><strong>3. Suggestions:</strong> Review specific suggestions with exact text replacements and explanations.</p>
            <p><strong>4. One-Click Apply:</strong> Apply individual suggestions or all at once to improve your content.</p>
            <p><strong>5. SEO Analysis:</strong> Check keyword density and optimization for your target keywords.</p>
            <p><strong>6. Quick Actions:</strong> Generate meta descriptions, social media posts, and more.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 