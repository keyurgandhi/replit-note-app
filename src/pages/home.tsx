import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useNotes } from '@/hooks/use-notes';
import { NoteCard } from '@/components/note-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Moon, Sun, BookHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { notes, isLoaded, addNote, deleteNote } = useNotes();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const q = search.toLowerCase();
    return notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, search]);

  const handleCreate = () => {
    const newNote = addNote();
    setLocation(`/note/${newNote.id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNote(id);
    toast({
      title: "Note deleted",
      description: "The note has been removed from your scratchpad.",
    });
  };

  if (!isLoaded) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <BookHeart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">Quick Notes</h1>
              <p className="text-muted-foreground mt-1 text-sm font-medium">Your personal scratchpad</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-9 bg-card/50 border-border/50 focus-visible:ring-primary shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="shrink-0 bg-card/50 border-border/50"
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleCreate} 
              className="shrink-0 shadow-sm"
              data-testid="button-create-note"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </header>

        {/* Content */}
        {notes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="bg-muted/50 p-6 rounded-full mb-6 text-muted-foreground">
              <BookHeart className="w-12 h-12 opacity-50" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">No notes yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Capture your fleeting thoughts. Create your first note to start your personal scratchpad.
            </p>
            <Button onClick={handleCreate} size="lg" className="shadow-md" data-testid="button-create-empty">
              <Plus className="w-4 h-4 mr-2" />
              Create your first note
            </Button>
          </motion.div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>No notes match your search.</p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredNotes.map(note => (
                <motion.div key={note.id} variants={item} layout>
                  <NoteCard 
                    note={note} 
                    onClick={() => setLocation(`/note/${note.id}`)}
                    onDelete={(e) => handleDelete(e, note.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
