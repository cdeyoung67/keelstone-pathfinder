'use client';

import { useState } from 'react';
import { PersonalQuote, CardinalVirtue, FruitOfSpirit, WisdomTag, SourceType } from '@/lib/types-personal';
import { mockPersonalQuotesAPI } from '@/lib/mock-data/personal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import VirtueTag from '../shared/VirtueTag';
import FruitTag from '../shared/FruitTag';
import { 
  XMarkIcon,
  SparklesIcon,
  BookOpenIcon,
  HeartIcon,
  AcademicCapIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface QuoteCaptureProps {
  onQuoteAdded: (quote: PersonalQuote) => void;
  onClose: () => void;
  initialQuote?: string;
  initialSource?: string;
}

const VIRTUE_OPTIONS: CardinalVirtue[] = ['wisdom', 'courage', 'justice', 'temperance'];
const SOURCE_OPTIONS: SourceType[] = ['practice', 'manual', 'email', 'community', 'book', 'sermon'];

const FRUIT_OPTIONS: FruitOfSpirit[] = [
  'love', 'joy', 'peace', 'patience', 'kindness', 
  'goodness', 'faithfulness', 'gentleness', 'self-control'
];

const WISDOM_OPTIONS: WisdomTag[] = [
  'stoicism', 'mindfulness', 'resilience', 'growth', 'purpose',
  'philosophy', 'meditation', 'reflection', 'acceptance', 'discipline'
];

export default function QuoteCapture({ onQuoteAdded, onClose, initialQuote = '', initialSource = '' }: QuoteCaptureProps) {
  const [formData, setFormData] = useState({
    content: initialQuote,
    source: initialSource,
    sourceType: 'manual' as SourceType,
    door: 'secular' as 'christian' | 'secular',
    primaryVirtue: 'wisdom' as CardinalVirtue,
    secondaryVirtues: [] as CardinalVirtue[],
    fruitTags: [] as FruitOfSpirit[],
    wisdomTags: [] as WisdomTag[],
    author: '',
    bibleReference: '',
    bookReference: '',
    personalNotes: '',
    isFavorite: false,
    shareLevel: 'private' as 'private' | 'community' | 'public'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'secondaryVirtues' | 'fruitTags' | 'wisdomTags', item: any) => {
    setFormData(prev => {
      const currentArray = prev[field] as any[];
      const isSelected = currentArray.includes(item);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const newQuote = await mockPersonalQuotesAPI.createQuote({
        userId: 'user-123', // Mock user ID
        content: formData.content.trim(),
        source: formData.source.trim() || undefined,
        sourceType: formData.sourceType,
        door: formData.door,
        primaryVirtue: formData.primaryVirtue,
        secondaryVirtues: formData.secondaryVirtues.length > 0 ? formData.secondaryVirtues : undefined,
        fruitTags: formData.door === 'christian' && formData.fruitTags.length > 0 ? formData.fruitTags : undefined,
        wisdomTags: formData.door === 'secular' && formData.wisdomTags.length > 0 ? formData.wisdomTags : undefined,
        author: formData.author.trim() || undefined,
        bibleReference: formData.bibleReference.trim() || undefined,
        bookReference: formData.bookReference.trim() || undefined,
        personalNotes: formData.personalNotes.trim() || undefined,
        isFavorite: formData.isFavorite,
        shareLevel: formData.shareLevel
      });

      onQuoteAdded(newQuote);
    } catch (error) {
      console.error('Failed to save quote:', error);
      // In a real app, show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.content.trim().length > 0;
      case 2:
        return true; // Classification is optional
      case 3:
        return true; // Tags are optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-gold-600" />
            Capture New Quote
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Step {currentStep} of {totalSteps}</span>
            <div className="flex-1 h-1 bg-sand-200 rounded-full ml-4">
              <div 
                className="h-full bg-gradient-to-r from-gold-500 to-olive-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: Quote Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-slate-700">
                Quote Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the meaningful quote or verse..."
                className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20 min-h-[120px]"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-sm font-medium text-slate-700">
                  Author
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="e.g., Marcus Aurelius"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>

              <div>
                <Label htmlFor="source" className="text-sm font-medium text-slate-700">
                  Source
                </Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  placeholder="e.g., Daily Practice Day 5"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sourceType" className="text-sm font-medium text-slate-700">
                Source Type
              </Label>
              <Select value={formData.sourceType} onValueChange={(value) => handleInputChange('sourceType', value)}>
                <SelectTrigger className="mt-1 bg-sand-50 border-sand-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      <span className="capitalize">{option}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference fields based on source type */}
            {(formData.sourceType === 'book' || formData.sourceType === 'sermon') && (
              <div>
                <Label htmlFor="bookReference" className="text-sm font-medium text-slate-700">
                  Book Reference
                </Label>
                <Input
                  id="bookReference"
                  value={formData.bookReference}
                  onChange={(e) => handleInputChange('bookReference', e.target.value)}
                  placeholder="e.g., Meditations, Chapter 4"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Classification */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Path Selection */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Spiritual Path
              </Label>
              <Tabs value={formData.door} onValueChange={(value) => handleInputChange('door', value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="christian" className="flex items-center gap-2">
                    <HeartIcon className="w-4 h-4" />
                    Christian
                  </TabsTrigger>
                  <TabsTrigger value="secular" className="flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" />
                    Secular
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Bible Reference for Christian path */}
            {formData.door === 'christian' && (
              <div>
                <Label htmlFor="bibleReference" className="text-sm font-medium text-slate-700">
                  Bible Reference
                </Label>
                <Input
                  id="bibleReference"
                  value={formData.bibleReference}
                  onChange={(e) => handleInputChange('bibleReference', e.target.value)}
                  placeholder="e.g., Matthew 11:28"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>
            )}

            {/* Primary Virtue */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Primary Virtue
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {VIRTUE_OPTIONS.map(virtue => (
                  <button
                    key={virtue}
                    onClick={() => handleInputChange('primaryVirtue', virtue)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.primaryVirtue === virtue
                        ? 'border-gold-400 bg-gold-50'
                        : 'border-sand-300 hover:border-sand-400'
                    }`}
                  >
                    <VirtueTag virtue={virtue} size="md" className="w-full justify-center" />
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Virtues */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Secondary Virtues (Optional)
              </Label>
              <div className="flex flex-wrap gap-2">
                {VIRTUE_OPTIONS.filter(v => v !== formData.primaryVirtue).map(virtue => (
                  <button
                    key={virtue}
                    onClick={() => toggleArrayItem('secondaryVirtues', virtue)}
                    className={`transition-all duration-200 ${
                      formData.secondaryVirtues.includes(virtue)
                        ? 'ring-2 ring-gold-400 ring-offset-1'
                        : 'hover:scale-105 opacity-70'
                    }`}
                  >
                    <VirtueTag virtue={virtue} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tags & Notes */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Tags based on path */}
            {formData.door === 'christian' ? (
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Fruit of the Spirit (Optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FRUIT_OPTIONS.map(fruit => (
                    <button
                      key={fruit}
                      onClick={() => toggleArrayItem('fruitTags', fruit)}
                      className={`transition-all duration-200 ${
                        formData.fruitTags.includes(fruit)
                          ? 'ring-2 ring-gold-400 ring-offset-1'
                          : 'hover:scale-105 opacity-70'
                      }`}
                    >
                      <FruitTag tag={fruit} type="fruit" size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Wisdom Tags (Optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {WISDOM_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleArrayItem('wisdomTags', tag)}
                      className={`transition-all duration-200 ${
                        formData.wisdomTags.includes(tag)
                          ? 'ring-2 ring-gold-400 ring-offset-1'
                          : 'hover:scale-105 opacity-70'
                      }`}
                    >
                      <FruitTag tag={tag} type="wisdom" size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Notes */}
            <div>
              <Label htmlFor="personalNotes" className="text-sm font-medium text-slate-700">
                Personal Notes (Optional)
              </Label>
              <Textarea
                id="personalNotes"
                value={formData.personalNotes}
                onChange={(e) => handleInputChange('personalNotes', e.target.value)}
                placeholder="Why is this quote meaningful to you? How does it apply to your life?"
                className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Options
                </Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) => handleInputChange('isFavorite', e.target.checked)}
                      className="rounded border-sand-300 text-gold-600 focus:ring-gold-500"
                    />
                    <span className="text-sm text-slate-700">Mark as favorite</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="shareLevel" className="text-sm font-medium text-slate-700">
                  Share Level
                </Label>
                <Select value={formData.shareLevel} onValueChange={(value) => handleInputChange('shareLevel', value)}>
                  <SelectTrigger className="mt-1 bg-sand-50 border-sand-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Only me)</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn-primary"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save Quote'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
