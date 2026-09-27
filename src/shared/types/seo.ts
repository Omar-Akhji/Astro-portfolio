export interface BreadcrumbItem {
  readonly name: string;
  readonly item: string;
}

export interface SeoProps {
  readonly title?: string;
  readonly description?: string;
  readonly canonical?: string;
  readonly ogImage?: string;
  readonly ogType?: "website" | "article" | "profile";
  readonly noindex?: boolean;
  readonly nofollow?: boolean;
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly tags?: readonly string[];
  readonly author?: string;
  readonly customBreadcrumbs?: readonly BreadcrumbItem[];
  readonly extraSchema?: readonly Record<string, unknown>[] | Record<string, unknown>;
}
