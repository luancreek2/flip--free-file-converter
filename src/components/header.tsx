import { branding } from "../config/branding";
import { conversionHref, toolCategories } from "../helpers/toolCatalog";
import { LogoIcon } from "../icons";
import { Icon } from "./icon";

interface HeaderProps {
  webroot?: string;
  branding?: string;
  accountRegistration?: boolean;
  allowUnauthenticated?: boolean;
  hideHistory?: boolean;
  loggedIn?: boolean;
  userEmail?: string;
}

const ThemeToggle = () => (
  <button
    type="button"
    class="flip-icon-button"
    data-theme-toggle
    aria-label="Toggle color theme"
    title="Toggle color theme"
  >
    <span data-theme-icon="light">
      <Icon name="moon" />
    </span>
    <span data-theme-icon="dark" class="hidden">
      <Icon name="sun" />
    </span>
  </button>
);

export const Header = ({
  webroot = "",
  branding: customBrand,
  accountRegistration = false,
  allowUnauthenticated = false,
  hideHistory = false,
  loggedIn = false,
  userEmail,
}: HeaderProps) => {
  const name = customBrand && customBrand !== "ConvertX" ? customBrand : branding.name;
  const accountLinks = (
    <div class="flip-account-links">
      {loggedIn && !hideHistory && <a href={`${webroot}/history`}>History</a>}
      {loggedIn && !allowUnauthenticated && (
        <>
          <a href={`${webroot}/account`}>Account</a>
          <a href={`${webroot}/logoff`}>Log out</a>
        </>
      )}
      {!loggedIn && <a href={`${webroot}/login`}>Log in</a>}
      {!loggedIn && accountRegistration && <a href={`${webroot}/register`}>Create account</a>}
    </div>
  );
  return (
    <>
      <a class="flip-skip" href="#main-content">
        Skip to content
      </a>
      <header class="flip-header">
        <nav class="flip-nav flip-container" aria-label="Main navigation">
          <a class="flip-brand" href={`${webroot}/`} aria-label={`${branding.name} home`}>
            <span class="flip-brand-mark">
              <LogoIcon />
            </span>
            <span safe>{name.slice(0, branding.limits.maxBrandingLength)}</span>
          </a>
          <div class="flip-desktop-nav">
            {toolCategories.map((category) => (
              <details class="flip-nav-category" data-category={category.id}>
                <summary>
                  <span safe>{category.name}</span>
                  <Icon name="down" size={13} />
                </summary>
                <div class="flip-mega-panel">
                  <div class="flip-mega-heading">
                    <strong safe>{category.name}</strong>
                    <a href={`${webroot}/#tools-${category.id}`}>
                      View all <Icon name="arrow" size={15} />
                    </a>
                  </div>
                  <div class="flip-mega-grid">
                    {category.tools.slice(0, 8).map((tool) => (
                      <a href={conversionHref(webroot, tool)} class="flip-menu-tool">
                        <span class="flip-category-icon">
                          <Icon name={category.icon} size={19} />
                        </span>
                        <span safe>{tool.name}</span>
                        <Icon name="chevron" size={14} />
                      </a>
                    ))}
                  </div>
                  {category.tools.length === 0 && (
                    <p class="flip-menu-note">
                      Archive extraction and repacking are not supported by the current conversion
                      registry.
                    </p>
                  )}
                  {category.id === "more" && (
                    <>
                      {accountLinks}
                      <a class="flip-registry-link" href={`${webroot}/converters`}>
                        Browse the full converter registry <Icon name="arrow" size={16} />
                      </a>
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>
          <div class="flip-nav-actions">
            <button
              id="search-trigger"
              type="button"
              data-search-trigger
              class="flip-search-trigger"
              aria-label="Search conversions"
              aria-haspopup="dialog"
            >
              <Icon name="search" size={18} />
              <span>Quick search…</span>
              <kbd>Ctrl K</kbd>
            </button>
            <ThemeToggle />
            <button
              id="mobile-menu-button"
              type="button"
              class="flip-icon-button flip-mobile-trigger"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
            >
              <Icon name="menu" />
            </button>
          </div>
        </nav>
      </header>
      <dialog id="mobile-menu" class="flip-mobile-dialog" aria-label="Navigation menu">
        <div class="flip-mobile-heading">
          <strong>Explore Flip</strong>
          <button type="button" class="flip-icon-button" data-mobile-close aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        {!!userEmail && (
          <p class="flip-menu-note" safe>
            {userEmail}
          </p>
        )}
        {toolCategories.map((category) => (
          <details class="flip-mobile-category" data-category={category.id}>
            <summary>
              <span class="flip-category-icon">
                <Icon name={category.icon} size={19} />
              </span>
              <span safe>{category.name}</span>
              <Icon name="down" size={16} />
            </summary>
            {category.tools.map((tool) => (
              <a href={conversionHref(webroot, tool)} safe>
                {tool.name}
              </a>
            ))}
            {category.tools.length === 0 && (
              <p class="flip-menu-note">Archive extraction is not currently supported.</p>
            )}
          </details>
        ))}
        {accountLinks}
        <a class="flip-registry-link" href={`${webroot}/converters`}>
          Full converter registry <Icon name="arrow" size={16} />
        </a>
      </dialog>
      <dialog id="search-dialog" class="flip-search-dialog" aria-labelledby="search-title">
        <div class="flip-search-heading">
          <Icon name="search" />
          <label id="search-title" class="flip-sr-only" for="search-input">
            Search supported conversions
          </label>
          <input
            type="search"
            id="search-input"
            placeholder="Try PDF to JPG, HEIC, or Word…"
            autocomplete="off"
          />
          <button
            type="button"
            class="flip-icon-button"
            data-search-close
            aria-label="Close search"
          >
            <Icon name="close" size={19} />
          </button>
        </div>
        <p class="flip-search-label">Supported conversions</p>
        <div class="flip-search-results">
          {Array.from(
            new Map(
              toolCategories.flatMap((category) =>
                category.tools.map((tool) => [tool.id, { tool, category }] as const),
              ),
            ).values(),
          ).map(({ tool, category }) => (
            <a
              data-search-result
              data-keywords={tool.keywords}
              href={conversionHref(webroot, tool)}
              data-category={category.id}
            >
              <span class="flip-category-icon">
                <Icon name={category.icon} size={20} />
              </span>
              <span>
                <strong safe>{tool.name}</strong>
                <small safe>{category.name}</small>
              </span>
              <Icon name="arrow" size={17} />
            </a>
          ))}
          <p id="search-empty" class="flip-menu-note hidden" role="status">
            No supported conversions found. Try another format.
          </p>
        </div>
        <div class="flip-search-footer">
          <span>↑ ↓ navigate · Enter select</span>
          <span>Esc to close</span>
        </div>
      </dialog>
    </>
  );
};
