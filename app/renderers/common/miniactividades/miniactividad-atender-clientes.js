(() => {
  'use strict';

  const tr = (text) => {
    try {
      if (window.I18N && typeof window.I18N.tr === 'function') return window.I18N.tr(text);
    } catch (_) {}
    return text;
  };

  const lang = () => {
    try {
      if (window.I18N && typeof window.I18N.getLang === 'function') return window.I18N.getLang();
    } catch (_) {}
    try {
      const stored = String(localStorage.getItem('adamis_lang') || '').toLowerCase();
      if (stored.startsWith('en')) return 'en';
    } catch (_) {}
    return 'es';
  };

  const STYLE_ID = 'mini-atender-clientes-style';
  const HINT_DELAY_MS = 60000;

  function formatHintTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = `
      .tpl--miniact-atender-clientes{
        position:relative;
        padding:28px 20px 90px;
        display:flex;
        flex-direction:column;
        gap:16px;
        align-items:center;
        justify-content:center;
        min-height:70vh;
      }
      .care-shell{
        width:min(1180px, calc(100vw - 24px));
        max-width:100%;
        box-sizing:border-box;
        background:
          radial-gradient(circle at top, rgba(14,165,233,.14), transparent 34%),
          linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border:1px solid #e5e7eb;
        border-radius:26px;
        padding:24px 24px 22px;
        box-shadow:0 26px 60px rgba(15,23,42,.12);
      }
      .care-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:16px;
        margin-bottom:10px;
      }
      .care-title{
        margin:0;
        font-size:28px;
        font-weight:900;
        color:#0f172a;
      }
      .care-progress{
        font-size:12px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#475569;
      }
      .care-instructions{
        margin:0 0 18px 0;
        font-size:14px;
        color:#334155;
      }
      .care-grid{
        display:grid;
        grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));
        gap:24px;
      }
      .care-channel{
        position:relative;
        border:2px solid #dbe3ee;
        border-radius:24px;
        background:#ffffff;
        padding:18px;
        box-shadow:0 18px 34px rgba(15,23,42,.08);
        transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        cursor:pointer;
      }
      .care-channel:hover{
        transform:translateY(-1px);
        box-shadow:0 22px 40px rgba(15,23,42,.12);
        border-color:#38bdf8;
      }
      .care-channel.is-done{
        border-color:#16a34a;
        background:#f0fdf4;
      }
      .care-channel-badge{
        position:absolute;
        top:14px;
        right:14px;
        min-width:34px;
        height:34px;
        border-radius:999px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:0 10px;
        background:#ef4444;
        color:#ffffff;
        font-size:13px;
        font-weight:900;
        box-shadow:0 10px 22px rgba(239,68,68,.28);
      }
      .care-channel.is-done .care-channel-badge{
        background:#16a34a;
        box-shadow:0 10px 22px rgba(22,163,74,.24);
      }
      .care-channel-media{
        width:100%;
        aspect-ratio:1;
        border-radius:20px;
        background:#dbe7f2;
        background-size:cover;
        background-position:center;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#475569;
        font-size:12px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        border:1px solid #cbd5e1;
      }
      .care-channel-media.has-image{
        background-color:#f8fafc;
      }
      .care-channel-label{
        margin-top:14px;
        font-size:18px;
        font-weight:900;
        color:#0f172a;
      }
      .care-channel-copy{
        margin-top:6px;
        font-size:13px;
        color:#475569;
      }
      .care-actions{
        display:flex;
        gap:12px;
        align-items:center;
        margin-top:18px;
        flex-wrap:wrap;
      }
      .care-btn{
        appearance:none;
        border:none;
        border-radius:12px;
        padding:11px 15px;
        font-weight:800;
        cursor:pointer;
      }
      .care-btn.secondary{
        background:#e2e8f0;
        color:#0f172a;
      }
      .care-btn.primary{
        background:#111827;
        color:#ffffff;
        box-shadow:0 12px 26px rgba(17,24,39,.25);
      }
      .care-feedback{
        min-height:20px;
        font-size:14px;
        font-weight:800;
      }
      .care-feedback.ok{ color:#16a34a; }
      .care-feedback.err{ color:#dc2626; }
      .care-feedback.info{ color:#2563eb; }
      .care-overlay,
      .care-intro{
        position:fixed;
        inset:0;
        background:rgba(15,23,42,.45);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:6;
        padding:24px;
      }
      .care-modal{
        width:min(1100px, calc(100vw - 24px));
        max-height:min(720px, calc(100vh - 48px));
        display:grid;
        grid-template-columns:320px minmax(0, 1fr);
        gap:0;
        overflow:hidden;
        background:#ffffff;
        border-radius:24px;
        box-shadow:0 28px 70px rgba(0,0,0,.28);
      }
      .care-sidebar{
        padding:18px;
        background:linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        border-right:1px solid #e5e7eb;
        display:flex;
        flex-direction:column;
        gap:12px;
        min-height:0;
      }
      .care-modal-title{
        margin:0;
        font-size:22px;
        font-weight:900;
        color:#0f172a;
      }
      .care-modal-subtitle{
        font-size:12px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .care-notifications{
        display:flex;
        flex-direction:column;
        gap:10px;
        overflow:auto;
        min-height:0;
      }
      .care-notification{
        appearance:none;
        width:100%;
        border:1px solid #dbe3ee;
        border-radius:16px;
        background:#ffffff;
        padding:12px;
        text-align:left;
        box-shadow:0 10px 24px rgba(15,23,42,.05);
        cursor:pointer;
        transition:border-color .22s ease, box-shadow .22s ease, background-color .22s ease;
      }
      .care-notification:hover{
        border-color:#38bdf8;
      }
      .care-notification.is-active{
        border-color:#2563eb;
        background:#eff6ff;
        box-shadow:0 0 0 3px rgba(37,99,235,.12);
      }
      .care-notification.is-replied{
        border-color:#16a34a;
        background:#f0fdf4;
      }
      .care-notification-subject{
        font-size:14px;
        font-weight:900;
        color:#0f172a;
        margin-bottom:6px;
      }
      .care-notification-from{
        font-size:12px;
        color:#475569;
      }
      .care-notification-status{
        margin-top:8px;
        display:inline-flex;
        border-radius:999px;
        padding:5px 9px;
        font-size:11px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        background:#fee2e2;
        color:#991b1b;
      }
      .care-notification.is-replied .care-notification-status{
        background:#dcfce7;
        color:#166534;
      }
      .care-main{
        padding:20px 22px;
        display:flex;
        flex-direction:column;
        gap:16px;
        min-height:0;
      }
      .care-message-meta{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        color:#475569;
        font-size:13px;
      }
      .care-message-card{
        border:1px solid #e5e7eb;
        border-radius:18px;
        background:#f8fafc;
        padding:16px;
      }
      .care-message-subject{
        font-size:18px;
        font-weight:900;
        color:#0f172a;
        margin-bottom:10px;
      }
      .care-message-body{
        font-size:15px;
        line-height:1.55;
        color:#1f2937;
        white-space:pre-wrap;
      }
      .care-reply-label{
        font-size:12px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#64748b;
      }
      .care-reply{
        width:100%;
        min-height:150px;
        border:2px solid #dbe3ee;
        border-radius:18px;
        padding:14px 16px;
        font:inherit;
        color:#0f172a;
        background:#ffffff;
        resize:vertical;
        box-sizing:border-box;
      }
      .care-reply:focus{
        outline:none;
        border-color:#38bdf8;
        box-shadow:0 0 0 3px rgba(56,189,248,.15);
      }
      .care-main-actions{
        display:flex;
        gap:12px;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
      }
      .care-inline-feedback{
        font-size:14px;
        font-weight:800;
        color:#16a34a;
      }
      .care-empty{
        border:1px dashed #cbd5e1;
        border-radius:18px;
        padding:24px;
        color:#64748b;
        text-align:center;
        background:#f8fafc;
      }
      .care-intro-card{
        width:min(520px, 92vw);
        background:#ffffff;
        border-radius:20px;
        padding:20px 22px;
        box-shadow:0 24px 60px rgba(0,0,0,.28);
      }
      .care-intro-title{
        margin:0 0 6px 0;
        font-size:20px;
        font-weight:800;
        color:#0f172a;
      }
      .care-intro-text{
        margin:0 0 16px 0;
        font-size:14px;
        color:#334155;
      }
      .care-confetti{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:3;
      }
      @media (max-width: 900px){
        .care-modal{
          grid-template-columns:1fr;
          max-height:min(820px, calc(100vh - 32px));
        }
        .care-sidebar{
          border-right:none;
          border-bottom:1px solid #e5e7eb;
          max-height:280px;
        }
      }
      @media (max-width: 640px){
        .care-shell{
          padding:18px 16px 18px;
        }
        .care-head{
          flex-direction:column;
          align-items:flex-start;
        }
      }
    `;
    document.head.appendChild(css);
  }

  function normalizeNotifications(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const subject = String(raw?.subject ?? raw?.asunto ?? raw?.title ?? `Mensaje ${idx + 1}`).trim();
      const from = String(raw?.from ?? raw?.de ?? raw?.sender ?? '').trim();
      const body = String(raw?.body ?? raw?.mensaje ?? raw?.text ?? '').trim();
      const replyText = String(raw?.replyText ?? raw?.respuesta ?? raw?.reply ?? '').trim();
      if (!body) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        subject,
        from,
        body,
        replyText,
        sentText: String(raw?.sentText ?? raw?.confirmacion ?? '').trim()
      };
    }).filter(Boolean);
  }

  function normalizeChannels(input) {
    const list = Array.isArray(input) ? input : [];
    return list.map((raw, idx) => {
      const notifications = normalizeNotifications(raw?.notifications ?? raw?.notificaciones ?? raw?.messages);
      const label = String(raw?.label ?? raw?.titulo ?? raw?.title ?? raw?.name ?? `Canal ${idx + 1}`).trim();
      if (!notifications.length) return null;
      return {
        id: String(raw?.id ?? raw?.key ?? idx),
        label,
        image: String(raw?.image ?? raw?.img ?? raw?.imagen ?? '').trim(),
        alt: String(raw?.alt ?? label).trim(),
        notifications
      };
    }).filter(Boolean);
  }

  function cloneState(channels) {
    return channels.map((channel) => ({
      ...channel,
      notifications: channel.notifications.map((notification) => ({
        ...notification,
        replied: false,
        draft: notification.replyText
      }))
    }));
  }

  function launchConfetti(root) {
    const cv = document.createElement('canvas');
    cv.className = 'care-confetti';
    root.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    function resize() {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width * dpr));
      h = Math.max(1, Math.floor(rect.height * dpr));
      cv.width = w;
      cv.height = h;
      cv.style.width = rect.width + 'px';
      cv.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const colors = ['#0ea5e9', '#16a34a', '#f59e0b', '#ef4444', '#0f172a'];
    const particles = [];
    for (let i = 0; i < 90; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 4.5;
      particles.push({
        x: (w / dpr) * 0.5,
        y: (h / dpr) * 0.24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: Math.random() * 0.2 - 0.1,
        life: 65 + Math.random() * 35,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.16;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 70));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        ctx.restore();
        if (p.life <= 0 || p.y > (h / dpr) + 50) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      if (particles.length) requestAnimationFrame(tick);
      else cv.remove();
    }

    requestAnimationFrame(tick);
  }

  SlideRendererRegistry.register('miniactividad-atender-clientes', function (s, root) {
    ensureStyles();
    root.classList.add('tpl--miniact-atender-clientes');

    const isEn = lang() === 'en';
    const sourceChannels = isEn
      ? (s?.channels_en ?? s?.canales_en ?? s?.channels ?? s?.canales)
      : (s?.channels ?? s?.canales);
    const channelDefs = normalizeChannels(sourceChannels);

    if (!channelDefs.length) {
      root.innerHTML = `<div class="empty-state__text">${tr('No hay canales para atender.')}</div>`;
      return { suppressRootClick: true, noLock: true };
    }

    const titleText = tr(String(s?.title || s?.titulo || 'Miniactividad'));
    const introTitle = tr(String(s?.introTitle || s?.intro?.title || 'Antes de empezar'));
    const introText = tr(String(s?.introText || s?.intro?.text || 'Responde a los clientes.'));
    const introButtonText = tr(String(s?.introButtonText || s?.intro?.buttonText || 'Empezar'));
    const autoAdvanceMs = Math.max(500, Number(s?.autoAdvanceMs ?? 1600));

    const shell = document.createElement('div');
    shell.className = 'care-shell';
    const head = document.createElement('div');
    head.className = 'care-head';
    const title = document.createElement('h2');
    title.className = 'care-title';
    title.textContent = titleText;
    const progress = document.createElement('div');
    progress.className = 'care-progress';
    head.appendChild(title);
    head.appendChild(progress);

    const instructions = document.createElement('p');
    instructions.className = 'care-instructions';
    instructions.textContent = tr('Pulsa un canal, abre una notificacion y envia la respuesta ya preparada.');

    const grid = document.createElement('div');
    grid.className = 'care-grid';

    const actions = document.createElement('div');
    actions.className = 'care-actions';
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'care-btn secondary';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'care-btn secondary';
    resetBtn.textContent = tr('Reiniciar mensajes');
    const feedback = document.createElement('div');
    feedback.className = 'care-feedback';
    actions.appendChild(hintBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(feedback);

    shell.appendChild(head);
    shell.appendChild(instructions);
    shell.appendChild(grid);
    shell.appendChild(actions);
    root.appendChild(shell);

    let channels = cloneState(channelDefs);
    let modal = null;
    let activeChannelId = null;
    let activeNotificationId = null;
    let advanced = false;
    let advanceTimer = null;
    let hintInterval = null;
    const hintReadyAt = Date.now() + HINT_DELAY_MS;
    const channelButtons = new Map();

    function setFeedback(type, text) {
      feedback.className = 'care-feedback' + (type ? ` ${type}` : '');
      feedback.textContent = text || '';
    }

    function updateHintButton() {
      const remaining = hintReadyAt - Date.now();
      if (remaining <= 0) {
        hintBtn.disabled = false;
        hintBtn.textContent = tr('Pista');
        if (hintInterval) {
          clearInterval(hintInterval);
          hintInterval = null;
        }
        return;
      }
      hintBtn.disabled = true;
      hintBtn.textContent = `${tr('Pista')} (${formatHintTime(remaining)})`;
    }

    function totalNotifications() {
      return channels.reduce((acc, channel) => acc + channel.notifications.length, 0);
    }

    function repliedNotifications() {
      return channels.reduce((acc, channel) => acc + channel.notifications.filter((item) => item.replied).length, 0);
    }

    function unresolvedCount(channel) {
      return channel.notifications.filter((item) => !item.replied).length;
    }

    function updateProgress() {
      progress.textContent = `${tr('Mensajes')} ${repliedNotifications()} / ${totalNotifications()}`;
    }

    function goNextSlide() {
      if (advanced) return;
      advanced = true;
      if (window.SlideActions && typeof window.SlideActions.next === 'function') {
        window.SlideActions.next();
      }
    }

    function maybeComplete() {
      updateProgress();
      if (repliedNotifications() !== totalNotifications()) {
        setFeedback('err', tr('Aun quedan clientes por atender.'));
        return;
      }
      setFeedback('ok', tr('Ya has respondido a todos los clientes.'));
      launchConfetti(root);
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => {
        if (!root.isConnected) return;
        goNextSlide();
      }, autoAdvanceMs);
    }

    function renderChannels() {
      grid.innerHTML = '';
      channelButtons.clear();
      channels.forEach((channel) => {
        const unresolved = unresolvedCount(channel);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'care-channel' + (unresolved === 0 ? ' is-done' : '');

        const badge = document.createElement('div');
        badge.className = 'care-channel-badge';
        badge.textContent = String(unresolved);

        const media = document.createElement('div');
        media.className = 'care-channel-media';
        if (channel.image) {
          media.classList.add('has-image');
          media.style.backgroundImage = `url("${channel.image.replace(/"/g, '&quot;')}")`;
        } else {
          media.textContent = tr('Imagen');
        }

        const label = document.createElement('div');
        label.className = 'care-channel-label';
        label.textContent = channel.label;

        const copy = document.createElement('div');
        copy.className = 'care-channel-copy';
        copy.textContent = unresolved === 0
          ? tr('Respondido')
          : `${unresolved} ${tr('Notificaciones').toLowerCase()}`;

        btn.appendChild(badge);
        btn.appendChild(media);
        btn.appendChild(label);
        btn.appendChild(copy);
        btn.addEventListener('click', () => {
          openChannel(channel.id);
        });
        grid.appendChild(btn);
        channelButtons.set(channel.id, btn);
      });
      updateProgress();
    }

    function closeModal() {
      if (!modal) return;
      modal.remove();
      modal = null;
      activeChannelId = null;
      activeNotificationId = null;
    }

    function findChannel(channelId) {
      return channels.find((channel) => channel.id === channelId) || null;
    }

    function findNotification(channel, notificationId) {
      if (!channel) return null;
      return channel.notifications.find((item) => item.id === notificationId) || null;
    }

    function renderModalContent(container) {
      const channel = findChannel(activeChannelId);
      if (!channel) return;
      const current = findNotification(channel, activeNotificationId)
        || channel.notifications.find((item) => !item.replied)
        || channel.notifications[0];
      activeNotificationId = current ? current.id : null;

      container.innerHTML = '';
      const sidebar = document.createElement('div');
      sidebar.className = 'care-sidebar';
      const title = document.createElement('h3');
      title.className = 'care-modal-title';
      title.textContent = channel.label;
      const subtitle = document.createElement('div');
      subtitle.className = 'care-modal-subtitle';
      subtitle.textContent = tr('Notificaciones');
      const notifications = document.createElement('div');
      notifications.className = 'care-notifications';

      channel.notifications.forEach((notification) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'care-notification'
          + (notification.id === activeNotificationId ? ' is-active' : '')
          + (notification.replied ? ' is-replied' : '');
        const subject = document.createElement('div');
        subject.className = 'care-notification-subject';
        subject.textContent = notification.subject;
        const from = document.createElement('div');
        from.className = 'care-notification-from';
        from.textContent = notification.from || channel.label;
        const status = document.createElement('div');
        status.className = 'care-notification-status';
        status.textContent = tr(notification.replied ? 'Respondido' : 'Sin leer');
        btn.appendChild(subject);
        btn.appendChild(from);
        btn.appendChild(status);
        btn.addEventListener('click', () => {
          activeNotificationId = notification.id;
          renderModalContent(container);
        });
        notifications.appendChild(btn);
      });

      sidebar.appendChild(title);
      sidebar.appendChild(subtitle);
      sidebar.appendChild(notifications);

      const main = document.createElement('div');
      main.className = 'care-main';

      if (!current) {
        const empty = document.createElement('div');
        empty.className = 'care-empty';
        empty.textContent = tr('Ya has respondido a todos los clientes.');
        main.appendChild(empty);
      } else {
        const meta = document.createElement('div');
        meta.className = 'care-message-meta';
        const from = document.createElement('div');
        from.textContent = `${current.from || channel.label}`;
        const state = document.createElement('div');
        state.textContent = tr(current.replied ? 'Respondido' : 'Sin leer');
        meta.appendChild(from);
        meta.appendChild(state);

        const card = document.createElement('div');
        card.className = 'care-message-card';
        const subject = document.createElement('div');
        subject.className = 'care-message-subject';
        subject.textContent = current.subject;
        const body = document.createElement('div');
        body.className = 'care-message-body';
        body.textContent = current.body;
        card.appendChild(subject);
        card.appendChild(body);

        const replyLabel = document.createElement('div');
        replyLabel.className = 'care-reply-label';
        replyLabel.textContent = tr('Respuesta preparada');

        const textarea = document.createElement('textarea');
        textarea.className = 'care-reply';
        textarea.value = current.draft;
        textarea.disabled = current.replied;
        textarea.addEventListener('input', () => {
          current.draft = textarea.value;
        });

        const row = document.createElement('div');
        row.className = 'care-main-actions';
        const left = document.createElement('div');
        left.className = 'care-inline-feedback';
        left.textContent = current.replied
          ? (current.sentText || tr('Se ha enviado una respuesta correctamente.'))
          : '';
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.gap = '12px';
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'care-btn secondary';
        closeBtn.textContent = tr('Cerrar canal');
        closeBtn.addEventListener('click', closeModal);
        const sendBtn = document.createElement('button');
        sendBtn.type = 'button';
        sendBtn.className = 'care-btn primary';
        sendBtn.textContent = tr('Enviar');
        sendBtn.disabled = current.replied;
        sendBtn.addEventListener('click', () => {
          current.replied = true;
          current.draft = textarea.value;
          renderChannels();
          renderModalContent(container);
          setFeedback('info', current.sentText || tr('Se ha enviado una respuesta correctamente.'));
          maybeComplete();
        });
        buttonRow.appendChild(closeBtn);
        buttonRow.appendChild(sendBtn);
        row.appendChild(left);
        row.appendChild(buttonRow);

        main.appendChild(meta);
        main.appendChild(card);
        main.appendChild(replyLabel);
        main.appendChild(textarea);
        main.appendChild(row);
      }

      container.appendChild(sidebar);
      container.appendChild(main);
    }

    function openChannel(channelId) {
      const channel = findChannel(channelId);
      if (!channel) return;
      activeChannelId = channelId;
      activeNotificationId = (channel.notifications.find((item) => !item.replied) || channel.notifications[0])?.id || null;
      closeModal();
      activeChannelId = channelId;
      const overlay = document.createElement('div');
      overlay.className = 'care-overlay';
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay) closeModal();
      });
      const content = document.createElement('div');
      content.className = 'care-modal';
      overlay.appendChild(content);
      root.appendChild(overlay);
      modal = overlay;
      renderModalContent(content);
    }

    function applyHint() {
      if (modal && activeChannelId) {
        setFeedback('info', tr('La respuesta ya esta preparada. Solo tienes que pulsar enviar.'));
        return;
      }
      const pendingChannel = channels
        .map((channel) => ({ channel, pending: unresolvedCount(channel) }))
        .filter((entry) => entry.pending > 0)
        .sort((a, b) => b.pending - a.pending)[0];
      if (!pendingChannel) {
        setFeedback('ok', tr('Ya has respondido a todos los clientes.'));
        return;
      }
      setFeedback('info', `${tr('Todavia tienes mensajes sin responder en ')}${pendingChannel.channel.label}.`);
    }

    function resetState() {
      if (advanceTimer) clearTimeout(advanceTimer);
      advanced = false;
      closeModal();
      channels = cloneState(channelDefs);
      setFeedback('', '');
      renderChannels();
    }

    renderChannels();
    setFeedback('err', tr('Aun quedan clientes por atender.'));
    updateHintButton();
    hintInterval = setInterval(updateHintButton, 1000);

    hintBtn.addEventListener('click', () => {
      if (hintBtn.disabled) return;
      applyHint();
    });
    resetBtn.addEventListener('click', resetState);

    const intro = document.createElement('div');
    intro.className = 'care-intro';
    const introCard = document.createElement('div');
    introCard.className = 'care-intro-card';
    const introH = document.createElement('h3');
    introH.className = 'care-intro-title';
    introH.textContent = introTitle;
    const introP = document.createElement('p');
    introP.className = 'care-intro-text';
    introP.textContent = introText;
    const introBtn = document.createElement('button');
    introBtn.type = 'button';
    introBtn.className = 'care-btn primary';
    introBtn.textContent = introButtonText;
    introBtn.addEventListener('click', () => {
      intro.remove();
    });
    introCard.appendChild(introH);
    introCard.appendChild(introP);
    introCard.appendChild(introBtn);
    intro.appendChild(introCard);
    root.appendChild(intro);

    return { suppressRootClick: true, noLock: true };
  });
})();
