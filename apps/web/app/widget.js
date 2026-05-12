// Callroom Embed Widget Script
// Usage: <script src="https://your-domain.com/widget.js" async></script>
// Then: <div data-callroom-book="handle/slug" data-theme="#6332E5"></div>

(function() {
  'use strict';

  const WIDGET_URL = window.location.origin;

  function createPopup(config) {
    const overlay = document.createElement('div');
    overlay.id = 'callroom-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: callroom-fade-in 0.2s ease;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      animation: callroom-slide-up 0.2s ease;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = `${WIDGET_URL}/embed/${config.handle}/${config.slug}`;
    iframe.style.cssText = `
      width: 100%;
      height: 600px;
      border: none;
      border-radius: 12px;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(0,0,0,0.1);
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    `;

    overlay.appendChild(container);
    container.appendChild(iframe);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePopup();
      }
    });

    closeBtn.addEventListener('click', closePopup);
    container.appendChild(closeBtn);

    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes callroom-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes callroom-slide-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    return overlay;
  }

  function closePopup() {
    const overlay = document.getElementById('callroom-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  function init() {
    const widgets = document.querySelectorAll('[data-callroom-book]');

    widgets.forEach(function(widget) {
      const bookData = widget.getAttribute('data-callroom-book');
      const theme = widget.getAttribute('data-theme') || '#6332E5';

      if (bookData) {
        const parts = bookData.split('/');
        const handle = parts[0];
        const slug = parts[1] || 'default';

        const button = document.createElement('button');
        button.textContent = 'Book a call';
        button.style.cssText = `
          padding: 12px 24px;
          background: ${theme};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        `;

        button.addEventListener('mouseover', function() {
          button.style.opacity = '0.9';
        });

        button.addEventListener('mouseout', function() {
          button.style.opacity = '1';
        });

        button.addEventListener('click', function() {
          createPopup({ handle, slug, theme });
        });

        widget.appendChild(button);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Callroom = {
    openPopup: function(config) {
      createPopup(config);
    },
    closePopup: closePopup
  };
})();