'use client';

import { useState, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Send, Save, Eye, Users } from 'lucide-react';
import { EditorContent } from '@tiptap/react';

interface NewsletterEditorProps {
  newsletter?: any;
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
}

export default function NewsletterEditor({ newsletter, onSave, onSend }: NewsletterEditorProps) {
  const [subject, setSubject] = useState(newsletter?.subject || '');
  const [title, setTitle] = useState(newsletter?.title || '');
  const [previewText, setPreviewText] = useState(newsletter?.preview_text || '');
  const [status, setStatus] = useState(newsletter?.status || 'draft');
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: newsletter?.content_html || '<p>Start writing your newsletter...</p>',
  });

  const handleSave = async () => {
    if (!subject || !title) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/newsletter/save', {
        method: newsletter?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newsletter?.id,
          subject,
          title,
          preview_text: previewText,
          content_html: editor?.getHTML(),
          content_text: editor?.getText(),
          content_json: editor?.getJSON(),
          status: 'draft'
        })
      });

      if (!response.ok) throw new Error('Failed to save');

      const data = await response.json();
      toast.success('Newsletter saved successfully');
      onSave?.(data);
    } catch (error) {
      toast.error('Failed to save newsletter');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!window.confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newsletter?.id,
          subject,
          title,
          preview_text: previewText,
          content_html: editor?.getHTML(),
          content_text: editor?.getText(),
        })
      });

      if (!response.ok) throw new Error('Failed to send');

      const data = await response.json();
      toast.success(`Newsletter sent to ${data.recipientCount} subscribers`);
      onSend?.(data);
    } catch (error) {
      toast.error('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="subject">Email Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="This week's tax tips for Essex businesses"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="title">Newsletter Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="IVC Weekly: Tax Updates & Business Insights"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="preview">Preview Text</Label>
            <Input
              id="preview"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="What subscribers see before opening..."
              className="mt-1"
            />
            <p className="text-sm text-gray-600 mt-1">
              This appears after the subject line in most email clients
            </p>
          </div>

          <div>
            <Label>Newsletter Content</Label>
            <div className="mt-2 border rounded-lg p-4">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button
              onClick={() => window.open(`/api/newsletter/preview?id=${newsletter?.id}`, '_blank')}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button
              onClick={handleSend}
              disabled={sending || !editor?.getText()}
              className="bg-[#ff6b35] hover:bg-[#e55a2b]"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Newsletter'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 