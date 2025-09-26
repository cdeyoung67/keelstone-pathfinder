import { PersonalQuote, Testimony, PersonalCollection, CardinalVirtue, FruitOfSpirit, WisdomTag } from '@/lib/types-personal';

// Mock Personal Quotes Data
export const mockPersonalQuotes: PersonalQuote[] = [
  // Christian Quotes
  {
    id: "pq-1",
    userId: "user-123",
    content: "Today I will practice steadiness — small, consistent, unhurried.",
    source: "Daily Practice Day 3",
    sourceType: "practice",
    primaryVirtue: "temperance",
    secondaryVirtues: ["wisdom"],
    fruitTags: ["patience", "self-control"],
    door: "christian",
    dateAdded: new Date("2024-01-15"),
    isFavorite: true,
    personalNotes: "This really helped during my stressful week at work. I keep coming back to 'unhurried' - it's so counter-cultural.",
    shareLevel: "private"
  },
  {
    id: "pq-2",
    userId: "user-123",
    content: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    source: "Manual Entry",
    sourceType: "manual",
    primaryVirtue: "courage",
    fruitTags: ["faithfulness", "peace"],
    door: "christian",
    dateAdded: new Date("2024-01-18"),
    isFavorite: true,
    personalNotes: "Joshua 1:9 - This verse carried me through my job interview.",
    shareLevel: "community",
    author: "Joshua",
    bibleReference: "Joshua 1:9"
  },
  {
    id: "pq-3",
    userId: "user-123",
    content: "Grace is not opposed to effort, it is opposed to earning.",
    source: "Sunday Sermon",
    sourceType: "sermon",
    primaryVirtue: "wisdom",
    fruitTags: ["peace"],
    door: "christian",
    dateAdded: new Date("2024-01-21"),
    isFavorite: false,
    personalNotes: "Pastor John's sermon on grace vs works. Revolutionary perspective.",
    shareLevel: "private",
    author: "Dallas Willard"
  },
  {
    id: "pq-4",
    userId: "user-123",
    content: "The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    source: "Daily Practice Day 7",
    sourceType: "practice",
    primaryVirtue: "temperance",
    fruitTags: ["love", "joy", "peace", "patience", "kindness", "goodness", "faithfulness", "gentleness", "self-control"],
    door: "christian",
    dateAdded: new Date("2024-01-25"),
    isFavorite: true,
    personalNotes: "The complete list - I want to embody each of these.",
    shareLevel: "public",
    bibleReference: "Galatians 5:22-23"
  },
  
  // Secular Quotes
  {
    id: "pq-5",
    userId: "user-123",
    content: "The impediment to action advances action. What stands in the way becomes the way.",
    source: "Morning Reading",
    sourceType: "book",
    primaryVirtue: "courage",
    wisdomTags: ["stoicism", "resilience", "growth"],
    door: "secular",
    dateAdded: new Date("2024-01-20"),
    isFavorite: true,
    personalNotes: "Marcus Aurelius - This completely reframes obstacles as opportunities.",
    shareLevel: "community",
    author: "Marcus Aurelius",
    bookReference: "Meditations"
  },
  {
    id: "pq-6",
    userId: "user-123",
    content: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    source: "Daily Practice Day 12",
    sourceType: "practice",
    primaryVirtue: "wisdom",
    secondaryVirtues: ["temperance"],
    wisdomTags: ["mindfulness", "reflection"],
    door: "secular",
    dateAdded: new Date("2024-01-28"),
    isFavorite: true,
    personalNotes: "Viktor Frankl - The key to all personal growth is in that space.",
    shareLevel: "private",
    author: "Viktor Frankl"
  },
  {
    id: "pq-7",
    userId: "user-123",
    content: "Justice is the constant and perpetual will to give each person his due.",
    source: "Philosophy Study",
    sourceType: "book",
    primaryVirtue: "justice",
    wisdomTags: ["philosophy", "purpose"],
    door: "secular",
    dateAdded: new Date("2024-01-30"),
    isFavorite: false,
    personalNotes: "Justinian - Simple but profound definition of justice.",
    shareLevel: "private",
    author: "Justinian I"
  },
  {
    id: "pq-8",
    userId: "user-123",
    content: "The best time to plant a tree was 20 years ago. The second best time is now.",
    source: "Community Share",
    sourceType: "community",
    primaryVirtue: "courage",
    secondaryVirtues: ["wisdom"],
    wisdomTags: ["growth", "acceptance"],
    door: "secular",
    dateAdded: new Date("2024-02-01"),
    isFavorite: true,
    personalNotes: "Chinese Proverb - Perfect for when I'm feeling behind in life.",
    shareLevel: "public"
  },
  
  // Recent additions
  {
    id: "pq-9",
    userId: "user-123",
    content: "Come to me, all you who are weary and burdened, and I will give you rest.",
    source: "Daily Practice Day 14",
    sourceType: "practice",
    primaryVirtue: "temperance",
    fruitTags: ["peace", "gentleness"],
    door: "christian",
    dateAdded: new Date("2024-02-03"),
    isFavorite: true,
    personalNotes: "Matthew 11:28 - Exactly what I needed to hear today.",
    shareLevel: "community",
    bibleReference: "Matthew 11:28"
  },
  {
    id: "pq-10",
    userId: "user-123",
    content: "Discipline is choosing between what you want now and what you want most.",
    source: "Manual Entry",
    sourceType: "manual",
    primaryVirtue: "temperance",
    wisdomTags: ["discipline", "purpose"],
    door: "secular",
    dateAdded: new Date("2024-02-05"),
    isFavorite: false,
    personalNotes: "Heard this in a podcast - really clarifies decision-making.",
    shareLevel: "private"
  }
];

// Mock Testimonies Data
export const mockTestimonies: Testimony[] = [
  {
    id: "test-1",
    userId: "user-123",
    title: "Finding Peace in Digital Chaos",
    door: "secular",
    sections: [
      {
        id: "sec-1",
        type: "challenge",
        title: "The Overwhelm",
        content: "I was constantly overwhelmed by notifications, social media, and the pressure to always be 'on'. My mind felt scattered, jumping from one digital distraction to another. I couldn't focus on anything meaningful for more than a few minutes.",
        order: 1
      },
      {
        id: "sec-2",
        type: "discovery",
        title: "Finding the Pathfinder",
        content: "Through the Keel Stone Pathfinder, I discovered the power of small, consistent practices. The 21-day program taught me that peace isn't found in escaping technology, but in developing inner steadiness that can't be shaken by external chaos.",
        supportingQuotes: ["pq-1", "pq-6"],
        order: 2
      },
      {
        id: "sec-3",
        type: "growth",
        title: "Building New Rhythms",
        content: "I learned to create sacred pauses throughout my day. Instead of immediately reacting to every notification, I practiced finding that space between stimulus and response. This simple shift transformed my entire relationship with technology and stress.",
        supportingQuotes: ["pq-6"],
        order: 3
      },
      {
        id: "sec-4",
        type: "integration",
        title: "A New Way of Living",
        content: "Now I approach each day with intentional rhythms. I start with reflection, work with focus, and end with gratitude. The chaos is still there, but I'm no longer controlled by it. I've found my center.",
        order: 4
      },
      {
        id: "sec-5",
        type: "sharing",
        title: "An Invitation to Peace",
        content: "If you're feeling overwhelmed by the pace of modern life, there is another way. The tools and community at Keel Stone can help you find the inner steadiness you're looking for. You don't have to stay scattered forever.",
        order: 5
      }
    ],
    status: "community",
    dateCreated: new Date("2024-01-20"),
    lastUpdated: new Date("2024-01-25"),
    shareCount: 12,
    invitesGenerated: 5,
    viewCount: 47,
    themes: ["digital-wellness", "mindfulness", "stress-management"],
    virtuesHighlighted: ["temperance", "wisdom"],
    summary: "A journey from digital overwhelm to inner peace through contemplative practices.",
    featuredQuoteId: "pq-6"
  },
  {
    id: "test-2",
    userId: "user-123",
    title: "Grace in the Midst of Failure",
    door: "christian",
    sections: [
      {
        id: "sec-6",
        type: "before",
        title: "Perfectionism's Prison",
        content: "I lived under the crushing weight of perfectionism, believing that my worth came from my performance. Every mistake felt like a moral failure, every setback like evidence of God's disappointment in me.",
        order: 1
      },
      {
        id: "sec-7",
        type: "journey",
        title: "Meeting Grace",
        content: "Through the Christian path in Pathfinder, I encountered the radical truth that grace is not opposed to effort, but to earning. God's love isn't something I achieve through perfect behavior—it's something I receive through faith.",
        supportingQuotes: ["pq-3"],
        order: 2
      },
      {
        id: "sec-8",
        type: "transformation",
        title: "Learning to Rest",
        content: "Jesus' invitation to 'come to me, all you who are weary' became my daily anchor. I learned that rest isn't laziness—it's trust. I began to see my struggles not as failures, but as opportunities to experience God's faithfulness.",
        supportingQuotes: ["pq-9", "pq-2"],
        order: 3
      },
      {
        id: "sec-9",
        type: "current",
        title: "Walking in Freedom",
        content: "Now I approach each day knowing that I am deeply loved, not for what I do, but for who I am in Christ. This freedom has transformed not just how I see myself, but how I treat others—with the same grace I've received.",
        order: 4
      },
      {
        id: "sec-10",
        type: "invitation",
        title: "Come and Rest",
        content: "If you're tired of trying to earn love through performance, Jesus is calling you to rest. The Keel Stone community has been a safe place for me to explore this grace—perhaps it can be for you too.",
        order: 5
      }
    ],
    status: "draft",
    dateCreated: new Date("2024-02-01"),
    lastUpdated: new Date("2024-02-05"),
    shareCount: 0,
    invitesGenerated: 0,
    viewCount: 0,
    themes: ["perfectionism", "grace", "identity", "rest"],
    virtuesHighlighted: ["wisdom", "temperance"],
    summary: "A journey from perfectionism to grace through encountering God's unconditional love.",
    featuredQuoteId: "pq-9"
  }
];

// Mock Personal Collection Statistics
export const mockPersonalCollection: PersonalCollection = {
  totalQuotes: 10,
  favoriteQuotes: 6,
  quotesThisWeek: 3,
  testimonies: 2,
  virtueBreakdown: {
    wisdom: 3,
    courage: 3,
    justice: 1,
    temperance: 3
  },
  recentActivity: mockPersonalQuotes.slice(0, 5)
};

// Utility functions for mock data
export const getQuotesByVirtue = (virtue: CardinalVirtue): PersonalQuote[] => {
  return mockPersonalQuotes.filter(quote => 
    quote.primaryVirtue === virtue || quote.secondaryVirtues?.includes(virtue)
  );
};

export const getFavoriteQuotes = (): PersonalQuote[] => {
  return mockPersonalQuotes.filter(quote => quote.isFavorite);
};

export const getQuotesByDoor = (door: 'christian' | 'secular'): PersonalQuote[] => {
  return mockPersonalQuotes.filter(quote => quote.door === door);
};

export const getRecentQuotes = (limit: number = 5): PersonalQuote[] => {
  return mockPersonalQuotes
    .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
    .slice(0, limit);
};

export const searchQuotes = (searchTerm: string): PersonalQuote[] => {
  const term = searchTerm.toLowerCase();
  return mockPersonalQuotes.filter(quote =>
    quote.content.toLowerCase().includes(term) ||
    quote.personalNotes?.toLowerCase().includes(term) ||
    quote.source?.toLowerCase().includes(term) ||
    quote.author?.toLowerCase().includes(term)
  );
};

// Mock API functions (for future Azure integration)
export const mockPersonalQuotesAPI = {
  async getQuotes(userId: string, filters?: any): Promise<PersonalQuote[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPersonalQuotes;
  },

  async createQuote(quote: Omit<PersonalQuote, 'id' | 'dateAdded'>): Promise<PersonalQuote> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newQuote: PersonalQuote = {
      ...quote,
      id: `pq-${Date.now()}`,
      dateAdded: new Date()
    };
    mockPersonalQuotes.unshift(newQuote);
    return newQuote;
  },

  async updateQuote(id: string, updates: Partial<PersonalQuote>): Promise<PersonalQuote> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockPersonalQuotes.findIndex(q => q.id === id);
    if (index >= 0) {
      mockPersonalQuotes[index] = { ...mockPersonalQuotes[index], ...updates };
      return mockPersonalQuotes[index];
    }
    throw new Error('Quote not found');
  },

  async deleteQuote(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockPersonalQuotes.findIndex(q => q.id === id);
    if (index >= 0) {
      mockPersonalQuotes.splice(index, 1);
    }
  }
};

export const mockTestimoniesAPI = {
  async getTestimonies(userId: string): Promise<Testimony[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTestimonies;
  },

  async createTestimony(testimony: Omit<Testimony, 'id' | 'dateCreated' | 'lastUpdated' | 'shareCount' | 'invitesGenerated' | 'viewCount'>): Promise<Testimony> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTestimony: Testimony = {
      ...testimony,
      id: `test-${Date.now()}`,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      shareCount: 0,
      invitesGenerated: 0,
      viewCount: 0
    };
    mockTestimonies.unshift(newTestimony);
    return newTestimony;
  },

  async updateTestimony(id: string, updates: Partial<Testimony>): Promise<Testimony> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTestimonies.findIndex(t => t.id === id);
    if (index >= 0) {
      mockTestimonies[index] = { 
        ...mockTestimonies[index], 
        ...updates,
        lastUpdated: new Date()
      };
      return mockTestimonies[index];
    }
    throw new Error('Testimony not found');
  }
};
