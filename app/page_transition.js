(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = false;
  var isLeaving = false;
  var TRANSITION_MS = 500;
  var NAVIGATION_DELAY_MS = TRANSITION_MS + 50;
  var ENTER_READY_TIMEOUT_MS = 1800;

  try {
    reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (_error) {
    reducedMotion = false;
  }

  installStyles();
  root.classList.add("page-transition-enabled");
  if (reducedMotion) root.classList.add("page-transition-reduced");
  startEnterTransition();

  window.AdamisPageTransition = {
    go: navigateWithTransition
  };

  document.addEventListener("click", function (event) {
    var anchor = event.target && event.target.closest
      ? event.target.closest("a[href]")
      : null;

    if (!anchor || !isEligibleClick(event, anchor)) return;

    var url = toUrl(anchor.getAttribute("href"));
    if (!url || !isInternalDocumentNavigation(url)) return;

    if (reducedMotion) return;

    event.preventDefault();
    navigateWithTransition(url.href);
  }, true);

  window.addEventListener("pageshow", function (event) {
    resetTransitionState();
    if (event.persisted) startEnterTransition();
  });
  window.addEventListener("focus", resetTransitionState);

  function navigateWithTransition(target) {
    var url = toUrl(target);
    if (!url) return;

    if (!isInternalDocumentNavigation(url) || reducedMotion) {
      window.location.assign(url.href);
      return;
    }

    if (isLeaving) return;
    isLeaving = true;
    root.classList.add("page-transition-leaving");

    window.setTimeout(function () {
      window.location.assign(url.href);
    }, NAVIGATION_DELAY_MS);
  }

  function resetTransitionState() {
    isLeaving = false;
    root.classList.remove("page-transition-leaving");
    root.classList.remove("page-transition-revealing");
  }

  function startEnterTransition() {
    if (reducedMotion) return;

    root.classList.add("page-transition-entering");

    var released = false;
    var fallbackTimer = window.setTimeout(releaseEnterTransition, ENTER_READY_TIMEOUT_MS);

    if (document.readyState === "complete") {
      window.requestAnimationFrame(releaseEnterTransition);
    } else {
      window.addEventListener("load", releaseEnterTransition, { once: true });
    }

    function releaseEnterTransition() {
      if (released) return;
      released = true;
      window.clearTimeout(fallbackTimer);

      window.requestAnimationFrame(function () {
        root.classList.add("page-transition-revealing");
        root.classList.remove("page-transition-entering");
        window.setTimeout(function () {
          root.classList.remove("page-transition-revealing");
        }, TRANSITION_MS + 120);
      });
    }
  }

  function isEligibleClick(event, anchor) {
    if (event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target && anchor.target.toLowerCase() !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.dataset && (anchor.dataset.noTransition === "true" || anchor.dataset.transition === "none")) {
      return false;
    }
    return true;
  }

  function isInternalDocumentNavigation(url) {
    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    var sameDocument = url.pathname === window.location.pathname &&
      url.search === window.location.search;

    if (sameDocument) return false;
    return true;
  }

  function toUrl(target) {
    try {
      return new URL(target, window.location.href);
    } catch (_error) {
      return null;
    }
  }

  function installStyles() {
    if (document.getElementById("adamis-page-transition-style")) return;

    var style = document.createElement("style");
    style.id = "adamis-page-transition-style";
    style.textContent = [
      "html.page-transition-enabled{background:var(--bg,#f8faf8);}",
      "html.page-transition-enabled::before{content:\"\";position:fixed;inset:0;z-index:2147483646;pointer-events:none;opacity:0;background:#fff;transition:opacity 500ms cubic-bezier(.22,1,.36,1);}",
      "html.page-transition-enabled::after{content:\"\";position:fixed;inset:-18%;z-index:2147483647;pointer-events:none;opacity:0;background:linear-gradient(112deg,transparent 0 36%,rgba(226,195,112,0) 43%,rgba(226,195,112,.24) 48%,rgba(255,255,255,.86) 51%,rgba(226,195,112,.18) 55%,transparent 64%);transform:translateX(-42%);will-change:opacity,transform;}",
      "html.page-transition-enabled.page-transition-entering::before{opacity:1;}",
      "html.page-transition-enabled.page-transition-leaving::before{opacity:1;}",
      "html.page-transition-enabled.page-transition-leaving::after{animation:adamis-page-sheen 520ms cubic-bezier(.22,1,.36,1) both;}",
      "html.page-transition-enabled.page-transition-revealing::after{animation:adamis-page-sheen 520ms cubic-bezier(.22,1,.36,1) both;}",
      "html.page-transition-enabled.page-transition-leaving:not(.page-transition-reduced) body{pointer-events:none;}",
      "@keyframes adamis-page-sheen{0%{opacity:0;transform:translateX(-42%);}35%{opacity:.72;}100%{opacity:0;transform:translateX(42%);}}",
      "@media (prefers-reduced-motion: reduce){html.page-transition-enabled::before,html.page-transition-enabled::after{display:none!important;}}"
    ].join("");
    document.head.appendChild(style);
  }
})();
