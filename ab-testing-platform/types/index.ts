export interface Variant {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  createdAt: string;
  isActive: boolean;
  metrics?: VariantMetrics;
}

export interface VariantMetrics {
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversions: number;
  conversionRate: number;
}

export interface AnalysisResult {
  winner: string | null;
  summary: string;
  insights: string[];
  recommendations: string[];
  metrics: {
    [variantId: string]: VariantMetrics;
  };
}

export interface PromptRequest {
  prompt: string;
  currentHtml?: string;
  currentCss?: string;
  variantCount?: number;
}

export interface SiteConfig {
  currentVariant: string;
  variants: Variant[];
  originalVariant: Variant;
}

