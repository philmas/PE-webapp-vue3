import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { Comment, CommentInterface } from './comment';
import { UserData, UserDataInterface } from './userData';

export interface PostInterface {
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
  user_author?: UserDataInterface;
  group_author?: Object;

  kudos: string[];

  comments_allowed: boolean;
}

export class Post implements PostInterface {
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

  htmlContent: string;

  constructor(post: PostInterface) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.news_type = post.news_type;
    this.banner_id = post.banner_id;
    this.created_at = post.created_at;
    this.updated_at = post.updated_at;
    this.publish_data = post.publish_data;
    this.author_is_user = post.author_is_user;
    this.author_is_ope = post.author_is_ope;
    this.user_author = new UserData(post.user_author);
    this.group_author = post.group_author;
    this.kudos = post.kudos;
    this.comments_allowed = post.comments_allowed;

    this.htmlContent = generateHTML(post.content, [StarterKit]);
  }

  // TODO: is not actualy working
  async bannerUrl(): Promise<string> {
    if (!this.banner_id) return;

    const storage = useStorage();
    const { signedURL, error } = await storage
      .from('blogs')
      .createSignedUrl(+this.id + '/' + this.banner_id, 60);

    if (error) return;
    return signedURL;
  }

  // TODO: @philmas wilde hier nog mooie formating maken
  static formatDate(date: string): string {
    if (!date) return '';

    const dateObj = new Date(date);
    return dateObj.toDateString();
  }

  isOwner(): boolean {
    const user = useUser();
    if (!user?.value) return false;
    return user.value.id === this.user_author.id;
  }

  // Get all comments from this post
  async fetchComments(): Promise<Comment[]> {
    const supabase = useSupabase();
    const { data } = await supabase
      .from<CommentInterface>('News_comments')
      .select('*, author (*), news_item (*)')
      .eq('news_item', this.id)
      .order('created_at', { ascending: false });

    if (!data) return null;
    return data.map((comment) => new Comment(comment));
  }

  static async fetch(id: number): Promise<Post> {
    const supabase = useSupabase();
    const { data } = await supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .eq('id', id)
      .single();

    if (!data) return null;

    return new Post(data);
  }

  static async fetchAll(): Promise<Post[]> {
    const supabase = useSupabase();

    const { data } = await supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .order('created_at', { ascending: false });

    if (!data) return null;
    return data.map((post) => new Post(post));
  }

  // Fetch the next [amount] of posts where id > [from]
  static async fetchNext(amount: number, from: number): Promise<Post[]> {
    const supabase = useSupabase();

    const { data } = await supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .order('created_at', { ascending: false })
      .gte('id', from)
      .limit(amount);

    if (!data) return null;
    return data.map((post) => new Post(post));
  }
}
