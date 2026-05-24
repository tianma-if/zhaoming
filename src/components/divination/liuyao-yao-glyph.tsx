interface LiuyaoYaoGlyphProps {
  isYang: boolean;
  tone?: "dark" | "light";
  className?: string;
  strokeClassName?: string;
}

function getToneClass(tone: LiuyaoYaoGlyphProps["tone"]) {
  return tone === "light" ? "bg-white" : "bg-black";
}

export function LiuyaoYaoGlyph({
  isYang,
  tone = "dark",
  className,
  strokeClassName,
}: LiuyaoYaoGlyphProps) {
  const toneClass = getToneClass(tone);
  const strokeClass = strokeClassName ?? "h-[1.05rem]";

  if (isYang) {
    return (
      <div className={`mx-auto w-full max-w-[15rem] ${className ?? ""}`}>
        <div className={`${strokeClass} w-full rounded-full ${toneClass}`} />
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-[15rem] ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <div className={`${strokeClass} w-[42%] rounded-full ${toneClass}`} />
        <div className={`${strokeClass} w-[42%] rounded-full ${toneClass}`} />
      </div>
    </div>
  );
}
