import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Note, NoteColor } from '@/hooks/use-notes';
import { Trash2, X } from 'lucide-react';
import { NOTE_COLORS } from './note-card';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onUpdate, onDelete, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState<NoteColor>(note.color);

  const lastSaved = useRef({ title: note.title, content: note.content, color: note.color });

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        title !== lastSaved.current.title ||
        content !== lastSaved.current.content ||
        color !== lastSaved.current.color
      ) {
        onUpdate(note.id, { title, content, color });
        lastSaved.current = { title, content, color };
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [title, content, color, note.id, onUpdate]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        data-testid="dialog-note-editor"
        className={`max-w-3xl w-[95vw] h-[85vh] sm:h-[80vh] flex flex-col p-0 gap-0 border shadow-2xl sm:rounded-3xl overflow-hidden ${NOTE_COLORS[color]}`}
        hideCloseButton
      >
        <DialogTitle className="sr-only">Edit Note</DialogTitle>
        
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-current/10 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
          <div className="flex gap-3">
            {(['cream', 'yellow', 'pink', 'green', 'blue'] as NoteColor[]).map(c => (
              <button
                key={c}
                data-testid={`button-color-${c}`}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full shadow-sm transition-all border border-black/10 dark:border-white/10 ${NOTE_COLORS[c]} ${
                  color === c ? 'ring-2 ring-black/40 dark:ring-white/40 ring-offset-2 ring-offset-transparent scale-110' : 'hover:scale-110'
                }`}
                aria-label={`Set color to ${c}`}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              data-testid="button-delete-note"
              variant="ghost"
              size="icon"
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="text-current/60 hover:text-red-600 hover:bg-red-600/10 rounded-full"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-current/10 mx-1" />
            <Button
              data-testid="button-close-editor"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-current/60 hover:text-current hover:bg-current/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex flex-col p-6 sm:p-10 overflow-y-auto">
          <input
            data-testid="input-note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-4xl sm:text-5xl font-serif font-bold bg-transparent outline-none placeholder:text-current/30 mb-6"
          />
          <textarea
            data-testid="input-note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 text-lg sm:text-xl leading-relaxed bg-transparent outline-none resize-none placeholder:text-current/30 font-sans"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
