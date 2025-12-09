(() => {
  'use strict';

  function makeEncuestaRenderer(s, root, ctx){
    const { makeHint, CONT_LABEL } = ctx;

    // --- contenedor base ---
    root.classList.add('tpl--encuesta', 'layout--top');
    const wrap = document.createElement('div');
    wrap.className = 'poll';
    root.appendChild(wrap);

    // --- cabecera / pregunta ---
    const q = document.createElement('h1');
    q.className = 'poll__question';
    q.textContent = String(s.pregunta || s.question || s.prompt || 'Pregunta');
    wrap.appendChild(q);

    // --- formulario ---
    const form = document.createElement('form');
    form.className = 'poll__form';
    form.noValidate = true;
    wrap.appendChild(form);

    // --- config ---
    const mode = String(s.mode || s.modo || s.tipoEncuesta || '').toLowerCase() || 'choice';
    const required = ('required' in s) ? !!s.required : true;
    const allowSkip = !!s.allowSkip;
    const advanceOnSubmit = ('advanceOnSubmit' in s) ? !!s.advanceOnSubmit : true;

    // --- id / estado persistente ---
    const id = String(s.id || s.storageKey || ('encuesta_' + Math.abs((q.textContent||'').split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0))));
    const lsKey = 'poll:' + id;

    let currentValue = null;
    try {
      const prev = localStorage.getItem(lsKey);
      if (prev != null) currentValue = JSON.parse(prev);
    } catch(_e){}

    function setValue(v){
      currentValue = v;
      try { localStorage.setItem(lsKey, JSON.stringify(v)); } catch(_e){}
      (window.ENCUESTA_RESPUESTAS ||= {})[id] = {
        id, mode, question: q.textContent, value: v, ts: Date.now()
      };
      window.ENCUESTA_LAST = { id, mode, question: q.textContent, value: v };
      window.dispatchEvent(new CustomEvent('encuesta:change', { detail: window.ENCUESTA_LAST }));
      updateBtnState();
    }
    function isAnswered(){
      if (mode === 'text')  return (currentValue != null && String(currentValue).trim().length > 0);
      if (mode === 'scale') return (currentValue != null && !Number.isNaN(+currentValue));
      return currentValue != null; // choice
    }

    // --- acciones (DENTRO DEL FORM) ---
    const actions = document.createElement('div');
    actions.className = 'poll__actions';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--primary';
    submitBtn.textContent = String(s.submitText || 'Continuar');

    actions.appendChild(submitBtn);

    if (allowSkip){
      const skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'btn btn--ghost';
      skip.textContent = String(s.skipText || 'Saltar');
      skip.addEventListener('click', () => {
        setValue(currentValue ?? null);
        window.dispatchEvent(new CustomEvent('encuesta:skip', { detail: { id, mode, question: q.textContent }}));
        if (advanceOnSubmit) __advance();
      });
      actions.appendChild(skip);
    }

    function updateBtnState(){
      submitBtn.disabled = required ? !isAnswered() : false;
    }

    // --- UI según modo ---
    if (mode === 'choice' || mode === 'multiple' || mode === 'opcion' || mode === 'opciones'){
      const opts = Array.isArray(s.opciones) ? s.opciones
                : Array.isArray(s.options)  ? s.options
                : [];
      const shuffled = s.shuffle ? [...opts].sort(() => Math.random() - 0.5) : opts;

      const list = document.createElement('div');
      list.className = 'poll__options';
      form.appendChild(list);

      shuffled.forEach((label, idx) => {
        const optId = `${id}__opt_${idx}`;
        const row = document.createElement('label');
        row.className = 'poll__option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = id;
        input.value = label;
        input.id = optId;
        input.required = !!required;

        const faux = document.createElement('span');
        faux.className = 'poll__option-faux';

        const text = document.createElement('span');
        text.className = 'poll__option-label';
        text.textContent = String(label);

        row.appendChild(input);
        row.appendChild(faux);
        row.appendChild(text);
        list.appendChild(row);

        input.addEventListener('change', () => { setValue(input.value); });
        if (currentValue != null && currentValue === label) input.checked = true;
      });
    }
    else if (mode === 'text' || mode === 'texto' || mode === 'open'){
      const max = (typeof s.maxLength === 'number' && s.maxLength>0) ? s.maxLength : (s.maxChars|0) || 0;
      const min = (typeof s.minLength === 'number' && s.minLength>0) ? s.minLength : (s.minChars|0) || 0;

      const box = document.createElement('div');
      box.className = 'poll__textwrap';
      const ta = document.createElement('textarea');
      ta.className = 'poll__textarea';
      ta.placeholder = String(s.placeholder || 'Escribe aquí tu respuesta…');
      if (max) ta.maxLength = max;
      if (min) ta.setAttribute('data-min', String(min));
      box.appendChild(ta);

      const meta = document.createElement('div');
      meta.className = 'poll__textmeta';
      const counter = document.createElement('span');
      counter.className = 'poll__counter';
      meta.appendChild(counter);
      box.appendChild(meta);

      form.appendChild(box);

      function updateCounter(){
        const len = ta.value.length|0;
        counter.textContent = max ? `${len}/${max}` : `${len}`;
      }
      ta.addEventListener('input', () => { setValue(ta.value); updateCounter(); });
      if (currentValue != null) ta.value = String(currentValue);
      updateCounter();
      if (s.autoFocus ?? true) setTimeout(() => ta.focus(), 80);
    }
    else if (mode === 'scale' || mode === 'escala' || mode === 'rating'){
      const min = (typeof s.min === 'number') ? s.min : 1;
      const max = (typeof s.max === 'number') ? s.max : 10;
      const step = (typeof s.step === 'number' && s.step>0) ? s.step : 1;
      const initial = (typeof s.initial === 'number') ? s.initial : Math.round((min+max)/2);

      const box = document.createElement('div');
      box.className = 'poll__scalewrap';

      const out = document.createElement('output');
      out.className = 'poll__scaleout';

      const range = document.createElement('input');
      range.type = 'range';
      range.className = 'poll__scale';
      range.min = String(min);
      range.max = String(max);
      range.step = String(step);
      range.value = String(currentValue ?? initial);

      const labels = document.createElement('div');
      labels.className = 'poll__scalelabels';
      const minL = document.createElement('span');
      minL.textContent = String(s.labels?.min || min);
      const maxL = document.createElement('span');
      maxL.textContent = String(s.labels?.max || max);
      labels.appendChild(minL); labels.appendChild(maxL);

      box.appendChild(out);
      box.appendChild(range);
      box.appendChild(labels);
      form.appendChild(box);

      function sync(){
        out.value = range.value;
        setValue(range.value);
      }
      range.addEventListener('input', sync);
      // valor inicial + estado del botón
      sync();
    }

    // --- acciones al final del form (clave del fix) ---
    form.appendChild(actions);
    updateBtnState();

    // --- submit ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = { id, mode, question: q.textContent, value: currentValue, ts: Date.now(), meta: { required } };
      window.dispatchEvent(new CustomEvent('encuesta:submit', { detail: payload }));
      if (typeof s.onSubmit === 'function'){
        try { s.onSubmit(payload); } catch(_e){}
      }
      if (advanceOnSubmit) __advance();
    });

    // --- hint + contrato del renderer ---
    const hint = makeHint('Responde y pulsa “Continuar”');
    wrap.appendChild(hint.el);

    let __advance = () => {};
    return {
      noLock: true,
      suppressRootClick: true,
      lockText: q.textContent,
      hint,
      bindControls(tryAdvance){ __advance = tryAdvance; }
    };
  }

  function registerWithName(name){
    window.SlideRendererRegistry.register(name, (s, root, ctx) => {
      const aliases = {
        'encuesta-multiple': 'choice',
        'encuesta-texto': 'text',
        'encuesta-escala': 'scale'
      };
      const forced = aliases[name];
      if (forced) s = Object.assign({}, s, { mode: s.mode || forced });
      return makeEncuestaRenderer(s, root, ctx);
    });
  }

  registerWithName('encuesta');
  registerWithName('encuesta-multiple');
  registerWithName('encuesta-texto');
  registerWithName('encuesta-escala');
})();
