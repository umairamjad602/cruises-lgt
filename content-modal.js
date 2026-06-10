(function () {
    var skeletonHTML = '<div style="padding:8px">'
        + '<div style="background:#e9ecef;height:28px;width:45%;border-radius:4px;margin-bottom:20px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:95%;border-radius:4px;margin-bottom:10px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:80%;border-radius:4px;margin-bottom:10px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:88%;border-radius:4px;margin-bottom:24px;"></div>'
        + '<div style="background:#e9ecef;height:22px;width:38%;border-radius:4px;margin-bottom:16px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:90%;border-radius:4px;margin-bottom:10px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:75%;border-radius:4px;margin-bottom:10px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:82%;border-radius:4px;margin-bottom:24px;"></div>'
        + '<div style="background:#e9ecef;height:22px;width:40%;border-radius:4px;margin-bottom:16px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:70%;border-radius:4px;margin-bottom:10px;"></div>'
        + '<div style="background:#e9ecef;height:16px;width:85%;border-radius:4px;margin-bottom:10px;"></div>'
        + '</div>';

    var modalHTML = '<div id="cpm-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:99999;overflow-y:auto;">'
        + '<div style="background:#fff;max-width:900px;margin:40px auto 40px;border-radius:8px;position:relative;box-shadow:0 8px 32px rgba(0,0,0,0.18);">'
        + '<div style="padding:16px 20px;border-bottom:1px solid #dee2e6;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;border-radius:8px 8px 0 0;z-index:1;">'
        + '<h5 id="cpm-title" style="margin:0;font-weight:700;font-size:18px;"></h5>'
        + '<button id="cpm-close" style="background:none;border:none;font-size:28px;line-height:1;cursor:pointer;color:#555;padding:0 4px;" aria-label="Close">&times;</button>'
        + '</div>'
        + '<div id="cpm-body" style="padding:28px 32px;min-height:200px;"></div>'
        + '</div>'
        + '</div>';

    document.addEventListener('DOMContentLoaded', function () {
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        var overlay = document.getElementById('cpm-overlay');
        var body    = document.getElementById('cpm-body');
        var title   = document.getElementById('cpm-title');
        var closeBtn = document.getElementById('cpm-close');

        function openModal() { overlay.style.display = 'block'; document.body.style.overflow = 'hidden'; }
        function closeModal() { overlay.style.display = 'none'; body.innerHTML = ''; title.textContent = ''; document.body.style.overflow = ''; }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

        document.querySelectorAll('[data-page-slug]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var slug = link.getAttribute('data-page-slug');
                var lang = link.getAttribute('data-page-lang') || 'en';

                title.textContent = link.textContent.trim();
                body.innerHTML = skeletonHTML;
                openModal();

                fetch('https://api.letsgotours.com/api/pages/' + encodeURIComponent(lang) + '/' + encodeURIComponent(slug))
                    .then(function (res) {
                        if (!res.ok) throw new Error('HTTP ' + res.status);
                        return res.json();
                    })
                    .then(function (json) {
                        var page = json.data && json.data[0];
                        if (!page) { body.innerHTML = '<p style="color:#888;">Page not found.</p>'; return; }

                        if (page.title) title.textContent = page.title;

                        var html = '';
                        try {
                            var parsed = JSON.parse(page.html);
                            if (parsed && typeof parsed === 'object' && parsed.html) {
                                if (parsed.css) {
                                    var style = document.createElement('style');
                                    style.innerHTML = parsed.css;
                                    document.head.appendChild(style);
                                }
                                html = parsed.html;
                            } else {
                                html = page.html;
                            }
                        } catch (err) {
                            html = page.html;
                        }

                        body.innerHTML = html;
                    })
                    .catch(function () {
                        body.innerHTML = '<p style="color:#c00;">Failed to load content. Please try again.</p>';
                    });
            });
        });
    });
})();
