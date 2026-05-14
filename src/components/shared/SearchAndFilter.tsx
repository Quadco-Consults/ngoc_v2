import { Search, Filter } from 'lucide-react';
import Button from './Button';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  onFilterClick,
  placeholder = 'Search...',
  className = '',
}: SearchAndFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          className="w-[290px] text-sm text-gray-700 outline-none placeholder:text-gray-400"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Button */}
      {onFilterClick && (
        <Button
          variant="outline"
          size="md"
          onClick={onFilterClick}
          icon={<Filter className="w-4 h-4" />}
        >
          Filter
        </Button>
      )}
    </div>
  );
}
