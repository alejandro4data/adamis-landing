(() => {
  'use strict';

  SlideRendererRegistry.register('cuadro-reflexion', function(s, root /*, ctx */){
    root.classList.add('tpl--cuadro-reflexion');

    const wrap = document.createElement('div');
    wrap.className = 'reflexion-wrap center-box';

    // Pregunta
    const qText = String(s.pregunta || '').trim();
    const h2 = document.createElement('h2');
    h2.className = 'reflexion-question';
    h2.textContent = qText || 'Cuadro de reflexión';
    wrap.appendChild(h2);

    // Área de escritura
    const box = document.createElement('div');
    box.className = 'reflexion-box';

    const ta = document.createElement('textarea');
    if (s.ruled !== false) ta.classList.add('is-ruled');
    ta.className = 'reflexion-input';
    ta.placeholder = s.placeholder || 'Escribe aquí tu idea principal…';
    ta.setAttribute('aria-label', 'Tu respuesta');
    ta.spellcheck = true;
    ta.autocapitalize = 'sentences';
    ta.autocomplete = 'off';
    const MAX_CHARS = 500;
    ta.maxLength = MAX_CHARS;
    if (s.value) ta.value = String(s.value);
    box.appendChild(ta);

    const prog = document.createElement('div');
    prog.className = 'reflexion-progress';
    const progBar = document.createElement('div');
    progBar.className = 'reflexion-progress__bar';
    const progLabel = document.createElement('span');
    progLabel.className = 'reflexion-progress__label';
    prog.append(progBar, progLabel);
    box.appendChild(prog);
    wrap.appendChild(box);

    // Meta
    const meta = document.createElement('div');
    meta.className = 'reflexion-meta';
    const count = document.createElement('span');
    count.className = 'reflexion-count';
    const minChars = 0;
    const maxChars = MAX_CHARS;

    function refreshCount(){
      const len = ta.value.length;
      count.textContent = maxChars > 0 ? `${len}/${maxChars}` : `${len} caracteres`;
      const p = Math.max(0, Math.min(1, len / maxChars));
      if (progBar){
        progBar.style.width = Math.round(p * 100) + '%';
        progBar.classList.remove('is-low','is-warn','is-ok');
        if (len < 15){
          progBar.classList.add('is-low');
          progLabel.textContent = 'Respuesta muy corta';
        } else if (len < 40){
          progBar.classList.add('is-warn');
          progLabel.textContent = 'Longitud aceptable';
        } else {
          progBar.classList.add('is-ok');
          progLabel.textContent = 'Buena longitud de respuesta';
        }
      }
    }
    refreshCount();

    meta.appendChild(count);
    wrap.appendChild(meta);

    // Acciones
    const actions = document.createElement('div');
    actions.className = 'reflexion-actions';

    const status = document.createElement('div');
    status.className = 'reflexion-status';
    actions.appendChild(status);

    const btnEval = document.createElement('button');
    btnEval.type = 'button';
    btnEval.className = 'btn btn--primary';
    btnEval.textContent = s.evalText || 'Evaluar';

    const btnsRight = document.createElement('div');
    btnsRight.className = 'reflexion-actions__right';
    btnsRight.appendChild(btnEval);
    actions.appendChild(btnsRight);

    wrap.appendChild(actions);
    root.appendChild(wrap);

    // Eventos UI
    ta.addEventListener('input', refreshCount);

    function setBusy(v){
      btnEval.disabled = v;
      actions.classList.toggle('is-busy', v);
      status.textContent = v ? 'Evaluando…' : '';
      status.classList.toggle('is-error', false);
    }

    function wire(onAdvance){
      btnEval.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        const answer = ta.value.trim();

        status.classList.remove('is-error');
        setBusy(true);

        const payload = { question: qText, answer, meta: { slideId: s.id ?? null } };

        try{
          let result = null;

          if (typeof s.onEvaluate === 'function'){
            result = await s.onEvaluate(payload);
          } else if (s.apiEvaluate && s.apiEvaluate.url){
            const method = s.apiEvaluate.method || 'POST';
            const headers = Object.assign({'Content-Type':'application/json'}, s.apiEvaluate.headers || {});
            const resp = await fetch(s.apiEvaluate.url, { method, headers, body: JSON.stringify(payload) });
            result = await resp.json().catch(()=>null);
          }

          window.SLIDE_LAST_REFLEXION = payload;
          if (result != null) window.SLIDE_LAST_REFLEXION_RESULT = result;

          // >>> ENVIAR EVENTO GLOBAL PARA GUARDAR EN BACKEND <<<
          try {
            window.dispatchEvent(new CustomEvent('encuesta:submit', {
              detail: {
                id: s.id || null,        // a_r_1, d_r_2, etc.
                respuesta: answer       // texto del alumno
              }
            }));
          } catch(_e){}


          if (typeof s.onResult === 'function'){
            try { s.onResult(result, payload); } catch(_e){}
          }
        } catch(_err){
          status.textContent = 'No se pudo evaluar ahora. Tu respuesta se ha guardado.';
          status.classList.add('is-error');
        } finally {
          setBusy(false);
          if (s.advanceOnSubmit !== false && typeof onAdvance === 'function') onAdvance();
        }
      });

      if (s.autoFocus !== false){
        setTimeout(() => { try{ ta.focus(); } catch(_e){} }, 50);
      }
    }

    wrap.addEventListener('click', (ev) => ev.stopPropagation());
    wrap.addEventListener('keydown', (ev) => ev.stopPropagation(), true);

    return {
      lockText: qText,
      bindTyping(){},
      hint: null,
      noLock: true,
      suppressRootClick: true,
      bindControls: wire
    };
  });

})();
