import { branding } from "../config/branding";
import { Icon } from "./icon";

export const Footer = ({ webroot = "" }: { webroot?: string }) => (
  <footer class="flip-footer no-print">
    <div class="flip-container">
      <div class="flip-footer-top">
        <div>
          <a class="flip-brand" href={`${webroot}/`}>
            {branding.name}
            <span aria-hidden="true">↗</span>
          </a>
          <p>A new format. A fresh start.</p>
        </div>
        <nav class="flip-footer-links" aria-label="Footer navigation">
          <a href={`${webroot}/#tools`}>Explore tools</a>
          <a href={`${webroot}/converters`}>Supported formats</a>
          <a href={branding.legal.sourceUrl} target="_blank" rel="noopener noreferrer">
            Source Code <Icon name="external" size={12} />
          </a>
        </nav>
      </div>
      <div class="flip-footer-bottom">
        <p>
          © {new Date().getFullYear()} {branding.legal.copyrightHolder}. Built on{" "}
          <a href={branding.legal.originalUrl} target="_blank" rel="noopener noreferrer">
            ConvertX
          </a>{" "}
          · <a href={branding.legal.licenseUrl}>AGPL-3.0</a>
        </p>
        <p>Open source. Server-side processing. Self-hostable.</p>
      </div>
    </div>
  </footer>
);
