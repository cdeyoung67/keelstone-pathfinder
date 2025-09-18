'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpenIcon, MicrophoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ReflectionPromptProps {
  prompt: string;
  day: number;
  onSave: (reflection: { type: 'text' | 'audio'; content: string; timestamp: Date }) => void;
  existingReflection?: { type: 'text' | 'audio'; content: string; timestamp: Date };
}

export default function ReflectionPrompt({ 
  prompt, 
  day, 
  onSave, 
  existingReflection 
}: ReflectionPromptProps) {
  const [mode, setMode] = useState<'text' | 'audio'>('text');
  const [textReflection, setTextReflection] = useState(
    existingReflection?.type === 'text' ? existingReflection.content : ''
  );
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSaved, setIsSaved] = useState(!!existingReflection);

  const handleSaveText = () => {
    if (textReflection.trim()) {
      onSave({
        type: 'text',
        content: textReflection.trim(),
        timestamp: new Date()
      });
      setIsSaved(true);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Audio recording implementation would go here
    // For now, we'll simulate it
    setTimeout(() => {
      setIsRecording(false);
      // Simulate audio blob creation
      setAudioBlob(new Blob(['simulated audio'], { type: 'audio/wav' }));
    }, 3000);
  };

  const handleSaveAudio = () => {
    if (audioBlob) {
      onSave({
        type: 'audio',
        content: 'Audio reflection recorded', // In real implementation, this would be the audio file path/URL
        timestamp: new Date()
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif font-medium text-navy-900 flex items-center text-sm">
          <BookOpenIcon className="w-4 h-4 mr-2" />
          Reflection Prompt
        </h4>
        {isSaved && (
          <div className="flex items-center text-green-600 text-xs">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Saved
          </div>
        )}
      </div>
      
      <p className="text-sm text-blue-800 leading-relaxed mb-4">{prompt}</p>
      
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'text' | 'audio')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text" className="text-xs flex items-center gap-2">
            <BookOpenIcon className="w-3 h-3" />
            Write
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs flex items-center gap-2">
            <MicrophoneIcon className="w-3 h-3" />
            Record
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-3">
          <Textarea 
            placeholder="Share your thoughts and reflections..."
            value={textReflection}
            onChange={(e) => setTextReflection(e.target.value)}
            className="min-h-[120px] bg-white border-blue-200 focus:border-blue-400"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-blue-600">
              {textReflection.length} characters
            </span>
            <Button 
              onClick={handleSaveText}
              disabled={!textReflection.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Reflection
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-3">
          <Card className="bg-white border-blue-200">
            <CardContent className="p-4 text-center">
              {!isRecording && !audioBlob && (
                <div className="space-y-3">
                  <MicrophoneIcon className="w-12 h-12 mx-auto text-blue-400" />
                  <p className="text-sm text-slate-600">
                    Record your reflection as an audio note
                  </p>
                  <Button 
                    onClick={handleStartRecording}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MicrophoneIcon className="w-4 h-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              )}
              
              {isRecording && (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-sm text-red-600 font-medium">Recording...</p>
                  <p className="text-xs text-slate-500">Speak your reflection</p>
                </div>
              )}
              
              {audioBlob && !isSaved && (
                <div className="space-y-3">
                  <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500" />
                  <p className="text-sm text-green-600 font-medium">Recording Complete</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAudioBlob(null)}
                    >
                      Re-record
                    </Button>
                    <Button 
                      onClick={handleSaveAudio}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Audio
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <p className="text-xs text-blue-600 mt-3 italic">
        Journaling or prayer reflection - captured in app for tracking.
      </p>
    </div>
  );
}
