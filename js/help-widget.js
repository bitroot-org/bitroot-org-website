(function () {
  var style = document.createElement('style');
  style.textContent = [
    '.br-help-btn{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;align-items:center;gap:8px;background:#1f76f9;color:#fff;border:none;border-radius:50px;padding:11px 18px;font-family:Inter,Outfit,system-ui,sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(31,118,249,.4);transition:transform .2s,box-shadow .2s;letter-spacing:.01em;}',
    '.br-help-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(31,118,249,.5);}',
    '.br-help-panel{position:fixed;bottom:72px;right:24px;z-index:9998;background:#161d24;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:6px;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.5);opacity:0;transform:translateY(8px) scale(.97);pointer-events:none;transition:opacity .18s,transform .18s;}',
    '.br-help-panel.is-open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}',
    '.br-help-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;color:#d0d7de;font-family:Inter,Outfit,system-ui,sans-serif;font-size:13px;text-decoration:none;transition:background .12s,color .12s;cursor:pointer;border:none;background:none;width:100%;text-align:left;white-space:nowrap;}',
    '.br-help-item:hover{background:rgba(255,255,255,.07);color:#fff;}',
    '.br-help-item svg{flex-shrink:0;opacity:.7;}',
    '.br-help-item:hover svg{opacity:1;}',
    '@media(max-width:480px){.br-help-btn{bottom:16px;right:16px;}.br-help-panel{right:16px;bottom:64px;}}'
  ].join('');
  document.head.appendChild(style);

  var wa   = 'https://wa.me/message/FBTWPWSOKURLJ1';
  var mail = 'mailto:contact.bitroot@gmail.com?subject=Help%20Request';

  var iconWA = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.543 5.876L0 24l6.287-1.516A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.843 0-3.57-.468-5.082-1.29l-.364-.214-3.734.9.937-3.634-.237-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>';
  var iconMail = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var iconQ = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>';

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="br-help-panel" id="brHelpPanel" role="menu">'
    + '<a class="br-help-item" href="' + wa + '" target="_blank" rel="noopener">' + iconWA + 'Chat on WhatsApp</a>'
    + '<a class="br-help-item" href="' + mail + '">' + iconMail + 'Send us an email</a>'
    + '</div>'
    + '<button class="br-help-btn" id="brHelpBtn" aria-label="Help" aria-expanded="false">'
    + iconQ + 'Help'
    + '</button>';
  document.body.appendChild(wrap);

  var btn   = document.getElementById('brHelpBtn');
  var panel = document.getElementById('brHelpPanel');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function () {
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  });

  panel.addEventListener('click', function (e) { e.stopPropagation(); });
}());
