import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DayEndFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export const DayEndForm = ({ isOpen, onClose, onSubmit }: DayEndFormProps) => {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const questions = [
    {
      id: 'videoImprovement',
      label: "Qu'est-ce qui est meilleur dans ma vidéo d'aujourd'hui ? Etait-ce 10% mieux?",
    },
    {
      id: 'docsImprovement',
      label: "Qu'est-ce que j'ai amélioré dans les documents aujourd'hui par rapport à hier ? L'amélioration était-elle d'au moins 10 % ?",
    },
    {
      id: 'emailImprovement',
      label: "Qu'est-ce que mon script d'envoi d'e-mails à froid a de mieux aujourd'hui qu'hier ? Était-il meilleur d'au moins 10 % ?",
    },
    {
      id: 'focusedWork',
      label: "Ai-je le sentiment d'avoir accompli au moins 300 minutes de travail ciblé aujourd'hui ? Pourquoi est-ce que je pense cela ?",
    },
    {
      id: 'tomorrow',
      label: "Quelles tâches vais-je accomplir demain ?",
    },
    {
      id: 'learnings',
      label: "Notes et liste tout ce que tu as appris d'aujourd'hui :",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            End of Day Reflection
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable content with padding bottom for button space */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-4 pb-24"> {/* Increased padding bottom */}
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{q.label}</label>
                <Textarea
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

        {/* Fixed button area with shadow and backdrop blur */}
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