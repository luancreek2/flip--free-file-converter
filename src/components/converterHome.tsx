import { branding } from "../config/branding";
import { getAllTargets } from "../converters/main";
import { conversionHref, inputFormatCount, toolCategories } from "../helpers/toolCatalog";
import { Icon } from "./icon";

export const ConverterHome = ({
  webroot = "",
  allowUnauthenticated = false,
}: {
  webroot?: string;
  allowUnauthenticated?: boolean;
}) => (
  <main id="main-content" class="flip-home">
    <section class="flip-hero" aria-labelledby="hero-title">
      <div class="flip-container flip-hero-grid">
        <div class="flip-hero-copy">
          <span class="flip-status">
            <span />
            Open source. Yours to host.
          </span>
          <h1 id="hero-title">
            Convert Your
            <br />
            <span>Files.</span>
            <span class="flip-heading-dot" aria-hidden="true">
              ↗
            </span>
          </h1>
          <p class="flip-hero-description">
            Flip is a free, fast, and simple file converter for converting PDFs, images, videos,
            audio, documents, and more.
          </p>
          <ul class="flip-benefits">
            <li>
              <span class="flip-benefit-icon">
                <Icon name="bolt" />
              </span>
              <div>
                <strong>Less work. More done.</strong>
                <span>Upload, choose a format, and convert.</span>
              </div>
            </li>
            <li>
              <span class="flip-benefit-icon">
                <Icon name="layers" />
              </span>
              <div>
                <strong>One place for your files.</strong>
                <span>{inputFormatCount} input formats in the converter registry.</span>
              </div>
            </li>
            <li>
              <span class="flip-benefit-icon">
                <Icon name="download" />
              </span>
              <div>
                <strong>Simple downloads.</strong>
                <span>Save your converted files individually or together.</span>
              </div>
            </li>
          </ul>
          <p class="flip-privacy">
            <Icon name="shield" size={16} />
            <span>
              Files are uploaded and processed on this server. Self-host Flip for control over your
              data.
            </span>
          </p>
        </div>
        <div class="flip-upload-column" id="converter">
          <div class="flip-upload-topline">
            <span>YOUR NEXT FORMAT STARTS HERE</span>
            <span>01 — UPLOAD</span>
          </div>
          <div id="dropzone" class="flip-dropzone">
            <span class="flip-upload-icon">
              <Icon name="upload" size={48} />
            </span>
            <h2>Drop any file here</h2>
            <p>or click to browse</p>
            <span class="flip-browse-button">
              <Icon name="document" size={18} />
              Browse Files
            </span>
            <input
              id="file-input"
              type="file"
              name="file"
              multiple
              aria-label="Browse files to upload"
            />
            <div class="flip-upload-note">
              <Icon name="check" size={16} />
              <span>
                Multiple files
                {allowUnauthenticated ? " · No sign-up required" : " · Connected to your account"}
              </span>
            </div>
          </div>
          <div class="flip-upload-caption">
            <span>PDF · JPG · PNG · HEIC · MP4 · DOCX</span>
            <a href={`${webroot}/converters`}>
              All formats <Icon name="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="flip-workspace flip-container" aria-labelledby="workspace-title">
      <div class="flip-workspace-header">
        <div>
          <span class="flip-eyebrow">YOUR WORKSPACE</span>
          <h2 id="workspace-title">Ready when you are.</h2>
        </div>
        <span class="flip-step-hint">Upload → Choose format → Convert → Download</span>
      </div>
      <div class="flip-workspace-grid">
        <div class="flip-files-panel">
          <div class="flip-panel-heading">
            <h3>Your files</h3>
            <span id="file-count">0 files</span>
          </div>
          <p id="file-empty" class="flip-files-empty">
            A fresh start.
            <br />
            <span>Your uploaded files will appear here.</span>
          </p>
          <div class="flip-file-scroll">
            <table id="file-list" aria-label="Uploaded files" />
          </div>
          <p id="upload-status" class="flip-upload-status" role="status" aria-live="polite">
            Choose files above to get started.
          </p>
        </div>
        <form method="post" action={`${webroot}/convert`} class="flip-convert-panel">
          <input type="hidden" name="file_names" id="file_names" />
          <div class="flip-panel-heading">
            <h3>Make it a different format</h3>
            <span>02 — CONVERT</span>
          </div>
          <label class="flip-format-label" for="convert-to-search">
            Convert to
          </label>
          <div class="flip-format-field">
            <Icon name="search" size={18} />
            <input
              id="convert-to-search"
              type="search"
              name="convert_to_search"
              placeholder="Choose an output format…"
              autocomplete="off"
              aria-label="Choose output format"
            />
            <Icon name="down" size={15} />
          </div>
          <div class="select_container">
            <article class="convert_to_popup hidden">
              {Object.entries(getAllTargets()).map(([converter, targets]) => (
                <article class="convert_to_group" data-converter={converter}>
                  <header safe>{converter}</header>
                  <ul class="convert_to_target">
                    {targets.map((target) => (
                      <button
                        tabindex={0}
                        class="target"
                        data-value={`${target},${converter}`}
                        data-target={target}
                        data-converter={converter}
                        type="button"
                        safe
                      >
                        {target}
                      </button>
                    ))}
                  </ul>
                </article>
              ))}
            </article>
            <select name="convert_to" aria-label="Convert to" required hidden>
              <option selected disabled value="">
                Convert to
              </option>
              {Object.entries(getAllTargets()).map(([converter, targets]) => (
                <optgroup label={converter}>
                  {targets.map((target) => (
                    <option value={`${target},${converter}`} safe>
                      {target}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <p class="flip-format-help" id="format-help">
            Available formats update after your first upload. Files in a batch should share the same
            input format.
          </p>
          <input class="flip-convert-button" type="submit" value="Convert Files" disabled />
          <p class="flip-convert-footnote">Real converters. No subscriptions. Just a new format.</p>
        </form>
      </div>
    </section>

    <section id="tools" class="flip-tools flip-container" aria-labelledby="tools-title">
      <div class="flip-section-heading">
        <span class="flip-eyebrow">A LITTLE LESS FILE FRICTION</span>
        <h2 id="tools-title">
          Our <span>Tools.</span>
        </h2>
        <p>A format for whatever comes next. Find a conversion and make it yours.</p>
      </div>
      <nav class="flip-category-tabs" aria-label="Tool categories">
        {toolCategories.map((category) => (
          <a href={`#tools-${category.id}`} safe>
            {category.name}
          </a>
        ))}
      </nav>
      {toolCategories.map((category) => (
        <section
          id={`tools-${category.id}`}
          class="flip-tool-group"
          data-category={category.id}
          aria-label={category.name}
        >
          <div class="flip-tool-group-heading">
            <h3>
              <span class="flip-category-icon">
                <Icon name={category.icon} />
              </span>
              <span safe>{category.name}</span>
            </h3>
            {category.tools.length > 0 && (
              <span class="flip-tool-count">{category.tools.length} suggested conversions</span>
            )}
          </div>
          <div class="flip-tool-grid">
            {category.tools.map((tool) => (
              <a class="flip-tool" href={conversionHref(webroot, tool)}>
                <span class="flip-category-icon">
                  <Icon name={category.icon} size={22} />
                </span>
                <span>
                  <strong safe>{tool.name}</strong>
                  <small safe>
                    {tool.from.toUpperCase()} → {tool.to.toUpperCase()}
                  </small>
                </span>
                <Icon name="arrow" size={18} />
              </a>
            ))}
          </div>
          {category.tools.length === 0 && (
            <p class="flip-unavailable">
              <Icon name="archive" />
              <span>
                Keeping it honest: archive extraction and repacking aren’t supported by the current
                registry. No pretend tools here.
              </span>
            </p>
          )}
        </section>
      ))}
      <div class="flip-registry-banner">
        <div>
          <h3>Something a little more specific?</h3>
          <p>Explore every input and output in the actual converter registry.</p>
        </div>
        <a href={`${webroot}/converters`}>
          Browse all formats <Icon name="arrow" size={18} />
        </a>
      </div>
      <p class="flip-capability-note">
        Suggestions reflect the registered format mappings. Successful conversion also depends on
        the installed converter binaries and your file.
      </p>
      <a class="flip-back-top" href="#hero-title">
        Back to the top <Icon name="arrow" size={16} />
      </a>
      <span class="flip-sr-only">{branding.name} file conversion tools</span>
    </section>
  </main>
);
