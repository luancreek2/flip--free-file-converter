import { expect, test } from "bun:test";

import { BaseHtml } from "../../src/components/base";
import { Header } from "../../src/components/header";
import { branding } from "../../src/config/branding";

test("the shell brands legacy titles and preserves subpath asset URLs", async () => {
  const html = String(
    await BaseHtml({ children: "", title: "ConvertX | Result", webroot: "/flip" }),
  );
  expect(html).toContain("<title>Result — Flip</title>");
  expect(html).toContain('src="/flip/theme-init.js"');
  expect(html).toContain('src="/flip/flip.js"');
  expect(html).toContain(branding.legal.originalUrl);
  expect(html).toContain(branding.legal.sourceUrl);
  expect(html).toContain("Source Code");
  expect(html).toContain('href="/flip/flip-icon.svg"');
  expect(html).not.toContain("flip.example.com");
  expect(html).not.toContain("og-image.png");
});

test("the header escapes customized branding and account labels", async () => {
  const html = String(
    await Header({ branding: "<img src=x>", userEmail: "<script>bad()</script>" }),
  );
  expect(html).toContain("&lt;img src=x&gt;");
  expect(html).toContain("&lt;script&gt;bad()&lt;/script&gt;");
  expect(html).not.toContain("<script>bad()");
});

test("navigation starts closed and links only to implemented pages", async () => {
  const html = String(
    await Header({ webroot: "/flip", loggedIn: true, allowUnauthenticated: true }),
  );
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('href="/flip/converters"');
  expect(html).not.toContain("/convert?from=");
  expect(html).not.toContain('href="/flip/account"');
  expect(html).not.toContain('action="/flip/logoff"');
  expect(html).toContain('<dialog id="search-dialog"');
  expect(html).toContain("data-search-result");
  expect(html).toContain("data-keywords=");
  expect(html).not.toContain("<details open");
});

test("the default header prominently brands Flip, even with the legacy default", async () => {
  const html = String(await Header({ branding: "ConvertX" }));
  expect(html).toContain("Flip home");
  expect(html).not.toContain(">ConvertX<");
});
