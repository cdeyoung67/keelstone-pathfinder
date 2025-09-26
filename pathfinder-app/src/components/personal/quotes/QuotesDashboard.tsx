'use client';

import { useState, useEffect } from 'react';
import { PersonalQuote, QuoteFilters, CardinalVirtue } from '@/lib/types-personal';
import { mockPersonalQuotes, searchQuotes, getQuotesByVirtue, getFavoriteQuotes, getQuotesByDoor } from '@/lib/mock-data/personal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VirtueTag from '../shared/VirtueTag';
import FruitTag from '../shared/FruitTag';
import QuoteCard from './QuoteCard';
import QuoteCapture from './QuoteCapture';
import QuoteFilters from './QuoteFilters';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  StarIcon,
  BookOpenIcon,
  HeartIcon,
  AcademicCapIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<PersonalQuote[]>(mockPersonalQuotes);
  const [filteredQuotes, setFilteredQuotes] = useState<PersonalQuote[]>(mockPersonalQuotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<QuoteFilters>({});
  const [showCapture, setShowCapture] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'christian' | 'secular'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...quotes];

    // Apply view mode filter
    switch (viewMode) {
      case 'favorites':
        filtered = getFavoriteQuotes();
        break;
      case 'christian':
        filtered = getQuotesByDoor('christian');
        break;
      case 'secular':
        filtered = getQuotesByDoor('secular');
        break;
      default:
        filtered = [...quotes];
    }

    // Apply search
    if (searchTerm.trim()) {
      filtered = searchQuotes(searchTerm);
      // Re-apply view mode filter to search results
      switch (viewMode) {
        case 'favorites':
          filtered = filtered.filter(q => q.isFavorite);
          break;
        case 'christian':
          filtered = filtered.filter(q => q.door === 'christian');
          break;
        case 'secular':
          filtered = filtered.filter(q => q.door === 'secular');
          break;
      }
    }

    // Apply additional filters
    if (activeFilters.virtue) {
      filtered = filtered.filter(q => 
        q.primaryVirtue === activeFilters.virtue || 
        q.secondaryVirtues?.includes(activeFilters.virtue!)
      );
    }

    if (activeFilters.sourceType) {
      filtered = filtered.filter(q => q.sourceType === activeFilters.sourceType);
    }

    // Sort by date added (newest first)
    filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, activeFilters, viewMode]);

  const handleQuoteAdded = (newQuote: PersonalQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
    setShowCapture(false);
  };

  const handleQuoteUpdated = (updatedQuote: PersonalQuote) => {
    setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
  };

  const handleQuoteDeleted = (quoteId: string) => {
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setViewMode('all');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.virtue) count++;
    if (activeFilters.sourceType) count++;
    if (activeFilters.fruits?.length) count += activeFilters.fruits.length;
    if (activeFilters.wisdomTags?.length) count += activeFilters.wisdomTags.length;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-title text-navy-900">Life Verses & Wisdom</h2>
          <p className="text-sm text-slate-600">
            {filteredQuotes.length} of {quotes.length} quotes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="relative"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-gold-500 text-xs px-1.5 py-0.5 h-5">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
          <Button
            onClick={() => setShowCapture(true)}
            className="btn-primary"
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Quote
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search quotes, notes, sources, or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
        />
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" />
            All ({quotes.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <StarIcon className="w-4 h-4" />
            Favorites ({getFavoriteQuotes().length})
          </TabsTrigger>
          <TabsTrigger value="christian" className="flex items-center gap-2">
            <HeartIcon className="w-4 h-4" />
            Christian ({getQuotesByDoor('christian').length})
          </TabsTrigger>
          <TabsTrigger value="secular" className="flex items-center gap-2">
            <AcademicCapIcon className="w-4 h-4" />
            Secular ({getQuotesByDoor('secular').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="card-elevated">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-500 hover:text-slate-700"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <QuoteFiltersComponent
              filters={activeFilters}
              onFiltersChange={setActiveFilters}
            />
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {(getActiveFilterCount() > 0 || searchTerm || viewMode !== 'all') && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600">Active filters:</span>
          
          {viewMode !== 'all' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {viewMode === 'favorites' ? 'Favorites' : viewMode === 'christian' ? 'Christian Path' : 'Secular Path'}
            </Badge>
          )}
          
          {searchTerm && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Search: "{searchTerm}"
            </Badge>
          )}
          
          {activeFilters.virtue && (
            <VirtueTag virtue={activeFilters.virtue} size="sm" />
          )}
          
          {activeFilters.sourceType && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {activeFilters.sourceType}
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-slate-700 h-6 px-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <Card className="card text-center py-12">
          <CardContent>
            <BookOpenIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {searchTerm || getActiveFilterCount() > 0 ? 'No quotes found' : 'No quotes yet'}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchTerm || getActiveFilterCount() > 0 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start building your personal collection of meaningful quotes and verses.'
              }
            </p>
            {(!searchTerm && getActiveFilterCount() === 0) && (
              <Button onClick={() => setShowCapture(true)} className="btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Quote
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map(quote => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onUpdate={handleQuoteUpdated}
              onDelete={handleQuoteDeleted}
            />
          ))}
        </div>
      )}

      {/* Quote Capture Modal */}
      {showCapture && (
        <QuoteCapture
          onQuoteAdded={handleQuoteAdded}
          onClose={() => setShowCapture(false)}
        />
      )}
    </div>
  );
}
