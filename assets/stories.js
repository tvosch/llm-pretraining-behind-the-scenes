/* Story filenames are independent of chapter order. Reload to pick up edits. */
window.chapterStories = (() => {
  // Stories have been merged into the main chapter copy; drafts remain on disk.
  const files = {};
  const requests = new Map(), expanded = new Set();
  async function mount(chapter, host) {
    const file = files[chapter];
    if (!file) return;
    if (!requests.has(file)) requests.set(file, fetch(`stories/${file}.md`, {cache:'no-store'})
      .then(response => {
        if (response.status === 404) return '';
        if (!response.ok) throw new Error(`Story unavailable: ${file}`);
        return response.text();
      }).catch(error => { console.warn(error); requests.delete(file); return ''; }));
    const source = await requests.get(file);
    if (!host.isConnected) return;
    const content = document.createElement('div');
    content.className = 'story-content';
    content.innerHTML = DOMPurify.sanitize(marked.parse(source), {
      ALLOWED_TAGS: ['h1','h2','h3','h4','p','a','img','ul','ol','li','strong','em','blockquote','code','pre','hr','br','table','thead','tbody','tr','th','td','del'],
      ALLOWED_ATTR: ['href','src','alt','title','start']
    });
    const heading = content.querySelector('h1,h2,h3');
    const label = heading?.textContent || 'Behind the scenes';
    heading?.remove();
    if (!content.textContent.trim() && !content.querySelector('img')) return;
    content.querySelectorAll('a').forEach(link => {
      if (/^https?:/.test(link.href)) {link.target='_blank';link.rel='noopener noreferrer';}
    });
    content.querySelectorAll('img').forEach(img => {img.loading='lazy';});
    const details = document.createElement('details');
    details.className = 'chapter-story';
    details.open = expanded.has(chapter);
    const summary = document.createElement('summary');
    summary.textContent = label;
    details.append(summary, content);
    details.addEventListener('toggle', () => {
      if (details.open) expanded.add(chapter); else expanded.delete(chapter);
    });
    host.append(details);
  }
  return {mount};
})();
