export interface Blog {
  id: number;
  title: string;
  description?: string;
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
  emailNotificationsEnabled: boolean | undefined;
  blogs: Blog[] | undefined;
}

export interface ApiErrorResponse {
  error?: {
    message?: string;
  };
}
