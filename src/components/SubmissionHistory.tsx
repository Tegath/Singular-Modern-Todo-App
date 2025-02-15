import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sendToWebhook } from '@/utils/webhook';

interface Submission {
  id: string;
  title: string;
  content: string[];      // Array of answers from the form
  timestamp: string;
  duration: number;
  completed: boolean;
  questions: string[];
  taskContent?: string;   // Add this field to store the task content
}

interface SubmissionHistoryProps {
  submissions: Submission[];
  onClearHistory?: () => void; // Optional callback to clear history
  webhookUrl?: string; // Add this prop
}

export const SubmissionHistory = ({ 
  submissions, 
  onClearHistory,
  webhookUrl 
}: SubmissionHistoryProps) => {
  // Group submissions by date
  const groupedSubmissions = React.useMemo(() => {
    return submissions.reduce((acc, submission) => {
      const date = new Date(submission.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(submission);
      return acc;
    }, {} as Record<string, Submission[]>);
  }, [submissions]);

  const renderTaskContent = (content: string) => {
    const lines = content.split('\n');
    const checkboxPattern = /^(\s*)-\s*\[([ x])\]\s*(.+)$/;

    return (
      <div className="space-y-1 mt-2">
        {lines.map((line, index) => {
          const match = line.match(checkboxPattern);
          if (match) {
            const [, indent, checkState, label] = match;
            const isChecked = checkState === 'x';
            return (
              <div
                key={index}
                className="flex items-start gap-2"
                style={{ marginLeft: indent.length * 8 }}
              >
                <div className={`
                  w-4 h-4 mt-0.5 rounded border flex items-center justify-center
                  ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
                `}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 14 14">
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {label}
                </span>
              </div>
            );
          }
          return (
            <div key={index} className="text-sm text-gray-700 whitespace-pre-wrap">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  const handleShare = async () => {
    if (!webhookUrl) {
      alert('Please configure a webhook URL in settings');
      return;
    }

    try {
      await sendToWebhook(submissions, webhookUrl);
      alert('Successfully shared your focus history!');
    } catch (error) {
      console.error('Error sending webhook:', error);
      alert('Failed to share focus history. Please try again.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-10 h-10 rounded-full bg-white hover:bg-gray-50"
        >
          <History className="h-5 w-5 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Focus Session History
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {Object.entries(groupedSubmissions).map(([date, dateSubmissions]) => (
            <div key={date} className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-4">{date}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[400px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dateSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {new Date(submission.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{submission.title}</TableCell>
                      <TableCell>{submission.duration} min</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.completed 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {submission.completed ? 'Completed' : 'Partial'}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[400px]">
                        {submission.taskContent && (
                          <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="font-medium text-sm text-gray-600 mb-2">Task List:</div>
                            {renderTaskContent(submission.taskContent)}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          {submission.questions.map((question, index) => (
                            <div key={index} className="mb-2">
                              <div className="font-medium">{question}</div>
                              <div className="whitespace-pre-wrap">{submission.content[index]}</div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="px-6 py-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-800"
                  onClick={onClearHistory}
                >
                  Clear History
                </Button>
                <Button
                  variant="outline"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={handleShare}
                >
                  Share History
                </Button>
              </div>
              <Button
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => document.querySelector('[role="dialog"]')?.closest('button')?.click()}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};