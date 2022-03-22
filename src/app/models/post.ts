import { Comment } from './comment';
import { Image } from './image';
import { Likes } from './likes';
import { Tag } from './tags';
import { User } from './user';

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  image: Image;
  url: string;
  datetimeCreated: string;
  updatedAt: string;
  user: User;
  comments: Comment[];
  likes: Likes[];
  tags: Tag[];
}
