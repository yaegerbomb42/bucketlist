import React, { useState } from 'react';
import { BucketItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GoldBucket } from './components/GoldBucket';
import { BucketCard } from './components/BucketCard';
import { Plus, Search } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<BucketItem[]>('yaegers-bucket-list', []);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    setItems((prev) => [newItem, ...prev]);
    setInputValue('');
  };

  const toggleItem = (id: string) => {
    setItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completedAt: item.completedAt ? null : new Date().toISOString()
          };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item from your bucket?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Sorting: Active items sorted by creation (newest first), Completed items sorted by completion date (newest first)
  const activeItems = items
    .filter(i => !i.completedAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completedItems = items
    .filter(i => !!i.completedAt)
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  const total = items.length;
  const doneCount = completedItems.length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 selection:bg-gold-500/30">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gold-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="pt-12 pb-8 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mb-4 animate-in fade-in zoom-in duration-700">
            <GoldBucket />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 drop-shadow-sm">
              Yaeger's Bucket
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto mb-6">
            Collect moments, not things. Build your legacy.
          </p>

          {/* Progress Bar */}
          {total > 0 && (
            <div className="w-full max-w-md bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleAddItem} className="w-full max-w-2xl relative group z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 focus-within:border-gold-500/50 transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What's next on your journey?"
                className="w-full bg-transparent border-none text-lg text-white px-6 py-5 focus:outline-none focus:ring-0 placeholder:text-slate-500"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="mr-2 p-3 bg-gold-500 hover:bg-gold-400 text-slate-900 rounded-lg font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          </form>
        </header>

        {/* Main Content Area - Split View */}
        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
          
          {/* Left Column: Active Items */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-2">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                In Progress
                <span className="text-sm font-normal text-slate-500 ml-2">({activeItems.length})</span>
              </h2>
            </div>
            
            <div className="flex flex-col gap-3">
              {activeItems.length === 0 && completedItems.length === 0 ? (
                <div className="text-center py-20 opacity-50 border-2 border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-400">The bucket is empty.</p>
                  <p className="text-sm text-slate-600 mt-2">Add your first adventure above.</p>
                </div>
              ) : activeItems.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <p className="text-slate-400">All cleared! Time to dream up more.</p>
                </div>
              ) : (
                activeItems.map(item => (
                  <BucketCard 
                    key={item.id} 
                    item={item} 
                    onToggle={toggleItem} 
                    onDelete={deleteItem}
                  />
                ))
              )}
            </div>
          </section>

          {/* Right Column: Completed Items */}
          <section className="flex flex-col gap-4 relative">
             {/* Divider for mobile view only (hidden on md+) */}
            <div className="md:hidden w-full h-px bg-slate-800 my-4"></div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-2">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                Completed
                <span className="text-sm font-normal text-slate-500 ml-2">({completedItems.length})</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {completedItems.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                  <p className="text-slate-500">Completed items will move here.</p>
                </div>
              ) : (
                completedItems.map(item => (
                  <BucketCard 
                    key={item.id} 
                    item={item} 
                    onToggle={toggleItem} 
                    onDelete={deleteItem}
                  />
                ))
              )}
            </div>
          </section>
        </main>

        <footer className="mt-20 py-8 text-center text-slate-600 text-sm border-t border-slate-800/50">
          <p>&copy; {new Date().getFullYear()} Yaeger's Bucket. Persisted locally.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;