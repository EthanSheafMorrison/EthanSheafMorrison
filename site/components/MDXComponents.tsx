import Image, { ImageProps } from "next/image";
import Link from "next/link";
import path from "node:path";
import { createRequire } from "node:module";
import type { ComponentProps, ImgHTMLAttributes } from "react";

type MDXImgProps = Partial<ImageProps> & ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

const require = createRequire(import.meta.url);
let sizeOf: ((p: string) => { width: number; height: number } | undefined) | null = null;
try {
  // Lazy require so it works in server env only
  sizeOf = require("image-size");
} catch {
  sizeOf = null;
}

const MDXImage = (props: MDXImgProps) => {
  const { src, width, height, alt, className } = props;
  let w = width;
  let h = height;

  if ((!w || !h) && typeof src === "string" && src.startsWith("/")) {
    try {
      const absPath = path.join(process.cwd(), "public", src);
      if (sizeOf) {
        const dim = sizeOf(absPath);
        if (dim && typeof dim.width === "number" && typeof dim.height === "number") {
          w = dim.width;
          h = dim.height;
        }
      }
    } catch {
      // ignore dimension extraction failures
    }
  }

  if (typeof w === "number" && typeof h === "number") {
    return (
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt ?? ""}
        sizes="(min-width: 768px) 768px, 100vw"
        className={className}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={className}
      loading="lazy"
      decoding="async"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
};

const Anchor = (props: ComponentProps<typeof Link>) => <Link {...props} />;

const MDXComponents = {
  img: (props: MDXImgProps) => <MDXImage {...props} />,
  a: Anchor,
};

export default MDXComponents;


