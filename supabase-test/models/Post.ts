import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { Comment, CommentInterface } from './comment';
import { UserData, UserDataInterface } from './userData';

import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { JSONContent } from '@tiptap/core';
import { SupabaseQueryBuilder } from '@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder';

export type Filter = PostgrestFilterBuilder<PostInterface>;
export type Query = (query: Filter) => Filter;

export interface PostInterface {
  id: number;
  title: string;
  content: JSONContent;
  news_type: 'blog'; // todo: add enum of types
  banner_id: string;

  created_at: string;
  updated_at: string;
  publish_date?: string;

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
  content: JSONContent;
  news_type: 'blog'; // todo: add enum of types
  banner_id: string;

  created_at: string;
  updated_at: string;
  publish_date?: string;

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
    this.publish_date = post.publish_date;
    this.author_is_user = post.author_is_user;
    this.author_is_ope = post.author_is_ope;
    this.user_author = new UserData(post.user_author);
    this.group_author = post.group_author;
    this.kudos = post.kudos;
    this.comments_allowed = post.comments_allowed;

    this.htmlContent = generateHTML(post.content, [StarterKit]);
  }

  static getEndpoint(): SupabaseQueryBuilder<PostInterface> {
    const supabase = useSupabase();
    return supabase.from<PostInterface>('News_items');
  }

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
    if (!date || !new Date(date)) return 'Nog niet gepubliceerd';

    const now = new Date();
    const dateObj = new Date(date);
    const toString = dateObj.toDateString();

    if (dateObj > now) return 'Wordt gepubliceerd op ' + toString;
    return toString;
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
      .select('*')
      .eq('news_item', this.id)
      .order('created_at', { ascending: false });

    if (!data) return null;
    return data.map((comment) => new Comment(comment));
  }

  static async fetch(id: number, where: Query = null): Promise<Post> {
    const supabase = useSupabase();

    let query = supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .eq('id', id);

    // modify query with where
    if (where) query = where(query);

    const { data } = await query.single();
    if (!data) return null;

    return new Post(data);
  }

  // Fetch all posts AND IF where is defined => [where] is true
  static async fetchAll(where: Query = null): Promise<Post[]> {
    const supabase = useSupabase();

    let query = supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .order('created_at', { ascending: false });

    // modify query with where
    if (where) query = where(query);

    const { data } = await query;

    if (!data) return null;
    return data.map((post) => new Post(post));
  }

  // Fetch the next [amount] of posts where id > [from] IF where is defined => [where] is true
  static async fetchNext(
    amount: number,
    from: number,
    where: Query = null
  ): Promise<Post[]> {
    const supabase = useSupabase();

    let query = supabase
      .from<PostInterface>('News_items')
      .select('*, user_author (*)')
      .order('created_at', { ascending: false })
      .gte('id', from);

    // modify query with where
    if (where) query = where(query);

    const { data } = await query.limit(amount);

    if (!data) return null;
    return data.map((post) => new Post(post));
  }
}
