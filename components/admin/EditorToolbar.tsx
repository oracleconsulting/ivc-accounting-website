'use client';

import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Undo,
  Redo,
  Upload,
  Table,
  TableProperties,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Table functions
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('strike') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Add Link"
          >
            <Link className="w-4 h-4" />
          </button>
          
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Add Image"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* Tables */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={insertTable}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Table"
          >
            <TableProperties className="w-4 h-4" />
          </button>
          
          {editor.isActive('table') && (
            <>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Add Column"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Add Row"
              >
                <Plus className="w-4 h-4 rotate-90" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Delete Column"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Delete Row"
              >
                <Trash2 className="w-4 h-4 rotate-90" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-red-600"
                title="Delete Table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 