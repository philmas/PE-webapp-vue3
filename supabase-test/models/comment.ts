import { Post, PostInterface } from './Post';
import { UserData, UserDataInterface } from './userData';

export interface CommentInterface {
  id: number;
  news_item: PostInterface;
  author: UserDataInterface;
  content: string;
  created_at: string;
}

export class Comment implements CommentInterface {
  id: number;
  news_item: Post;
  author: UserData;
  content: string;
  created_at: string;

  constructor(comment: CommentInterface) {
    this.id = comment.id;
    this.news_item = new Post(comment.news_item);
    this.author = new UserData(comment.author);
    this.content = comment.content;
    this.created_at = comment.created_at;
  }

  isOwner(): boolean {
    const user = useUser();
    return this.author.id === user.value.id;
  }
}
