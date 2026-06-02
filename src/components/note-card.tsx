import { Note } from '@/hooks/use-notes';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export const NOTE_COLORS: Record<Note['color'], string> = {
  cream: 'bg-[#fdfbf7] dark:bg-[#3d3833] text-[#4a443e] dark:text-[#e8e2d9] border-[#e6e2d8] dark:border-[#524c46]',
  yellow: 'bg-[#fef7d9] dark:bg-[#4a4422] text-[#5c5421] dark:text-[#f4ebd0] border-[#f0e3a6] dark:border-[#635a2d]',
  pink: 'bg-[#fde7ed] dark:bg-[#4d2d34] text-[#6b3543] dark:text-[#f7dfe5] border-[#f5c6d3] dark:border-[#6e414b]',
  green: 'bg-[#eaf5e5] dark:bg-[#2b422a] text-[#34592f] dark:text-[#e0edd9] border-[#cbe3c3] dark:border-[#3f5c3d]',
  blue: 'bg-[#e5f0f9] dark:bg-[#263e52] text-[#2c4c66] dark:text-[#dceaf5] border-[#c2daef] dark:border-[#385873]',
};

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  index: number;
}

export function NoteCard({ note, onClick, index }: NoteCardProps) {
  // Derive a title if none provided
  const displayTitle = note.title.trim() 
    ? note.title 
    : (note.content.split('\n')[0].trim() || 'Empty Note');
    
  // Show the rest of the content if the first line is used as title
  const displayContent = (!note.title.trim() && note.content.includes('\n'))
    ? note.content.substring(note.content.indexOf('\n') + 1).trim()
    : (!note.title.trim() ? '' : note.content.trim());

  return (
    <motion.button
      data-testid={`card-note-${note.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex flex-col text-left p-5 rounded-2xl border shadow-sm ${NOTE_COLORS[note.color]} hover:shadow-md transition-all h-[240px]`}
    >
      <div className="flex-1 overflow-hidden">
        <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2 leading-tight">
          {displayTitle}
        </h3>
        {displayContent && (
          <p className="opacity-80 line-clamp-4 leading-relaxed font-sans text-sm">
            {displayContent}
          </p>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-60 font-medium">
        <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
      </div>
    </motion.button>
  );
}
