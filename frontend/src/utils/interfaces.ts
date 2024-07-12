export interface Blog {
  id: number;
  title: string;
  content?: string;
  createdOn: Date;
  published?: boolean;
  photourl?: string;
  authorName?: string;
  authorPhoto?: string;
  author?: {
    name: string;
    photourl: string;
  };
}

export interface User {
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  photourl: string | undefined;
  isVerified: boolean | undefined;
  blogs: Blog[] | undefined;
}
