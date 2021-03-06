export interface News {
  _id: string;
  host: string;
  category: string;
  headline: string;
  image: string;
  url: string;
  date: string;
  clickCount: number;
  createdAt: Date;
  archived: boolean;
}
