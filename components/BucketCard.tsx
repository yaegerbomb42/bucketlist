import React from 'react';
import { BucketItem } from '../types';
import { Check, Trash2, Calendar, Clock } from 'lucide-react';

interface BucketCardProps {
  item: BucketItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BucketCard: React.FC<BucketCardProps> = ({ item, onToggle, onDelete }) => {
  const isCompleted = !!item.completedAt;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`
        group relative p-5 rounded-xl border transition-all duration-300 ease-in-out
        hover:shadow-lg hover:-translate-y-1
        ${isCompleted 
          ? 'bg-slate-800/50 border-emerald-500/30 shadow-emerald-900/10' 
          : 'bg-slate-800 border-slate-700 shadow-xl shadow-black/20 hover:border-gold-500/50'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox / Status Indicator */}
        <button
          onClick={() => onToggle(item.id)}
          className={`
            mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
            ${isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-500 text-transparent hover:border-gold-400'
            }
          `}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check size={14} strokeWidth={4} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p 
            className={`
              text-lg font-medium break-words leading-snug transition-all duration-300
              ${isCompleted ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-100'}
            `}
          >
            {item.text}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-1" title="Date Added">
              <Calendar size={12} />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            
            {isCompleted && item.completedAt && (
              <div className="flex items-center gap-1 text-emerald-500/70" title="Date Completed">
                <Check size={12} />
                <span>Done: {formatDate(item.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Action (Visible on hover or if focused) */}
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-700/50"
          aria-label="Delete item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};