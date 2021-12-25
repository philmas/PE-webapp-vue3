export interface CommentInterface {
  id?: number;
  news_item: string;
  author: string;
  content: string;
  created_at?: string;
}

export class Comment implements CommentInterface {
  id?: number;
  news_item: string;
  author: string;
  content: string;
  created_at: string;

  endPoint = "News_comments";

  constructor(comment: CommentInterface) {
    this.id = comment.id;
    this.news_item = comment.news_item;
    this.author = comment.author;
    this.content = comment.content;
    this.created_at = comment.created_at;
  }

  isOwner(): boolean {
    const user = useUser();
    return this.author === user.value.id;
  }

  async delete(): Promise<boolean> {
    const supabase = useSupabase();
    const { error } = await supabase
      .from<CommentInterface>(this.endPoint)
      .delete()
      .eq("id", this.id);
    return !error;
  }

  static async insert(newsId: number, content: string): Promise<Comment> {
    const supabase = useSupabase();
    const user = useUser();
    const { data, error } = await supabase
      .from("News_comments")
      .insert({
        news_item: newsId,
        author: user.value.id,
        content,
      })
      .single();

    if (error) return;
    return new Comment(data);
  }
}
