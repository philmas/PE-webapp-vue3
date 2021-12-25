import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

import { Comment, CommentInterface } from "@/models/comment";
import { UserData, UserDataInterface } from "@/models/userData";
import { nowDateString } from "~~/util/nowDateString";

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { JSONContent } from "@tiptap/core";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";

export type Filter = PostgrestFilterBuilder<PostInterface>;
export type Query = (query: Filter) => Filter;

// New post without data
export const newEmptyBlog = (): PostInterface => {
  return {
    title: "",
    content: { type: "doc", content: [{ type: "paragraph" }] },
    news_type: "blog", // todo: add enum of types
    has_banner: false,

    created_at: nowDateString(),
    updated_at: nowDateString(),
    publish_date: null,

    author_is_user: true,
    author_is_ope: false,
    user_author: useUser().value.id,
    group_author: null,

    kudos: [],

    comments_allowed: true,
  };
};

export interface PostInterface {
  id?: number;
  title: string;
  content: JSONContent;
  news_type: "blog"; // todo: add enum of types
  has_banner: boolean;

  created_at: string;
  updated_at: string;
  publish_date?: string;

  author_is_user: boolean;
  author_is_ope: boolean;
  user_author?: UserDataInterface | string;
  group_author?: Object;

  kudos: string[];

  comments_allowed: boolean;
}

export class Post implements PostInterface {
  id: number;
  title: string;
  content: JSONContent;
  news_type: "blog"; // todo: add enum of types
  has_banner: boolean;

  created_at: string;
  updated_at: string;
  publish_date?: string;

  author_is_user: boolean;
  author_is_ope: boolean;
  user_author?: UserData | string;
  user_author_id: string;
  group_author?: Object;

  kudos: string[];

  comments_allowed: boolean;

  htmlContent: string;
  endpoint: SupabaseQueryBuilder<PostInterface>;

  constructor(post: PostInterface) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.news_type = post.news_type;
    this.has_banner = post.has_banner;
    this.created_at = post.created_at;
    this.updated_at = post.updated_at;
    this.publish_date = post.publish_date;
    this.author_is_user = post.author_is_user;
    this.author_is_ope = post.author_is_ope;
    this.group_author = post.group_author;
    this.kudos = post.kudos;
    this.comments_allowed = post.comments_allowed;

    this.endpoint = useSupabase().from<PostInterface>("News_items");

    if (!post.user_author) this.user_author == null;
    else if (typeof post.user_author == "string") {
      this.user_author = post.user_author;
      this.user_author_id = post.user_author;
    } else if (typeof post.user_author == "object") {
      this.user_author = new UserData(post.user_author as UserDataInterface);
      this.user_author_id = post.user_author.id;
    }

    this.htmlContent = generateHTML(post.content, [StarterKit]);
  }

  static getEndpoint(): SupabaseQueryBuilder<PostInterface> {
    const supabase = useSupabase();
    return supabase.from<PostInterface>("News_items");
  }

  async bannerUrl(): Promise<string> {
    if (!this.has_banner) return;

    const storage = useStorage();
    const { signedURL, error } = await storage
      .from("blogs")
      .createSignedUrl(+this.id + "/banner", 60);

    if (error) return;
    return signedURL;
  }

  // TODO: @philmas wilde hier nog mooie formating maken
  static formatDate(date: string): string {
    if (!date || !new Date(date)) return "Nog niet gepubliceerd";

    const now = new Date();
    const dateObj = new Date(date);
    const toString = dateObj.toDateString();

    if (dateObj > now) return "Wordt gepubliceerd op " + toString;
    return toString;
  }

  isOwner(): boolean {
    const user = useUser();
    if (!user?.value || !this.user_author) return false;

    if (typeof this.user_author == "string")
      return user.value.id == this.user_author;

    if (typeof this.user_author == "object")
      return user.value.id == this.user_author.id;

    return false; // should never reach this
  }

  // Get all comments from this post
  async fetchComments(): Promise<Comment[]> {
    const supabase = useSupabase();
    const { data } = await supabase
      .from<CommentInterface>("News_comments")
      .select("*")
      .eq("news_item", this.id)
      .order("created_at", { ascending: false });

    if (!data) return null;
    return data.map((comment) => new Comment(comment));
  }

  static async fetch(id: number, where: Query = null): Promise<Post> {
    const supabase = useSupabase();

    let query = supabase
      .from<PostInterface>("News_items")
      .select("*, user_author (*)")
      .eq("id", id);

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
      .from<PostInterface>("News_items")
      .select("*, user_author (*)")
      .order("created_at", { ascending: false });

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
      .from<PostInterface>("News_items")
      .select("*, user_author (*)")
      .order("created_at", { ascending: false })
      .gte("id", from);

    // modify query with where
    if (where) query = where(query);

    const { data } = await query.limit(amount);

    if (!data) return null;
    return data.map((post) => new Post(post));
  }
}
