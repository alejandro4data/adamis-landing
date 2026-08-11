(() => {
    'use strict';

    const root = document.documentElement;
    const requestDialogPanel = document.querySelector('[data-request-dialog-panel]');
    const requestDialog = requestDialogPanel?.closest('dialog');
    const requestForm = requestDialog?.querySelector('[data-request-form]');
    const requestTitle = requestDialog?.querySelector('#requestDialogTitle');
    const requestIntro = requestDialog?.querySelector('#requestDialogIntro');
    const requestInterest = requestForm?.querySelector('[name="interest"]');
    const requestAudience = requestForm?.querySelector('[name="audience"]');
    const requestSubmit = requestForm?.querySelector('[data-form-submit]');
    const requestSubmitLabel = requestSubmit?.querySelector('[data-request-submit-label]');
    const requestStatus = requestForm?.querySelector('[data-form-status]');
    const requestClose = requestDialog?.querySelector('[data-request-dialog-close]');
    const requestTriggers = Array.from(document.querySelectorAll('[data-request-modal][data-request-type="taller"]'));
    const requestCopy = {
        title: requestDialog?.dataset.requestTitle || 'Solicitar taller',
        intro: requestDialog?.dataset.requestIntro || 'Cuéntanos vuestro contexto y os ayudaremos a preparar un taller que encaje con el centro.',
        interest: 'Taller inicial',
        source: 'modal-taller'
    };
    let requestOpener = null;

    const unlockRequestDialog = () => {
        document.body.classList.remove('request-dialog-open');
        root.style.removeProperty('--request-scrollbar-gap');
    };

    const closeRequestDialog = () => {
        if (requestDialog?.open) requestDialog.close();
    };

    const openRequestDialog = (trigger) => {
        if (!requestDialog || !requestForm || typeof requestDialog.showModal !== 'function') return;

        requestOpener = trigger;
        requestForm.reset();
        if (requestDialogPanel) requestDialogPanel.scrollTop = 0;
        requestForm.dataset.sourceContext = requestCopy.source;
        if (requestAudience) requestAudience.value = 'Centro escolar';
        if (requestInterest) requestInterest.value = requestCopy.interest;
        if (requestTitle) requestTitle.textContent = requestCopy.title;
        if (requestIntro) requestIntro.textContent = requestCopy.intro;
        if (requestSubmitLabel) requestSubmitLabel.textContent = requestCopy.title;
        if (requestSubmit) requestSubmit.disabled = false;
        if (requestStatus) {
            requestStatus.className = 'form-status';
            requestStatus.textContent = '';
        }
        window.AdamisInfoForms?.syncSource?.(requestForm);

        const siteHeader = document.querySelector('[data-site-header]');
        const menuToggle = document.querySelector('[data-menu-toggle]');
        if (siteHeader?.classList.contains('is-menu-open')) menuToggle?.click();
        menuToggle?.setAttribute('aria-expanded', 'false');
        const menuToggleLabel = menuToggle?.querySelector('.visually-hidden');
        if (menuToggleLabel) menuToggleLabel.textContent = menuToggle?.dataset.menuOpenLabel || 'Abrir menú';

        const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        root.style.setProperty('--request-scrollbar-gap', `${scrollbarGap}px`);
        document.body.classList.add('request-dialog-open');
        requestDialog.showModal();
        window.requestAnimationFrame(() => requestTitle?.focus({ preventScroll: true }));
    };

    requestTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => openRequestDialog(trigger));
    });

    requestClose?.addEventListener('click', closeRequestDialog);
    requestDialog?.addEventListener('click', (event) => {
        if (event.target === requestDialog) closeRequestDialog();
    });
    requestDialog?.addEventListener('close', () => {
        unlockRequestDialog();
        if (requestOpener?.isConnected) requestOpener.focus({ preventScroll: true });
        requestOpener = null;
    });
})();
