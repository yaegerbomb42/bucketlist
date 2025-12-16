import React from 'react';
import { BucketItem } from '../types';
import { Check, Trash2, Zap } from 'lucide-react';

interface BucketCardProps {
  item: BucketItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BucketCard: React.FC<BucketCardProps> = ({ item, onToggle, onDelete }) => {
  const isCompleted = !!item.completedAt;

  return (
    <div 
      className={`
        group relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 ease-out
        hover:translate-x-1
        ${isCompleted 
          ? 'bg-slate-900/30 border-slate-800/50' 
          : 'bg-[#0f0f20]/80 border-slate-800 hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          className={`
            mt-1 flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300
            ${isCompleted 
              ? 'bg-neon-pink border-neon-pink text-white shadow-[0_0_10px_#ff00ff]' 
              : 'border-slate-600 bg-slate-900/50 text-transparent hover:border-neon-blue hover:shadow-[0_0_8px_#00f3ff]'
            }
          `}
        >
          <Check size={14} strokeWidth={4} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p 
            className={`
              text-lg font-medium break-words leading-snug transition-all duration-300
              ${isCompleted ? 'text-slate-600 line-through decoration-slate-700' : 'text-slate-200 group-hover:text-white'}
            `}
          >
            {item.text}
          </p>
          
          {!isCompleted && (
            <div className="h-0 group-hover:h-4 overflow-hidden transition-all duration-300">
               <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-neon-blue pt-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  <Zap size={10} fill="currentColor" /> Active Goal
               </div>
            </div>
          )}
        </div>

        {/* Delete Action (Instant) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="
            opacity-0 group-hover:opacity-100 focus:opacity-100
            transition-all duration-200 
            p-2 rounded-lg
            text-slate-600 hover:text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]
            transform translate-x-2 group-hover:translate-x-0
          "
          title="Delete Instantly"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};