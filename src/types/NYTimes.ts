export interface NYTimesMultimedia {
  rank: number;
  subtype: string;
  caption: string | null;
  credit: string | null;
  type: string;
  url: string;
  height: number;
  width: number;
  crop_name?: string | null;
}

export interface NYTimesDocHeadline {
  main: string;
}

export interface NYTimesArticle {
  web_url: string;
  abstract: string;
  snippet: string;
  lead_paragraph: string;
  source: string;
  multimedia: NYTimesMultimedia[];
  headline: NYTimesDocHeadline;
  pub_date: string;
}

export interface NYTimesResponseWrapper {
  status: string;
  copyright: string;
  response: {
    docs: NYTimesArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}
