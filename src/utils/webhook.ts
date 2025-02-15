interface WebhookPayload {
  date: string;
  submissions: {
    time: string;
    title: string;
    duration: number;
    status: string;
    completedTasks: string[];
    reflections: {
      question: string;
      answer: string;
    }[];
  }[];
}

export const sendToWebhook = async (submissions: Submission[], webhookUrl: string) => {
  // Group submissions by date
  const groupedData = submissions.reduce((acc, submission) => {
    const date = new Date(submission.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }

    // Extract completed tasks
    const completedTasks = submission.taskContent
      ?.split('\n')
      .filter(line => line.match(/^(\s*)-\s*\[x\]\s*(.+)$/))
      .map(line => line.replace(/^(\s*)-\s*\[x\]\s*/, '')) || [];

    acc[date].push({
      time: new Date(submission.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      title: submission.title,
      duration: submission.duration,
      status: submission.completed ? 'Completed' : 'Partial',
      completedTasks,
      reflections: submission.questions.map((q, i) => ({
        question: q,
        answer: submission.content[i] || ''
      }))
    });
    return acc;
  }, {} as Record<string, WebhookPayload['submissions']>);

  // Send each day's data
  for (const [date, submissions] of Object.entries(groupedData)) {
    const payload: WebhookPayload = {
      date,
      submissions
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw error;
    }
  }
}; 