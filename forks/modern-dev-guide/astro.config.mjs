import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkCallouts } from './src/plugins/remark-callouts.mjs';
import { remarkGlossaryTerms } from './src/plugins/remark-glossary-terms.mjs';
import { remarkDiagrams } from './src/plugins/remark-diagrams.mjs';
import { remarkSteps } from './src/plugins/remark-steps.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkCallouts,
      remarkSteps,
      remarkGlossaryTerms,
      remarkDiagrams,
    ],
  },
});
