'use client';

import { useState } from 'react';
import { Testimony } from '@/lib/types-personal';
import { mockTestimonies } from '@/lib/mock-data/personal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VirtueTag from '../shared/VirtueTag';
import { 
  PlusIcon,
  HeartIcon,
  EyeIcon,
  ShareIcon,
  PencilIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function TestimonyDashboard() {
  const [testimonies] = useState<Testimony[]>(mockTestimonies);

  const TestimonyCard = ({ testimony }: { testimony: Testimony }) => (
    <Card className="card-elevated hover:shadow-large transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif text-navy-900 mb-1">
              {testimony.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              {testimony.door === 'christian' ? 'Christian Path' : 'Secular Path'} • 
              {testimony.sections.length} sections
            </CardDescription>
          </div>
          <Badge 
            variant="secondary"
            className={`text-xs px-2 py-1 ${
              testimony.status === 'draft' 
                ? 'bg-yellow-100 text-yellow-800'
                : testimony.status === 'private'
                ? 'bg-gray-100 text-gray-800'
                : testimony.status === 'community'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {testimony.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        {testimony.summary && (
          <p className="text-sm text-slate-700 line-clamp-2">
            {testimony.summary}
          </p>
        )}

        {/* Themes */}
        {testimony.themes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {testimony.themes.slice(0, 3).map(theme => (
              <Badge key={theme} variant="secondary" className="text-xs bg-sand-100 text-sand-800">
                {theme.replace('-', ' ')}
              </Badge>
            ))}
            {testimony.themes.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-sand-100 text-sand-800">
                +{testimony.themes.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Virtues */}
        {testimony.virtuesHighlighted.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {testimony.virtuesHighlighted.map(virtue => (
              <VirtueTag key={virtue} virtue={virtue} size="sm" />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-sand-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{testimony.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <ShareIcon className="w-4 h-4" />
              <span>{testimony.shareCount}</span>
            </div>
          </div>
          <div className="text-xs">
            Updated {testimony.lastUpdated.toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {testimony.status !== 'draft' && (
            <Button variant="outline" size="sm">
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-title text-navy-900">Your Testimonies</h2>
          <p className="text-sm text-slate-600">
            Share your journey and inspire others
          </p>
        </div>
        <Button className="btn-primary" size="sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Testimony
        </Button>
      </div>

      {/* Testimonies Grid */}
      {testimonies.length === 0 ? (
        <Card className="card text-center py-12">
          <CardContent>
            <HeartIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No testimonies yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Share your story of transformation and growth. Your testimony could inspire others on their journey.
            </p>
            <Button className="btn-primary">
              <PlusIcon className="w-4 h-4 mr-2" />
              Write Your First Testimony
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonies.map(testimony => (
            <TestimonyCard key={testimony.id} testimony={testimony} />
          ))}
        </div>
      )}

      {/* Help Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <DocumentTextIcon className="w-5 h-5" />
            Writing Your Testimony
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 text-sm mb-4">
            A testimony is your personal story of growth, challenge, and transformation. 
            It's a powerful way to reflect on your journey and inspire others.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Christian Framework:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Life before encountering grace</li>
                <li>• How God met you in struggle</li>
                <li>• The journey of transformation</li>
                <li>• How faith shapes daily life</li>
                <li>• Invitation to others</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Secular Framework:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• The challenge you faced</li>
                <li>• Practices that helped</li>
                <li>• How you developed new perspectives</li>
                <li>• How changes improved your life</li>
                <li>• How others can benefit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
