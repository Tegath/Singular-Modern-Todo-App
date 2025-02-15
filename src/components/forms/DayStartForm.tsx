import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DayStartFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export const DayStartForm = ({ isOpen, onClose, onSubmit }: DayStartFormProps) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const questions = [
    {
      id: 'purpose',
      label: "Quelle est mon major definite purpose ? Qu'est-ce que je souhaite accomplir ?",
    },
    {
      id: 'values',
      label: "Quelles sont mes cores values ? Qu'est-ce qui est important pour moi ?",
    },
    {
      id: 'standards',
      label: "Quelles sont les standards que je m'impose pour mon travail ?",
    },
    {
      id: 'improvements',
      label: "Quelles sont 5 manières dont je vais améliorer la qualité de mon travail aujourd'hui ?",
    },
    {
      id: 'learnings',
      label: "Quelles sont 3 choses ou plus que j'ai appris récemment ?",
    },
    {
      id: 'leadMagnets',
      label: "Comment est-ce que je vais rendre mes Lead magnets meilleures ?",
    },
    {
      id: 'commitment1',
      label: "Le standard est de travailler entre 5 et 9 heures par jour minimum en utilisant un timer et remplir ce formulaire après chaque pause. Développer cette habitude de travail va t'amener dans le top 0,1% des professionnels et t'ouvrir nombre de possibilités en tant qu'individu. Est-ce que cela fait sens ?",
    },
    {
      id: 'commitment2',
      label: "Travailler de cette manière peut sembler difficile au départ, bordélique au milieu et facile à la fin. Comme chaque habitudes, plus tu le fais, plus c'est simple. Est-ce que tu comprends ?",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Start of Day
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-4 pb-24">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {q.label}
                </label>
                <Textarea
                  required
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [q.id]: e.target.value
                  }))}
                  className="min-h-[100px] bg-white border-gray-200 focus:border-primary focus:ring-primary resize-none"
                  placeholder="Your response..."
                />
              </div>
            ))}
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
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onSubmit(answers);
                  setAnswers({});
                  onClose();
                }}
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