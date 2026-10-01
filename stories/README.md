# Writing chapter stories

**Current status:** All story dropdowns have now been merged into the main
chapter text in `assets/journey-content.js`. Markdown files below are preserved
as drafts, but are not currently rendered. Editing them will not change the
site until a story is reconnected in `assets/stories.js`. The instructions
below describe the available, currently inactive Markdown mechanism.

Edit a `.md` file here, save it, then refresh http://localhost:8722/.
Run `bash site/serve.sh 8722` from the project root if needed.
No build step or internet connection is required. Deploy this folder with the site.

The first heading is the expandable section's label. Everything after it is
rendered inside that section, collapsed initially. A blank file, a heading-only
file, or a file containing only comments hides the section.

Use paragraphs, headings, lists, links, and images. Raw interactive HTML and
scripts are intentionally removed. Comments such as `<!-- Write here -->`
are private writing prompts: they are not displayed, but are still publicly
downloadable when you publish. Never put secrets in these files.

Image paths are relative to `site/index.html`, NOT this folder:

```markdown
## Behind the experiments

My observation, in my own words.

### What we found

![Describe what the plot shows](assets/images/compute-optimal-scaling-oellm.png)

[Read the paper](https://arxiv.org/abs/2608.28308)
```

Files match chapters by topic, not number:

| File | Chapter |
| --- | --- |
| data-preparation.md | Data preparation |
| tokenization.md | Tokenization |
| scaling.md | Scaling experiments |
| prelude.md | Prelude |
| multisynt.md | MultiSynt |
| training.md | 32B run |
| training-step.md | One training step |
| babysitting.md | Babysitting |
| day-in-the-life.md | A day in the life |
| loss-divergence.md | Earlier loss divergence |
| annealing.md | Annealing |
| sft.md | Supervised fine-tuning |
| reinforcement-learning.md | Reinforcement learning |

The starter paragraphs are editable examples, not invented personal accounts.
`introduction.md`, `project.md`, and `partners.md` are retained drafts, currently
not rendered. The opening has no expandable story; the project and partner
overview are combined in chapter 2, with an expandable partner-logo list.
`data-preparation.md`, `tokenization.md`, and `scaling.md` are also retained but
not rendered: their explanations now sit in the main chapter text, without
duplicate expandable sections or report links.
`prelude.md` and `multisynt.md` are retained drafts too; their information is
now in the main chapters rather than separate expandable sections.
The short first-view copy and interactive visuals remain in
`assets/journey-content.js`; story mappings live in `assets/stories.js`.
Changes appear on refresh, not automatically while typing. Missing story files
do not prevent the rest of the chapter from working.
