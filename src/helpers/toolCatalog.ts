import { getAllInputs, getAllTargets, getPossibleTargets } from "../converters/main";
import { normalizeFiletype } from "./normalizeFiletype";

export interface ConversionTool {
  id: string;
  from: string;
  to: string;
  target: string;
  converter: string;
  name: string;
  keywords: string;
}

// Discovery suggestions, not capability declarations. Every pair is checked against
// the existing registry; the selected converter and target retain their real IDs.
const suggestions = [
  {
    id: "pdf",
    name: "PDF Tools",
    icon: "document",
    pairs: ["pdf:jpg", "jpg:pdf", "pdf:png", "docx:pdf", "md:pdf", "pdf:md", "png:pdf", "html:pdf"],
  },
  {
    id: "image",
    name: "Image Tools",
    icon: "image",
    pairs: [
      "heic:jpg",
      "png:jpg",
      "jpg:png",
      "webp:jpg",
      "jpg:webp",
      "png:webp",
      "svg:png",
      "avif:jpg",
      "tiff:png",
      "png:svg",
      "gif:webp",
      "bmp:jpg",
    ],
  },
  {
    id: "video",
    name: "Video Tools",
    icon: "video",
    pairs: ["mov:mp4", "mp4:webm", "webm:mp4", "mkv:mp4", "avi:mp4", "mp4:gif"],
  },
  {
    id: "audio",
    name: "Audio Tools",
    icon: "audio",
    pairs: ["mp4:mp3", "wav:mp3", "mp3:wav", "m4a:mp3", "flac:mp3", "ogg:mp3", "aac:mp3"],
  },
  {
    id: "document",
    name: "Document Tools",
    icon: "document",
    pairs: [
      "docx:pdf",
      "odt:pdf",
      "rtf:pdf",
      "epub:pdf",
      "docx:txt",
      "html:md",
      "md:html",
      "txt:pdf",
    ],
  },
  { id: "archive", name: "Archive", icon: "archive", pairs: [] },
  {
    id: "more",
    name: "More",
    icon: "layers",
    pairs: ["csv:json", "json:yaml", "yaml:json", "vcf:csv", "stl:obj", "obj:stl", "gltf:glb2"],
  },
];

export const toolCategories = suggestions.map((category) => ({
  ...category,
  tools: category.pairs.flatMap((pair): ConversionTool[] => {
    const [from, to] = pair.split(":");
    if (!from || !to) return [];
    for (const [converter, targets] of Object.entries(getPossibleTargets(from))) {
      const target = targets.find((value) => normalizeFiletype(value) === normalizeFiletype(to));
      if (!target) continue;
      return [
        {
          id: `${from}-to-${to}`,
          from,
          to,
          target,
          converter,
          name: `${from.toUpperCase()} to ${to.toUpperCase()}`,
          keywords:
            `${from} ${to} ${from === "docx" ? "word document" : ""} ${from === "heic" ? "iphone photo" : ""} ${category.name}`.toLowerCase(),
        },
      ];
    }
    return [];
  }),
}));

export const conversionHref = (webroot: string, tool: ConversionTool) =>
  `${webroot}/?from=${encodeURIComponent(tool.from)}&to=${encodeURIComponent(tool.target)}#converter`;

export const inputFormatCount = new Set(
  Object.keys(getAllTargets()).flatMap((converter) => getAllInputs(converter)),
).size;
