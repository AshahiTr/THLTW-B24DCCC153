declare module Blog {
  export interface ITag {
    _id: string;
    name: string;
    slug: string;
    color?: string;
    postCount?: number;
    createdAt?: string;
  }

  export interface IPost {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    thumbnail: string;
    author: string;
    tags: string[]; // tag _id[]
    tagDetails?: ITag[];
    status: 'draft' | 'published';
    views: number;
    createdAt: string;
    updatedAt?: string;
  }

  export interface IAuthor {
    name: string;
    avatar: string;
    bio: string;
    skills: string[];
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      email?: string;
    };
  }
}
