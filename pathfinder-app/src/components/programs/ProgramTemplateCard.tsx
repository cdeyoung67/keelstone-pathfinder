'use client';

import { ProgramTemplate } from '@/lib/types-programs';
import { getProgramTypeIcon, formatProgramDuration } from '@/lib/mock-data/programs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  StarIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface ProgramTemplateCardProps {
  template: ProgramTemplate;
  onSelect: (template: ProgramTemplate) => void;
}

export default function ProgramTemplateCard({ template, onSelect }: ProgramTemplateCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="w-3 h-3 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-3 h-3 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-slate-200 relative group">
      {/* Popular Badge */}
      {template.isPopular && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white shadow-md">
            <SparklesIcon className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{getProgramTypeIcon(template.type)}</div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-navy-900">
              {template.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              {template.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Template Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-600">
              {template.duration && (
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatProgramDuration(template.duration)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{template.estimatedTime}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </Badge>
          </div>

          {/* Rating and Usage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(template.rating)}
              </div>
              <span className="text-xs text-slate-600">
                {template.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <UserGroupIcon className="w-3 h-3" />
              <span>{template.useCount.toLocaleString()} users</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onSelect(template)}
          className="w-full group-hover:bg-navy-700 transition-colors"
          size="sm"
        >
          Create Program
        </Button>
      </CardContent>
    </Card>
  );
}
