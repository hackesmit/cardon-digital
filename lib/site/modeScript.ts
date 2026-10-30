/**
 * Pre-paint script: apply the stored mode before first paint so there is no
 * flash, and flag the document as JS-enabled so reveal-on-scroll can hide.
 *
 * It lives outside SiteShell because the CSP allows it by hash
 * (lib/security/csp.ts), so the middleware has to read the same bytes the shell
 * renders. Any change to it changes the hash with it.
 */
export const modeScript =
  '(function(){try{var m=localStorage.getItem("cardon-mode");if(m==="light"||m==="dark"){document.documentElement.setAttribute("data-mode",m);}}catch(e){}document.documentElement.classList.add("js");})();';
