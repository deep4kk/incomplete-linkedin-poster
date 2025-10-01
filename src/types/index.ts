export interface Post {
  id: string;
  niche: string;
  content: string;
  status: 'generated' | 'approved' | 'posted' | 'rejected';
  generated_at: string;
  approved_at?: string;
  posted_at?: string;
  linkedin_post_id?: string;
  engagement_data?: Record<string, any>;
  created_at: string;
}

export interface PostLog {
  id: string;
  post_id: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
  linkedin_posts?: Post;
}

export interface Stats {
  total: number;
  generated: number;
  approved: number;
  posted: number;
  rejected: number;
}

