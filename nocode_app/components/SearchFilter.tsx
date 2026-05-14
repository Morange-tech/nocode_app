'use client';

import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: 'all' | 'pending' | 'completed';
  onFilterChange: (status: 'all' | 'pending' | 'completed') => void;
  taskCount: number;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  taskCount,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All ({taskCount})
        </button>
        <button
          onClick={() => onFilterChange('pending')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filterStatus === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filterStatus === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Completed
        </button>

        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
