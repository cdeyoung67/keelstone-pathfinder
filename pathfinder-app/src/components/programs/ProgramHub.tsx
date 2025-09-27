'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Program, ProgramTemplate, ProgramStats, ProgramAction } from '@/lib/types-programs';
import { mockProgramAPI } from '@/lib/mock-data/programs';
import ProgramCard from './ProgramCard';
import ProgramTemplateCard from './ProgramTemplateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  PlusIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface ProgramHubProps {
  onCreateProgram?: () => void;
  onSelectProgram?: (program: Program) => void;
}

export default function ProgramHub({ onCreateProgram, onSelectProgram }: ProgramHubProps) {
  const { user, isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [templates, setTemplates] = useState<ProgramTemplate[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load user programs if authenticated
      if (isAuthenticated && user) {
        const [userPrograms, userStats] = await Promise.all([
          mockProgramAPI.getUserPrograms(user.id),
          mockProgramAPI.getUserStats(user.id)
        ]);
        setPrograms(userPrograms);
        setStats(userStats);
      } else {
        setPrograms([]);
        setStats(null);
      }

      // Load program templates for everyone
      const programTemplates = await mockProgramAPI.getProgramTemplates();
      setTemplates(programTemplates);
    } catch (error) {
      console.error('Failed to load program data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgramAction = async (programId: string, action: ProgramAction) => {
    try {
      const result = await mockProgramAPI.performAction(programId, action);
      if (result.success) {
        // Reload programs to get updated data
        if (isAuthenticated && user) {
          const updatedPrograms = await mockProgramAPI.getUserPrograms(user.id);
          setPrograms(updatedPrograms);
        }
      }
    } catch (error) {
      console.error(`Failed to perform action ${action}:`, error);
    }
  };

  const handleProgramUpdate = (updatedProgram: Program) => {
    setPrograms(prev => 
      prev.map(p => p.id === updatedProgram.id ? updatedProgram : p)
    );
  };

  const activePrograms = programs.filter(p => p.status === 'active');
  const completedPrograms = programs.filter(p => p.status === 'completed');
  const draftPrograms = programs.filter(p => p.status === 'draft');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">
          {isAuthenticated ? `${user?.firstName}'s Program Hub` : 'Program Hub'}
        </h1>
        <p className="text-slate-600 mb-6">
          {isAuthenticated 
            ? 'Manage your programs, track progress, and discover new practices'
            : 'Discover programs and practices to transform your daily life'
          }
        </p>
        
        {/* Create Program Button */}
        <Button 
          onClick={onCreateProgram}
          size="lg"
          className="mb-8"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Program
        </Button>
      </div>

      {/* Stats Overview (Authenticated Users) */}
      {isAuthenticated && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpenIcon className="w-5 h-5 text-primary mr-2" />
                <span className="text-2xl font-bold text-primary">{stats.activePrograms}</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Programs</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrophyIcon className="w-5 h-5 text-accent mr-2" />
                <span className="text-2xl font-bold text-accent">{stats.completedPrograms}</span>
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FireIcon className="w-5 h-5 text-destructive mr-2" />
                <span className="text-2xl font-bold text-destructive">{stats.currentStreak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border shadow-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <ChartBarIcon className="w-5 h-5 text-ring mr-2" />
                <span className="text-2xl font-bold text-ring">{stats.totalDaysCompleted}</span>
              </div>
              <p className="text-sm text-muted-foreground">Days Completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Program Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sand-200">
          <TabsTrigger value="active" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            My Programs {isAuthenticated && `(${programs.length})`}
          </TabsTrigger>
          <TabsTrigger value="discover" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Discover
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Community
          </TabsTrigger>
        </TabsList>

        {/* My Programs Tab */}
        <TabsContent value="active" className="mt-6">
          {!isAuthenticated ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RocketLaunchIcon className="w-8 h-8 text-navy-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  Sign in to Save Your Programs
                </h3>
                <p className="text-slate-600 mb-4">
                  Create an account to save your progress, sync across devices, and access your personal program library.
                </p>
                <p className="text-sm text-blue-600">
                  Look for the sign-in card in the bottom-right corner!
                </p>
              </CardContent>
            </Card>
          ) : programs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  Ready to Start Your First Program?
                </h3>
                <p className="text-slate-600 mb-4">
                  Create a personalized program or choose from our curated templates to begin your journey.
                </p>
                <Button onClick={onCreateProgram}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First Program
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Active Programs */}
              {activePrograms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-navy-900">Active Programs</h2>
                    <Badge className="bg-green-100 text-green-800">{activePrograms.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onProgramUpdate={handleProgramUpdate}
                        onProgramAction={handleProgramAction}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Draft Programs */}
              {draftPrograms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-navy-900">Draft Programs</h2>
                    <Badge className="bg-gray-100 text-gray-800">{draftPrograms.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {draftPrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onProgramUpdate={handleProgramUpdate}
                        onProgramAction={handleProgramAction}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Programs */}
              {completedPrograms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-navy-900">Completed Programs</h2>
                    <Badge className="bg-blue-100 text-blue-800">{completedPrograms.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedPrograms.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onProgramUpdate={handleProgramUpdate}
                        onProgramAction={handleProgramAction}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Program Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <ProgramTemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => onCreateProgram?.()}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">
                Community Features Coming Soon
              </h3>
              <p className="text-slate-600">
                Connect with others, share your progress, and discover programs created by the community.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
