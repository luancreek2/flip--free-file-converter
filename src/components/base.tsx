import { branding } from "../config/branding";
import { Footer } from "./footer";

interface BaseHtmlProps {
  children: JSX.Element;
  title?: string;
  description?: string;
  webroot?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
}

export const BaseHtml = ({
  children,
  title = branding.name,
  description = branding.description,
  webroot = "",
  ogImage = branding.metadata.ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
}: BaseHtmlProps) => {
  const pageTitle = title.replace(/^ConvertX \| /, "");
  const fullTitle =
    pageTitle === branding.name ? branding.metadata.title : `${pageTitle} — ${branding.name}`;
  const siteUrl = branding.metadata.url;
  const canonical = canonicalUrl ?? (siteUrl ? `${siteUrl}${webroot}` : "");
  const ogImageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${siteUrl}${webroot}${ogImage}`
    : "";
  return (
    <html lang="en" data-theme="auto">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="webroot" content={webroot} />
        <meta name="theme-color" content="#7350d9" />
        <title safe>{fullTitle}</title>
        <meta name="description" content={description} />
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        {!!canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:type" content={ogType} />
        {!!canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        {!!ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        <meta property="og:site_name" content={branding.name} />
        <meta name="twitter:card" content={ogImageUrl ? "summary_large_image" : "summary"} />
        {!!branding.metadata.twitterHandle && (
          <meta name="twitter:site" content={branding.metadata.twitterHandle} />
        )}
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        {!!ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
        <link rel="icon" type="image/svg+xml" href={`${webroot}${branding.favicon.svg}`} />
        <script src={`${webroot}/theme-init.js`} />
        <link rel="stylesheet" href={`${webroot}/generated.css`} />
      </head>
      <body class="flex min-h-screen w-full flex-col bg-neutral-900 text-contrast antialiased">
        {children}
        <Footer webroot={webroot} />
        <script src={`${webroot}/flip.js`} defer />
      </body>
    </html>
  );
};
