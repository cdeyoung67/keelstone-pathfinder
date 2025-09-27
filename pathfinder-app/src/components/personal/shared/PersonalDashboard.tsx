'use client';

import { useState, useEffect } from 'react';
import { PersonalCollection, PersonalQuote, Testimony } from '@/lib/types-personal';
import { mockPersonalCollection, mockPersonalQuotes, mockTestimonies } from '@/lib/mock-data/personal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import VirtueTag from './VirtueTag';
import FruitTag from './FruitTag';
import QuotesDashboard from '../quotes/QuotesDashboard';
import TestimonyDashboard from '../testimony/TestimonyDashboard';
import { 
  BookOpenIcon,
  HeartIcon,
  SparklesIcon,
  PlusIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function PersonalDashboard() {
  const [collection, setCollection] = useState<PersonalCollection>(mockPersonalCollection);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data loading
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCollection(mockPersonalCollection);
      setIsLoading(false);
    }, 300);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    color = "text-navy-600" 
  }: {
    title: string;
    value: number;
    description: string;
    icon: any;
    color?: string;
  }) => (
    <Card className="card-elevated hover:shadow-medium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-sand-100 to-sand-200`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecentQuoteCard = ({ quote }: { quote: PersonalQuote }) => (
    <Card className="card hover:card-elevated transition-all duration-300 cursor-pointer">
      <CardContent className="p-4">
        <blockquote className="text-sm italic text-slate-700 mb-3 line-clamp-3">
          "{quote.content}"
        </blockquote>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VirtueTag virtue={quote.primaryVirtue} size="sm" />
            {quote.isFavorite && (
              <StarIcon className="w-4 h-4 text-gold-500 fill-current" />
            )}
          </div>
          <span className="text-xs text-slate-500">
            {quote.dateAdded.toLocaleDateString()}
          </span>
        </div>
        {quote.fruitTags && quote.fruitTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {quote.fruitTags.slice(0, 2).map(fruit => (
              <FruitTag key={fruit} tag={fruit} type="fruit" size="sm" />
            ))}
            {quote.fruitTags.length > 2 && (
              <span className="text-xs text-slate-500">+{quote.fruitTags.length - 2}</span>
            )}
          </div>
        )}
        {quote.wisdomTags && quote.wisdomTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {quote.wisdomTags.slice(0, 2).map(tag => (
              <FruitTag key={tag} tag={tag} type="wisdom" size="sm" />
            ))}
            {quote.wisdomTags.length > 2 && (
              <span className="text-xs text-slate-500">+{quote.wisdomTags.length - 2}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-sand-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-sand-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-display mb-2 text-navy-900">Your Personal Collection</h1>
        <p className="text-subtitle text-slate-600">
          Wisdom gathered, insights treasured, stories shared
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card">
            <ChartBarIcon className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card">
            <BookOpenIcon className="w-4 h-4" />
            Life Verses
          </TabsTrigger>
          <TabsTrigger value="testimonies" className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card">
            <HeartIcon className="w-4 h-4" />
            Testimonies
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Quotes"
              value={collection.totalQuotes}
              description="Wisdom collected"
              icon={BookOpenIcon}
              color="text-blue-600"
            />
            <StatCard
              title="Favorites"
              value={collection.favoriteQuotes}
              description="Most treasured"
              icon={StarIcon}
              color="text-gold-600"
            />
            <StatCard
              title="This Week"
              value={collection.quotesThisWeek}
              description="Recently added"
              icon={CalendarDaysIcon}
              color="text-green-600"
            />
            <StatCard
              title="Testimonies"
              value={collection.testimonies}
              description="Stories shared"
              icon={HeartIcon}
              color="text-destructive"
            />
          </div>

          {/* Virtue Breakdown */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-gold-600" />
                Virtue Focus
              </CardTitle>
              <CardDescription>
                Your collection organized by cardinal virtues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(collection.virtueBreakdown).map(([virtue, count]) => (
                  <div key={virtue} className="text-center">
                    <VirtueTag 
                      virtue={virtue as any} 
                      size="lg" 
                      className="w-full justify-center mb-2" 
                    />
                    <p className="text-2xl font-bold text-navy-900">{count}</p>
                    <p className="text-sm text-slate-500">quotes</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest additions and insights
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('quotes')}
                className="hover:bg-sand-100"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collection.recentActivity.map(quote => (
                  <RecentQuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-elevated hover:shadow-large transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2">Add New Quote</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Capture wisdom from your readings, practices, or reflections
                </p>
                <Button className="btn-primary">
                  Add Quote
                </Button>
              </CardContent>
            </Card>

            <Card className="card-elevated hover:shadow-large transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2">Share Your Story</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Create a testimony to inspire others on their journey
                </p>
                <Button className="btn-secondary">
                  Start Writing
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quotes Tab */}
        <TabsContent value="quotes">
          <QuotesDashboard />
        </TabsContent>

        {/* Testimonies Tab */}
        <TabsContent value="testimonies">
          <TestimonyDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
