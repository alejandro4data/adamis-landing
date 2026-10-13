(() => {
    'use strict';

    document.querySelectorAll('[data-stage-tabs]').forEach((group) => {
        const list = group.querySelector('[data-stage-tablist]');
        const tabs = Array.from(group.querySelectorAll('[data-stage-tab]'));
        const panels = Array.from(group.querySelectorAll('[data-stage-panel]'));
        if (!list || tabs.length < 2 || tabs.length !== panels.length) return;

        const panelFor = (tab) => panels.find((panel) => panel.id === tab.getAttribute('aria-controls'));
        if (tabs.some((tab) => !panelFor(tab))) return;

        const select = (tab, { focus = false, updateHash = false } = {}) => {
            tabs.forEach((item) => {
                const selected = item === tab;
                item.setAttribute('aria-selected', String(selected));
                item.tabIndex = selected ? 0 : -1;
                panelFor(item).hidden = !selected;
            });

            if (focus) tab.focus({ preventScroll: true });
            if (updateHash) {
                const url = new URL(window.location.href);
                url.hash = panelFor(tab).id;
                window.history.replaceState(null, '', url);
            }
        };

        const tabFromHash = () => {
            let id;
            try {
                id = decodeURIComponent(window.location.hash.slice(1));
            } catch {
                return null;
            }
            const target = document.getElementById(id);
            return tabs.find((tab) => {
                const panel = panelFor(tab);
                return panel.id === id || (target && panel.contains(target));
            });
        };

        list.setAttribute('role', 'tablist');
        tabs.forEach((tab) => {
            const panel = panelFor(tab);
            tab.setAttribute('role', 'tab');
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', tab.id);
            panel.tabIndex = 0;

            tab.addEventListener('click', () => select(tab, { updateHash: true }));
            tab.addEventListener('keydown', (event) => {
                const index = tabs.indexOf(tab);
                let next;
                if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
                else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = tabs.length - 1;
                else return;
                event.preventDefault();
                select(tabs[next], { focus: true, updateHash: true });
            });
        });

        select(tabFromHash() || tabs[0]);
        list.hidden = false;
        group.classList.add('is-stage-tabs-ready');

        window.addEventListener('hashchange', () => {
            const tab = tabFromHash();
            if (!tab) return;
            select(tab);
            const target = document.getElementById(window.location.hash.slice(1));
            if (target) target.scrollIntoView({ block: 'start' });
        });
    });
})();
