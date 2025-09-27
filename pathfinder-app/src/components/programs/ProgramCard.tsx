'use client';

import { useState } from 'react';
import { Program, ProgramAction } from '@/lib/types-programs';
import { 
  getProgramStatusColor, 
  getProgramTypeIcon, 
  formatProgramDuration,
  mockProgramAPI 
} from '@/lib/mock-data/programs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface ProgramCardProps {
  program: Program;
  onProgramUpdate?: (program: Program) => void;
  onProgramAction?: (programId: string, action: ProgramAction) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function ProgramCard({ 
  program, 
  onProgramUpdate,
  onProgramAction,
  showActions = true,
  compact = false
}: ProgramCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: ProgramAction) => {
    if (onProgramAction) {
      onProgramAction(program.id, action);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockProgramAPI.performAction(program.id, action);
      if (result.success && onProgramUpdate) {
        const updatedProgram = await mockProgramAPI.getProgram(program.id);
        if (updatedProgram) {
          onProgramUpdate(updatedProgram);
        }
      }
    } catch (error) {
      console.error(`Failed to perform action ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMainAction = (): { action: ProgramAction; label: string; icon: any } => {
    switch (program.status) {
      case 'draft':
        return { action: 'start', label: 'Start Program', icon: PlayIcon };
      case 'active':
        return { action: 'pause', label: 'Pause', icon: PauseIcon };
      case 'paused':
        return { action: 'resume', label: 'Resume', icon: PlayIcon };
      case 'completed':
        return { action: 'duplicate', label: 'Start Again', icon: DocumentDuplicateIcon };
      default:
        return { action: 'start', label: 'Start', icon: PlayIcon };
    }
  };

  const mainAction = getMainAction();
  const MainActionIcon = mainAction.icon;

  if (compact) {
    return (
      <Card variant="interactive" onClick={() => setIsExpanded(true)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getProgramTypeIcon(program.type)}</div>
              <div>
                <h3 className="font-medium text-sm text-card-foreground">{program.title}</h3>
                <p className="text-xs text-muted-foreground">{formatProgramDuration(program.duration)}</p>
              </div>
            </div>
            <Badge className={`text-xs ${getProgramStatusColor(program.status)}`}>
              {program.status}
            </Badge>
          </div>
          {program.progress && program.progress.completionPercentage > 0 && (
            <div className="mt-3">
              <Progress value={program.progress.completionPercentage} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="interactive">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{getProgramTypeIcon(program.type)}</div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                {program.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                {program.description}
              </CardDescription>
              {program.subtitle && (
                <p className="text-xs text-muted-foreground/80 mt-1 italic">{program.subtitle}</p>
              )}
            </div>
          </div>
          <Badge className={`${getProgramStatusColor(program.status)} text-xs font-medium`}>
            {program.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Program Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {program.duration && (
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>{formatProgramDuration(program.duration)}</span>
            </div>
          )}
          {program.estimatedTimePerDay && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{program.estimatedTimePerDay}</span>
            </div>
          )}
          {program.difficulty && (
            <Badge variant="outline" className="text-xs">
              {program.difficulty}
            </Badge>
          )}
        </div>

        {/* Progress */}
        {program.progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">
                {program.progress.completionPercentage}%
              </span>
            </div>
            <Progress value={program.progress.completionPercentage} className="h-2 mb-2" />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground/80">
              <span>
                {program.progress.completedDays.length} of {program.progress.totalDays || '∞'} days
              </span>
              {program.progress.streak > 0 && (
                <span>🔥 {program.progress.streak} day streak</span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {program.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {program.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{program.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="space-y-3">
            {/* Main Action */}
            <Button 
              onClick={() => handleAction(mainAction.action)}
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              <MainActionIcon className="w-4 h-4 mr-2" />
              {isLoading ? 'Loading...' : mainAction.label}
            </Button>

            {/* Secondary Actions */}
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <>Less <ChevronUpIcon className="w-3 h-3 ml-1" /></>
                ) : (
                  <>More <ChevronDownIcon className="w-3 h-3 ml-1" /></>
                )}
              </Button>
            </div>

            {/* Expanded Actions */}
            {isExpanded && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('share')}
                  disabled={isLoading}
                >
                  <ShareIcon className="w-3 h-3 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('duplicate')}
                  disabled={isLoading}
                >
                  <DocumentDuplicateIcon className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                {program.status !== 'archived' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('archive')}
                    disabled={isLoading}
                  >
                    <ArchiveBoxIcon className="w-3 h-3 mr-1" />
                    Archive
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('delete')}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <TrashIcon className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Program Details */}
        {isExpanded && (
          <div className="pt-4 border-t border-border mt-4">
            <div className="text-xs text-muted-foreground/80 space-y-1">
              <div>Created: {program.createdAt.toLocaleDateString()}</div>
              {program.startedAt && (
                <div>Started: {program.startedAt.toLocaleDateString()}</div>
              )}
              {program.completedAt && (
                <div>Completed: {program.completedAt.toLocaleDateString()}</div>
              )}
              {program.shareCode && (
                <div>Share Code: <code className="bg-muted px-1 rounded">{program.shareCode}</code></div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
