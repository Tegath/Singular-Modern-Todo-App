import { Submission } from '@/types';
import { sendToWebhook } from './webhook';

export class SubmissionScheduler {
  private timer: NodeJS.Timeout | null = null;
  private webhookUrl: string;
  private getSubmissions: () => Submission[];

  constructor(webhookUrl: string, getSubmissions: () => Submission[]) {
    this.webhookUrl = webhookUrl;
    this.getSubmissions = getSubmissions;
    this.scheduleNextRun();
  }

  private scheduleNextRun() {
    // Get current time in Paris timezone
    const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' });
    const currentTime = new Date(now);
    
    // Set target time to 22:00 Paris time
    const targetTime = new Date(now);
    targetTime.setHours(22, 0, 0, 0);

    // If it's past 22:00, schedule for next day
    if (currentTime.getHours() >= 22) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    // Calculate delay until next run
    const delay = targetTime.getTime() - currentTime.getTime();

    // Schedule next run
    this.timer = setTimeout(() => {
      this.sendDailySummary();
      this.scheduleNextRun(); // Schedule next day's run
    }, delay);
  }

  private async sendDailySummary() {
    const lastSent = localStorage.getItem('lastSubmissionSent');
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Europe/Paris' });
    
    if (lastSent === today) {
      console.log('Already sent today\'s summary');
      return;
    }

    try {
      const submissions = this.getSubmissions();
      await sendToWebhook(submissions, this.webhookUrl);
      localStorage.setItem('lastSubmissionSent', today);
      console.log('Daily summary sent successfully');
    } catch (error) {
      console.error('Failed to send daily summary:', error);
      setTimeout(() => this.sendDailySummary(), 5 * 60 * 1000);
    }
  }

  public updateWebhookUrl(newUrl: string) {
    this.webhookUrl = newUrl;
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
} 