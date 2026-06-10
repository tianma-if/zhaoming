import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogWuxingRadarEmbed } from "@/components/prose/blog-wuxing-radar-embed";
import type { WuxingRadarDatum } from "@/components/divination/wuxing-radar-chart";

const WUXING_RADAR_SHORTCODE_REGEX = /\[\[wuxing-radar:([^[\]]+)\]\]/g;

function renderMarkdownSegment(content: string, key: string) {
  if (!content.trim()) {
    return null;
  }

  return (
    <ReactMarkdown key={key} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}

function parseWuxingRadarData(input: string): WuxingRadarDatum[] | null {
  const items = input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length !== 5) {
    return null;
  }

  const data = items.map((item) => {
    const [element, countText] = item.split(":").map((part) => part.trim());
    const count = Number(countText);

    if (!element || Number.isNaN(count)) {
      return null;
    }

    return { element, count };
  });

  return data.every(Boolean) ? (data as WuxingRadarDatum[]) : null;
}

function renderContentWithEmbeds(content: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let embedIndex = 0;

  for (const match of content.matchAll(WUXING_RADAR_SHORTCODE_REGEX)) {
    const fullMatch = match[0];
    const payload = match[1];
    const matchIndex = match.index ?? -1;

    if (matchIndex < 0) {
      continue;
    }

    nodes.push(
      renderMarkdownSegment(content.slice(lastIndex, matchIndex), `markdown-${embedIndex}`),
    );

    const data = parseWuxingRadarData(payload);

    if (data) {
      nodes.push(<BlogWuxingRadarEmbed key={`embed-${embedIndex}`} data={data} />);
    } else {
      nodes.push(renderMarkdownSegment(fullMatch, `invalid-embed-${embedIndex}`));
    }

    lastIndex = matchIndex + fullMatch.length;
    embedIndex += 1;
  }

  nodes.push(renderMarkdownSegment(content.slice(lastIndex), "markdown-tail"));

  return nodes;
}

export function MarkdownRenderer({
  content,
  enableEmbeds = false,
}: {
  content: string;
  enableEmbeds?: boolean;
}) {
  return (
    <div className="prose-minimal">
      {enableEmbeds ? renderContentWithEmbeds(content) : renderMarkdownSegment(content, "markdown")}
    </div>
  );
}
