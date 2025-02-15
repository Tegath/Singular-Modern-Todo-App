export const saveSubmissions = (submissions: Submission[]) => {
  localStorage.setItem('submissions', JSON.stringify(submissions));
};

export const loadSubmissions = (): Submission[] => {
  const saved = localStorage.getItem('submissions');
  return saved ? JSON.parse(saved) : [];
}; 