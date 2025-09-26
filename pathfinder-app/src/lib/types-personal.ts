// Personal Collection Types for Keel Stone Pathfinder

export type CardinalVirtue = 'wisdom' | 'courage' | 'justice' | 'temperance';

export type FruitOfSpirit = 
  | 'love' | 'joy' | 'peace' | 'patience' | 'kindness' 
  | 'goodness' | 'faithfulness' | 'gentleness' | 'self-control';

export type WisdomTag = 
  | 'stoicism' | 'mindfulness' | 'resilience' | 'growth' | 'purpose'
  | 'philosophy' | 'meditation' | 'reflection' | 'acceptance' | 'discipline';

export type SourceType = 'practice' | 'manual' | 'email' | 'community' | 'book' | 'sermon';

export type ShareLevel = 'private' | 'community' | 'public';

export interface PersonalQuote {
  id: string;
  userId: string;
  content: string;
  source?: string;
  sourceType: SourceType;
  
  // Cardinal Virtue Classification
  primaryVirtue: CardinalVirtue;
  secondaryVirtues?: CardinalVirtue[];
  
  // Fruit of the Spirit Tags (Christian)
  fruitTags?: FruitOfSpirit[];
  
  // Secular Wisdom Tags
  wisdomTags?: WisdomTag[];
  
  door: 'christian' | 'secular';
  dateAdded: Date;
  isFavorite: boolean;
  personalNotes?: string;
  shareLevel: ShareLevel;
  
  // Optional metadata
  author?: string;
  bibleReference?: string; // For Christian quotes
  bookReference?: string; // For book quotes
}

export type TestimonySectionType = 'before' | 'journey' | 'transformation' | 'current' | 'invitation' | 'challenge' | 'discovery' | 'growth' | 'integration' | 'sharing';

export interface TestimonySection {
  id: string;
  type: TestimonySectionType;
  title: string;
  content: string;
  supportingQuotes?: string[]; // References to PersonalQuote IDs
  order: number;
}

export type TestimonyStatus = 'draft' | 'private' | 'community' | 'public';

export interface Testimony {
  id: string;
  userId: string;
  title: string;
  door: 'christian' | 'secular';
  
  // Structured Content
  sections: TestimonySection[];
  
  // Metadata
  status: TestimonyStatus;
  dateCreated: Date;
  lastUpdated: Date;
  
  // Engagement
  shareCount: number;
  invitesGenerated: number;
  viewCount: number;
  
  // Tags for discovery
  themes: string[]; // 'addiction-recovery', 'career-transition', 'grief', etc.
  virtuesHighlighted: CardinalVirtue[];
  
  // Optional
  summary?: string;
  featuredQuoteId?: string;
}

export interface PersonalCollection {
  totalQuotes: number;
  favoriteQuotes: number;
  quotesThisWeek: number;
  testimonies: number;
  virtueBreakdown: Record<CardinalVirtue, number>;
  recentActivity: PersonalQuote[];
}

// Search and Filter interfaces
export interface QuoteFilters {
  virtue?: CardinalVirtue;
  fruits?: FruitOfSpirit[];
  wisdomTags?: WisdomTag[];
  sourceType?: SourceType;
  door?: 'christian' | 'secular';
  favorites?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface QuoteSearchResult {
  quotes: PersonalQuote[];
  totalCount: number;
  filters: QuoteFilters;
}
