!function(){"use strict";const e=(n,o=!1)=>{const t=new WebSocket(n);return t.addEventListener("open",(()=>{console.info("[Marp CLI] Observing the change of file..."),o&&location.reload()})),t.addEventListener("close",(()=>{console.warn("[Marp CLI] WebSocket for file watcher was disconnected. Try re-connecting in 5000ms..."),setTimeout((()=>e(n,!0)),5e3)})),t.addEventListener("message",(e=>{"reload"===e.data&&location.reload()})),t};(()=>{const n=window.__marpCliWatchWS;n&&e(n)})()}();