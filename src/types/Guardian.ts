export interface GuardianArticleFields {
  thumbnail?: string;
}

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: GuardianArticleFields;
  isHosted: boolean;
  pillarId?: string;
  pillarName?: string;
}

export interface GuardianResponseWrapper {
  status: "ok" | "error";
  userTier: string;
  total: number;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: string;
  results: GuardianArticle[];
}

export interface GuardianResponse {
  response: GuardianResponseWrapper;
}
