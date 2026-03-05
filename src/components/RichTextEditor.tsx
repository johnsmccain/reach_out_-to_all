import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useEffect } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Code, List, ListOrdered,
  Quote, Heading1, Heading2, Heading3, Heading4, Link as LinkIcon,
  Image as ImageIcon, Undo, Redo
} from 'lucide-react';
import { validateURL } from '@/lib/contentSanitizer';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const MenuButton = ({ 
  onClick, 
  active, 
  disabled, 
  children, 
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode; 
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      active ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const MenuBar = ({ editor, onImageUpload }: { editor: Editor | null; onImageUpload?: (file: File) => Promise<string> }) => {
  if (!editor) return null;

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      if (!validateURL(url)) {
        toast.error('Invalid URL. Please use http:// or https://');
        return;
      }
      editor.chain().focus().setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run();
    }
  }, [editor]);

  const addImage = useCallback(async () => {
    if (onImageUpload) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const url = await onImageUpload(file);
            editor.chain().focus().setImage({ src: url }).run();
          } catch (error) {
            toast.error('Failed to upload image');
          }
        }
      };
      input.click();
    } else {
      const url = window.prompt('Enter image URL:');
      if (url && validateURL(url)) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }, [editor, onImageUpload]);

  return (
    <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg sticky top-0 z-10">
      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <Heading4 className="h-4 w-4" />
        </MenuButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </MenuButton>
      </div>

      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
      </div>

      <div className="flex gap-1">
        <MenuButton onClick={addLink} active={editor.isActive('link')} title="Add Link">
          <LinkIcon className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={addImage} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </MenuButton>
      </div>
    </div>
  );
};

export const RichTextEditor = ({ content, onChange, placeholder, onImageUpload }: RichTextEditorProps) => {
  const lowlight = createLowlight(common);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your article...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
      <div className="border-t border-gray-300 p-2 bg-gray-50 text-xs text-gray-600 flex justify-between">
        <span>Word count: {editor?.storage.characterCount?.words() || 0}</span>
        <span>Characters: {editor?.getText().length || 0}</span>
      </div>
    </div>
  );
};
