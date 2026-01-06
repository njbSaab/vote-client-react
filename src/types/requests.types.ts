export interface SendCodeRequest {
  email: string;
  name: string;
  siteUrl?: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  browserInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
}