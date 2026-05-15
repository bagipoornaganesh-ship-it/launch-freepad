export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  tasks: Task[];
  proTip: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  niche: string;
  status: 'Cold' | 'Contacted' | 'Replied' | 'Closed';
  contactInfo: string;
  leadSource: string;
  dateContacted: string;
  followUpDate: string;
  notes: string;
  paymentReceived: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  date: string;
  method?: string;
}

export interface Tool {
  name: string;
  useCase: string;
  cost: string;
  link: string;
  category: string;
}

export interface Platform {
  name: string;
  strategy: string;
  difficulty: string;
  expectedResponse: string;
  bestForBeginners?: boolean;
}

export interface OutreachMethod {
  id: string;
  name: string;
  description: string;
  steps: string[];
  difficulty: 'Low' | 'Medium' | 'High';
  expectedResponse: string;
}

export interface TrackLayout {
  name: string;
  type: 'Video' | 'Audio' | 'Text' | 'Graphics';
  description: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  niche?: string;
  portfolioLinks?: string[];
  intlRateCard?: RatePackage[];
  portfolioChecklist?: { id: string; completed: boolean }[];
  week2Roadmap?: { id: string; completed: boolean }[];
}

export interface RatePackage {
  id: string;
  name: string;
  price: string;
  deliverables: string[];
}

export interface FollowUpStep {
  day: number;
  type: string;
  script: string;
}

export interface Objection {
  trigger: string;
  response: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  videoType: 'Reels' | 'YouTube Intro' | 'Talking Head' | 'Vlog' | 'Ad';
  trackLayout: TrackLayout[];
  commonEffects: string[];
  proTip: string;
}

export interface OutreachChallenge {
  id: string;
  difficulty: string;
  solution: string;
  category: 'Mindset' | 'Technical' | 'Social';
}
