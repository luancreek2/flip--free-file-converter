const paths: Record<string, string> = {
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5",
  download: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  chevron: "m9 5 7 7-7 7",
  down: "m6 9 6 6 6-6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  moon: "M20.5 13A9 9 0 0 1 11 3a9 9 0 1 0 9.5 10Z",
  document: "M14 2H5v20h14V7Zm0 0v5h5M8 12h8M8 16h6",
  image: "M3 3h18v18H3ZM3 16l5-5 5 5 3-3 5 5M8 7h.01",
  video: "M3 5h13v14H3Zm13 5 5-3v10l-5-3",
  audio: "M9 18V5l12-3v13M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Zm12-3a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z",
  archive: "M3 3h18v5H3Zm2 5v13h14V8M10 12h4",
  layers: "m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  bolt: "m13 2-9 12h7l-1 8 10-12h-7Z",
  check: "m5 12 4 4L19 6",
  shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z",
  external: "M14 3h7v7m0-7L10 14M10 3H3v18h18v-7",
};

export const Icon = ({ name, size = 22 }: { name: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d={paths[name] ?? paths.document} />
  </svg>
);
