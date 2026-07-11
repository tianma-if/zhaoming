import { GitFork } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function GitHubLink() {
  return (
    <Button asChild variant="ghost" size="sm" aria-label="打开 GitHub 仓库">
      <a
        href={siteConfig.githubUrl}
        target="_blank"
        rel="noreferrer"
        title="GitHub"
      >
        <GitFork className="size-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </Button>
  );
}
