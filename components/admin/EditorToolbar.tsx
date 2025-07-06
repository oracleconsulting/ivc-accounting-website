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
  Redo
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

  return (
    <div className="border-b border-gray-300 p-4 bg-gray-50">
      <div className="flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-[#ff6b35] text-white' : ''}`}
            title="Add Link"
          >
            <Link className="w-4 h-4" />
          </button>
          
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200"
            title="Add Image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 