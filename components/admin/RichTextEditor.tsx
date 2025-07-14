'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Code,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onJsonChange?: (json: any) => void;
}

export default function RichTextEditor({ content, onChange, onJsonChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Get plain text for AI analysis
      const plainText = editor.getText();
      onChange(plainText);
      
      // Also pass JSON for saving
      if (onJsonChange) {
        onJsonChange(editor.getJSON());
      }
    },
  });

  if (!editor) {
    return null;
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-2 border-[#1a2b4a] rounded-none">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-[#1a2b4a] bg-[#f5f1e8]">
        {/* Text Style Buttons */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('bold') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('italic') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('underline') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('code') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[#1a2b4a] mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[#1a2b4a] mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('bulletList') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('orderedList') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[#1a2b4a] mx-1" />

        {/* Link and Table */}
        <button
          onClick={setLink}
          className={`p-2 hover:bg-[#ff6b35] hover:text-white transition-colors ${
            editor.isActive('link') ? 'bg-[#ff6b35] text-white' : 'text-[#1a2b4a]'
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <button
          onClick={addTable}
          className="p-2 hover:bg-[#ff6b35] hover:text-white transition-colors text-[#1a2b4a]"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-[#1a2b4a] mx-1" />

        {/* Color Picker */}
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 border-2 border-[#1a2b4a] cursor-pointer"
          title="Text Color"
        />

        <div className="w-px h-6 bg-[#1a2b4a] mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-[#ff6b35] hover:text-white transition-colors text-[#1a2b4a] disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-[#ff6b35] hover:text-white transition-colors text-[#1a2b4a] disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] p-4 prose prose-lg max-w-none focus:outline-none"
        style={{
          color: '#1a2b4a',
        }}
      />
    </div>
  );
} 