import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, BookOpen, AlertCircle, Briefcase } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'tax-update',
    name: 'Tax Law Update',
    icon: AlertCircle,
    description: 'Latest HMRC changes and compliance updates',
    content: `# [Tax/Regulation] Update: What [Business Type] Need to Know

## Key Changes

[Introduce the main changes that took effect on [date]]

## Who's Affected?

[Describe which businesses/individuals this impacts]

## What You Need to Do

1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

## Deadlines to Remember

- [Date]: [Deadline description]
- [Date]: [Deadline description]

## How IVC Accounting Can Help

[Call to action for your services]`,
    keywords: ['tax update', 'HMRC', 'compliance', 'UK tax law']
  },
  {
    id: 'small-business-guide',
    name: 'Small Business Guide',
    icon: Briefcase,
    description: 'How-to guides for small business owners',
    content: `# The Complete Guide to [Topic] for Small Businesses

## Introduction

[Hook - why this matters for small businesses]

## Why [Topic] Matters

[Explain the importance and impact]

## Step-by-Step Guide

### Step 1: [First Step]
[Detailed explanation]

### Step 2: [Second Step]
[Detailed explanation]

## Common Mistakes to Avoid

1. [Mistake 1]
2. [Mistake 2]

## Case Study: How [Example Business] Saved £[Amount]

[Real or hypothetical example]

## Next Steps

[Clear call to action]`,
    keywords: ['small business', 'guide', 'how to', 'UK business']
  },
  {
    id: 'industry-analysis',
    name: 'Industry Analysis',
    icon: TrendingUp,
    description: 'Market trends and industry insights',
    content: `# [Industry] Sector Analysis: Trends and Opportunities for 2024

## Executive Summary

[Brief overview of key findings]

## Market Overview

[Current state of the industry]

## Key Trends Shaping the Industry

### Trend 1: [Trend Name]
[Analysis and implications]

### Trend 2: [Trend Name]
[Analysis and implications]

## Opportunities for Growth

[Specific opportunities for businesses]

## Financial Implications

[Tax and accounting considerations]

## Action Plan for [Industry] Businesses

[Practical steps to take advantage of trends]`,
    keywords: ['industry analysis', 'market trends', 'business growth']
  }
];

interface ContentTemplatesProps {
  onSelectTemplate: (template: any) => void;
}

export function ContentTemplates({ onSelectTemplate }: ContentTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Content Templates</CardTitle>
        <CardDescription>Start with a proven structure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelectTemplate({
                title: template.name,
                content: template.content,
                keywords: template.keywords
              })}
            >
              <Icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
} 