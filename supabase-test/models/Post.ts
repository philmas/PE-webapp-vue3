import { UserData } from './UserData';

export interface Post {
  id: number;
  title: string;
  content: Object;
  news_type: 'blog'; // todo: add enum of types
  banner_id: string;

  created_at: string;
  updated_at: string;
  publish_data?: string;

  author_is_user: boolean;
  author_is_ope: boolean;
  user_author?: UserData;
  group_author?: Object;

  kudos: string[];

  comments_allowed: boolean;
}
