import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "../../types/task";

interface PostPomodoroFormProps {
  isOpen: boolean;
  onClose: () => void;
  questions: string[];
  onSubmit: (answers: string[], completedTasks: string[]) => void;
  activeTask?: Task;
}

export const PostPomodoroForm = ({ 
  isOpen, 
  onClose, 
  questions, 
  onSubmit,
  activeTask 
}: PostPomodoroFormProps) => {
  const [answers, setAnswers] = React.useState<string[]>(questions.map(() => ''));
  const completedTasks = React.useMemo(() => {
    if (!activeTask?.content) return [];
    return activeTask.content
      .split('\n')
      .filter(line => line.includes('[x]'))
      .map(line => line.replace(/- \[x\] /, ''));
  }, [activeTask?.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers, completedTasks);
    setAnswers(questions.map(() => '')); // Reset form
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Focus Session Complete
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-4 pb-24">
            <form onSubmit={handleSubmit} className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {question}
                  </label>
                  <Textarea
                    required
                    value={answers[index]}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    className="min-h-[100px] bg-white border-gray-200 focus:border-primary focus:ring-primary resize-none"
                    placeholder="Your response..."
                  />
                </div>
              ))}
            </form>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 