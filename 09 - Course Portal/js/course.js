// WILD Programme — Course Portal Script

// Reading progress bar
(function () {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// Sidebar lesson completion progress tracker
(function () {
  const body = document.body;
  const tierId = body.dataset.tierId;
  const lessonId = body.dataset.lessonId;
  if (!tierId || !lessonId) return;

  const storageKey = 'wild_progress_' + tierId;
  let visited = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!visited.includes(lessonId)) {
    visited.push(lessonId);
    localStorage.setItem(storageKey, JSON.stringify(visited));
  }

  const allItems = document.querySelectorAll('.sidebar-item[data-lesson-id]');
  const total = allItems.length;
  if (!total) return;

  const completedCount = Array.from(allItems).filter(
    (el) => visited.includes(el.dataset.lessonId)
  ).length;
  const pct = Math.round((completedCount / total) * 100);

  const progressText = document.querySelector('.sidebar-progress-text');
  const progressFill = document.querySelector('.sidebar-progress-fill');
  if (progressText) progressText.textContent = pct + '% complete';
  if (progressFill) progressFill.style.width = pct + '%';
})();

// Smooth active link highlight update on scroll (optional enhancement)
// Highlights headings in sidebar as user scrolls through lesson content
(function () {
  const headings = document.querySelectorAll('.lesson-content h2, .lesson-content h3');
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // No sidebar anchor links by default, but hook is here for extension
        }
      });
    },
    { rootMargin: '0px 0px -60% 0px' }
  );

  headings.forEach((h) => observer.observe(h));
})();
