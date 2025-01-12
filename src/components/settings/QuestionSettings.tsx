import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

interface QuestionSettingsProps {
  questions: string[];
  onQuestionsChange: (questions: string[]) => void;
}

export const QuestionSettings = ({ questions, onQuestionsChange }: QuestionSettingsProps) => {
  const addQuestion = () => {
    onQuestionsChange([...questions, "New question"]);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    onQuestionsChange(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(newQuestions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Reflection Questions</h3>
        <Button variant="outline" size="sm" onClick={addQuestion}>
          <Plus className="w-4 h-4 mr-1" /> Add Question
        </Button>
      </div>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => updateQuestion(index, e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeQuestion(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};