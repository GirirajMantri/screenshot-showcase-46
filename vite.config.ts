// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The devtools source-injection adds `data-tsd-source` to every JSX element. React Three Fiber
// treats dashed props as nested paths and crashes, so strip it from 3D scene files.
const stripTsdSourceFromScenes = {
  name: "strip-tsd-source-from-r3f",
  enforce: "post" as const,
  transform(code: string, id: string) {
    if (!/src\/components\/nexus\/\w*Scene\.tsx/.test(id) || !code.includes("data-tsd-source")) return;
    return {
      code: code.replace(/["']data-tsd-source["']\s*:\s*("[^"]*"|'[^']*'),?/g, "").replace(/\sdata-tsd-source=("[^"]*"|'[^']*')/g, ""),
      map: null,
    };
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [stripTsdSourceFromScenes],
  },
});
