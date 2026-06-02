import React from 'react';
import { Note } from '@/hooks/use-notes';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const isUntitled = !note.title.trim();
  const isEmpty = !note.content.trim();

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="group relative h-48 p-5 cursor-pointer overflow-hidden flex flex-col hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm border-border/50"
        onClick={onClick}
        data-testid={`card-note-${note.id}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold truncate pr-6 ${isUntitled ? 'text-muted-foreground italic' : 'text-foreground'}`}>
            {isUntitled ? 'Untitled' : note.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
            data-testid={`button-delete-${note.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <p className={`text-sm flex-1 overflow-hidden line-clamp-4 leading-relaxed ${isEmpty ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
          {isEmpty ? 'No content' : note.content}
        </p>
        
        <div className="mt-4 text-xs text-muted-foreground/60 font-medium">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </div>
      </Card>
    </motion.div>
  );
}
