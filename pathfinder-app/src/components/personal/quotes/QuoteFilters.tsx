'use client';

import { QuoteFilters, CardinalVirtue, FruitOfSpirit, WisdomTag, SourceType } from '@/lib/types-personal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import VirtueTag from '../shared/VirtueTag';
import FruitTag from '../shared/FruitTag';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface QuoteFiltersProps {
  filters: QuoteFilters;
  onFiltersChange: (filters: QuoteFilters) => void;
}

const VIRTUE_OPTIONS: CardinalVirtue[] = ['wisdom', 'courage', 'justice', 'temperance'];

const FRUIT_OPTIONS: FruitOfSpirit[] = [
  'love', 'joy', 'peace', 'patience', 'kindness', 
  'goodness', 'faithfulness', 'gentleness', 'self-control'
];

const WISDOM_OPTIONS: WisdomTag[] = [
  'stoicism', 'mindfulness', 'resilience', 'growth', 'purpose',
  'philosophy', 'meditation', 'reflection', 'acceptance', 'discipline'
];

const SOURCE_OPTIONS: SourceType[] = [
  'practice', 'manual', 'email', 'community', 'book', 'sermon'
];

export default function QuoteFiltersComponent({ filters, onFiltersChange }: QuoteFiltersProps) {
  const updateFilter = (key: keyof QuoteFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: 'fruits' | 'wisdomTags', value: string) => {
    const currentArray = filters[key] || [];
    const isSelected = currentArray.includes(value as any);
    
    if (isSelected) {
      updateFilter(key, currentArray.filter(item => item !== value));
    } else {
      updateFilter(key, [...currentArray, value]);
    }
  };

  const removeArrayFilter = (key: 'fruits' | 'wisdomTags', value: string) => {
    const currentArray = filters[key] || [];
    updateFilter(key, currentArray.filter(item => item !== value));
  };

  return (
    <div className="space-y-6">
      {/* Virtue Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cardinal Virtue
        </label>
        <Select 
          value={filters.virtue || ''} 
          onValueChange={(value) => updateFilter('virtue', value || undefined)}
        >
          <SelectTrigger className="bg-sand-50 border-sand-300">
            <SelectValue placeholder="Select a virtue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Virtues</SelectItem>
            {VIRTUE_OPTIONS.map(virtue => (
              <SelectItem key={virtue} value={virtue}>
                <div className="flex items-center gap-2">
                  <VirtueTag virtue={virtue} size="sm" showIcon={false} />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Source Type Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Source Type
        </label>
        <Select 
          value={filters.sourceType || ''} 
          onValueChange={(value) => updateFilter('sourceType', value || undefined)}
        >
          <SelectTrigger className="bg-sand-50 border-sand-300">
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sources</SelectItem>
            {SOURCE_OPTIONS.map(source => (
              <SelectItem key={source} value={source}>
                <span className="capitalize">{source}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fruit of the Spirit Tags (Christian) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fruit of the Spirit
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {FRUIT_OPTIONS.map(fruit => (
            <button
              key={fruit}
              onClick={() => toggleArrayFilter('fruits', fruit)}
              className={`transition-all duration-200 ${
                filters.fruits?.includes(fruit) 
                  ? 'ring-2 ring-gold-400 ring-offset-1' 
                  : 'hover:scale-105'
              }`}
            >
              <FruitTag 
                tag={fruit} 
                type="fruit" 
                size="sm" 
                className={filters.fruits?.includes(fruit) ? 'opacity-100' : 'opacity-60'}
              />
            </button>
          ))}
        </div>
        
        {/* Selected Fruits */}
        {filters.fruits && filters.fruits.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 bg-sand-50 rounded-lg">
            <span className="text-xs text-slate-600 mr-2">Selected:</span>
            {filters.fruits.map(fruit => (
              <div key={fruit} className="flex items-center gap-1">
                <FruitTag tag={fruit} type="fruit" size="sm" />
                <button
                  onClick={() => removeArrayFilter('fruits', fruit)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wisdom Tags (Secular) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Wisdom Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {WISDOM_OPTIONS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleArrayFilter('wisdomTags', tag)}
              className={`transition-all duration-200 ${
                filters.wisdomTags?.includes(tag) 
                  ? 'ring-2 ring-gold-400 ring-offset-1' 
                  : 'hover:scale-105'
              }`}
            >
              <FruitTag 
                tag={tag} 
                type="wisdom" 
                size="sm" 
                className={filters.wisdomTags?.includes(tag) ? 'opacity-100' : 'opacity-60'}
              />
            </button>
          ))}
        </div>
        
        {/* Selected Wisdom Tags */}
        {filters.wisdomTags && filters.wisdomTags.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 bg-sand-50 rounded-lg">
            <span className="text-xs text-slate-600 mr-2">Selected:</span>
            {filters.wisdomTags.map(tag => (
              <div key={tag} className="flex items-center gap-1">
                <FruitTag tag={tag} type="wisdom" size="sm" />
                <button
                  onClick={() => removeArrayFilter('wisdomTags', tag)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filter Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-sand-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilter('favorites', true)}
          className={filters.favorites ? 'bg-gold-100 border-gold-300 text-gold-800' : ''}
        >
          Favorites Only
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilter('door', 'christian')}
          className={filters.door === 'christian' ? 'bg-red-100 border-red-300 text-red-800' : ''}
        >
          Christian Path
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilter('door', 'secular')}
          className={filters.door === 'secular' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}
        >
          Secular Path
        </Button>
      </div>
    </div>
  );
}
