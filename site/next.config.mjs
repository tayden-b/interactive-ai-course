/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16.3 writes its own AGENTS.md/CLAUDE.md into this directory. This repo already
  // gives those filenames a specific meaning in course/ (they point a learner's coding
  // agent at TUTOR.md), so a second competing pair here is just confusing.
  agentRules: false,

  // Type errors are NOT ignored. v0 scaffolds with `typescript.ignoreBuildErrors: true`;
  // the errors it was hiding are fixed, so the build fails on regressions like it should.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
