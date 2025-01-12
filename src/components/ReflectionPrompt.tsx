import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from 'lucide-react';

interface Question {
  id: string;
  text: string;
}

interface ReflectionPromptProps {
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  onClose: () => void;
}

export const ReflectionPrompt = ({ questions, onSubmit, onClose }: ReflectionPromptProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white/90 p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
        
        <h2 className="text-xl font-semibold mb-6 text-primary-dark">Session Reflection</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {question.text}
              </label>
              <Textarea
                value={answers[question.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                placeholder="Your answer..."
                className="w-full bg-white/50"
              />
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit Reflection
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};