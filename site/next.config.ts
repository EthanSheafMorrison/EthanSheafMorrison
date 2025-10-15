import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects/FindingKuku.html", destination: "/projects/finding-kuku", permanent: true },
      { source: "/projects/MappingHumanEarthSystems.html", destination: "/projects/mapping-human-earth-systems", permanent: true },
      { source: "/projects/WesternSahara.html", destination: "/projects/western-sahara", permanent: true },
      { source: "/projects/GoogleWarming.html", destination: "/projects/google-warming", permanent: true },
      { source: "/projects/Iterate.html", destination: "/projects/iterate", permanent: true },
      { source: "/projects/CollatedFrames.html", destination: "/projects/collated-frames", permanent: true },
      { source: "/projects/adlib.html", destination: "/projects/adlib", permanent: true },
      { source: "/projects/kihikihi.html", destination: "/projects/kihikihi", permanent: true },
      { source: "/projects/EmptyVesselsVideo.html", destination: "/projects/empty-vessels-video", permanent: true },
      { source: "/projects/EmptyVesselsInstall.html", destination: "/projects/empty-vessels-install", permanent: true },
      { source: "/projects/geographic-visualisation.html", destination: "/projects/geographic-visualisation", permanent: true },
      { source: "/projects/sample-project.html", destination: "/projects/on-display", permanent: true },
      { source: "/projects/Pixaura.html", destination: "/projects/pixaura", permanent: true },
      { source: "/projects/herito.html", destination: "/projects/he-rito", permanent: true }
    ];
  }
};

export default nextConfig;
