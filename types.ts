
export interface UploadedFile {
  name: string;
  content: string;
  type: string;
}

export interface ProjectState {
  id: string;
  name: string;
  description: string;
  files: UploadedFile[];
  createdAt: number;
  url: string;
}

export enum PricingPlan {
  FREE = 'Free',
  COMMUNITY = 'Community'
}
