import { IronSession } from 'iron-session';

type IUser = {
  id?: number | null | undefined,
  nickname?: string | undefined,
  avatar?: string | undefined,
};

export type Itag = {
  id: number,
  title: string,
  icon: string,
  follow_count: number,
  article_count: number,
}

export type IComment = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
};

export type IArticle = {
  id: number,
  title: string,
  content: string,
  views: number,
  create_time: Date,
  update_time: Date,
  user: IUser,
  comments: IComment[],
  tags: Itag[],
};

export type ISession = IronSession & Record<string, any>;
