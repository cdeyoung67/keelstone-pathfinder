'use client';

import { useState } from 'react';
import { PersonalQuote } from '@/lib/types-personal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VirtueTag from '../shared/VirtueTag';
import FruitTag from '../shared/FruitTag';
import { 
  StarIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  BookOpenIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface QuoteCardProps {
  quote: PersonalQuote;
  onUpdate: (quote: PersonalQuote) => void;
  onDelete: (quoteId: string) => void;
  className?: string;
}

export default function QuoteCard({ quote, onUpdate, onDelete, className = '' }: QuoteCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedQuote = { ...quote, isFavorite: !quote.isFavorite };
      onUpdate(updatedQuote);
    } catch (error) {
      console.error('Failed to update favorite status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShare = () => {
    // Mock share functionality
    const shareText = `"${quote.content}"${quote.author ? ` - ${quote.author}` : ''}${quote.bibleReference ? ` (${quote.bibleReference})` : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meaningful Quote',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // In a real app, you'd show a toast notification here
      console.log('Quote copied to clipboard');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      onDelete(quote.id);
    }
  };

  const getSourceIcon = () => {
    switch (quote.sourceType) {
      case 'practice':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'manual':
        return <PencilIcon className="w-4 h-4" />;
      case 'book':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'sermon':
        return quote.door === 'christian' ? <HeartIcon className="w-4 h-4" /> : <AcademicCapIcon className="w-4 h-4" />;
      case 'community':
        return <ShareIcon className="w-4 h-4" />;
      default:
        return <BookOpenIcon className="w-4 h-4" />;
    }
  };

  const getSourceColor = () => {
    switch (quote.sourceType) {
      case 'practice':
        return 'text-blue-600';
      case 'manual':
        return 'text-green-600';
      case 'book':
        return 'text-purple-600';
      case 'sermon':
        return 'text-destructive';
      case 'community':
        return 'text-orange-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <Card 
      className={`card-elevated hover:shadow-large transition-all duration-300 group ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-6">
        {/* Quote Content */}
        <blockquote className="text-slate-700 mb-4 leading-relaxed">
          <span className="text-gold-600 text-2xl leading-none">"</span>
          {quote.content}
          <span className="text-gold-600 text-2xl leading-none">"</span>
        </blockquote>

        {/* Author & Reference */}
        {(quote.author || quote.bibleReference || quote.bookReference) && (
          <div className="text-sm text-slate-600 mb-4 italic">
            {quote.author && <span>— {quote.author}</span>}
            {quote.bibleReference && (
              <span className="block text-xs text-blue-600 mt-1">
                {quote.bibleReference}
              </span>
            )}
            {quote.bookReference && (
              <span className="block text-xs text-purple-600 mt-1">
                {quote.bookReference}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <VirtueTag virtue={quote.primaryVirtue} size="sm" />
            {quote.secondaryVirtues?.map(virtue => (
              <VirtueTag key={virtue} virtue={virtue} size="sm" />
            ))}
          </div>
          
          {quote.fruitTags && quote.fruitTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quote.fruitTags.map(fruit => (
                <FruitTag key={fruit} tag={fruit} type="fruit" size="sm" />
              ))}
            </div>
          )}
          
          {quote.wisdomTags && quote.wisdomTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quote.wisdomTags.map(tag => (
                <FruitTag key={tag} tag={tag} type="wisdom" size="sm" />
              ))}
            </div>
          )}
        </div>

        {/* Personal Notes */}
        {quote.personalNotes && (
          <div className="bg-sand-50 rounded-lg p-3 mb-4 border-l-4 border-gold-300">
            <p className="text-sm text-slate-700 italic">
              {quote.personalNotes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          {/* Source Info */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${getSourceColor()}`}>
              {getSourceIcon()}
              <span className="capitalize">{quote.sourceType}</span>
            </div>
            {quote.source && (
              <span className="text-xs">• {quote.source}</span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span className="text-xs">
              {quote.dateAdded.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center justify-between mt-4 pt-4 border-t border-sand-200 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              disabled={isUpdating}
              className={`p-2 h-8 w-8 ${quote.isFavorite ? 'text-gold-600 hover:text-gold-700' : 'text-slate-400 hover:text-gold-600'}`}
            >
              {quote.isFavorite ? (
                <StarSolidIcon className="w-4 h-4" />
              ) : (
                <StarIcon className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 h-8 w-8 text-slate-400 hover:text-blue-600"
            >
              <ShareIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 text-slate-400 hover:text-green-600"
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-2 h-8 w-8 text-slate-400 hover:text-destructive"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Share Level Indicator */}
        {quote.shareLevel !== 'private' && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className={`text-xs px-2 py-0.5 ${
                quote.shareLevel === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {quote.shareLevel}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
