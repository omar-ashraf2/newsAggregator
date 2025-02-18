export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  publishedAt: string;
  source: string;
  publisher?: string;
}
