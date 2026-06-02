import { useState, useMemo } from 'react';
import { useNotes, Note } from '@/hooks/use-notes';
import { NoteCard } from '@/components/note-card';
import { NoteEditor } from '@/components/note-editor';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = useMemo(() => 
    notes.find(n => n.id === activeNoteId), 
  [notes, activeNoteId]);

  const handleCreateNote = () => {
    const newNote = addNote({
      title: '',
      content: '',
      color: 'cream'
    });
    setActiveNoteId(newNote.id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-2 text-foreground"
            >
              Quick Notes
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground font-medium text-lg"
            >
              Your thoughts, beautifully organized.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              data-testid="button-new-note"
              onClick={handleCreateNote} 
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base px-8 h-14"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Note
            </Button>
          </motion.div>
        </header>

        {/* Empty State */}
        {notes.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3">It's quiet here.</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Jot down a thought, save an idea, or write a reminder. Your notes will appear here on your corkboard.
            </p>
            <Button 
              onClick={handleCreateNote} 
              variant="outline" 
              className="rounded-full h-12 px-8 shadow-sm"
            >
              Start writing
            </Button>
          </motion.div>
        )}

        {/* Note Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {notes.map((note, idx) => (
              <NoteCard
                key={note.id}
                note={note}
                index={idx}
                onClick={() => setActiveNoteId(note.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor Modal */}
      {activeNote && (
        <NoteEditor
          note={activeNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onClose={() => {
            // If it's completely empty when closing, auto-delete it to prevent clutter
            if (!activeNote.title.trim() && !activeNote.content.trim()) {
              deleteNote(activeNote.id);
            }
            setActiveNoteId(null);
          }}
        />
      )}
    </div>
  );
}
