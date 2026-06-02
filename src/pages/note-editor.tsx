import { useEffect, useState, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useNotes } from '@/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';

export default function NoteEditor() {
  const [, params] = useRoute('/note/:id');
  const [, setLocation] = useLocation();
  const { getNote, updateNote, deleteNote, isLoaded } = useNotes();
  const { toast } = useToast();
  
  const id = params?.id;
  const note = id ? getNote(id) : null;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const titleRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize state once when note loads
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note?.id]); // Only run when the note ID changes to prevent overwriting edits

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  // Handle redirect if not found
  useEffect(() => {
    if (isLoaded && id && !note) {
      setLocation('/');
    }
  }, [isLoaded, id, note, setLocation]);

  // Auto-save logic
  useEffect(() => {
    if (!id || !note) return;
    
    const handler = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote(id, { title, content });
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(handler);
  }, [title, content, id, note, updateNote]);

  if (!isLoaded || !note) return null;

  const handleDelete = () => {
    deleteNote(note.id);
    toast({
      title: "Note deleted",
      description: "Your note has been removed.",
    });
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-6 py-8 h-screen flex flex-col">
        
        {/* Toolbar */}
        <header className="flex items-center justify-between mb-8 shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground -ml-3"
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            <span className="hidden sm:flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              Edited {format(new Date(note.updatedAt), 'MMM d, h:mm a')}
            </span>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" data-testid="button-delete-editor">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This note will be permanently deleted from your scratchpad.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Note
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Editor */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col pb-8 overflow-hidden"
        >
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full bg-transparent text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground placeholder:text-muted-foreground/30 border-none outline-none resize-none overflow-hidden py-4 mb-4 shrink-0"
            rows={1}
            data-testid="input-note-title"
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full flex-1 bg-transparent text-lg text-foreground/90 placeholder:text-muted-foreground/40 border-none outline-none resize-none leading-relaxed"
            data-testid="input-note-content"
          />
        </motion.main>

      </div>
    </div>
  );
}
