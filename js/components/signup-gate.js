// js/components/signup-gate.js
export class SignupGate {
  constructor() {
    this.modal = null;
    this.hasFired = false;
    this.interests = [];
    this.init();
  }

  init() {
    if (this.isExempt() || this.hasVerifiedCookie()) return;
    
    const pageviews = parseInt(localStorage.getItem('br_pageviews') || '0', 10) + 1;
    localStorage.setItem('br_pageviews', pageviews);

    if (pageviews >= 2) {
      this.fireGate();
    } else {
      setTimeout(() => {
        if (!this.hasFired) this.fireGate();
      }, 25000);
    }
  }

  isExempt() {
    const ua = navigator.userAgent.toLowerCase();
    const isBot = /bot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/.test(ua);
    const isLegalPath = /privacy|terms|unsubscribe/i.test(window.location.pathname);
    return isBot || isLegalPath;
  }

  hasVerifiedCookie() {
    return document.cookie.includes('br_verified=true');
  }

  fireGate() {
    this.hasFired = true;
    this.renderEmailStep();
  }

  renderEmailStep() {
    const html = `
      <div id="signup-gate-overlay" class="gate-overlay inert-bg">
        <div class="gate-modal">
          <div class="gate-eyebrow">~/ JOIN BITROOT</div>
          <h2 class="gate-headline">Keep exploring.<br/>Free forever<span class="gate-accent">.</span></h2>
          <p class="gate-subtext">Full access to every kit, guide, and tool. No spam, unsubscribe anytime.</p>
          <form id="gate-email-form">
            <input type="email" id="gate-email-input" placeholder="founder@yoursaas.com" required />
            <button type="submit" class="gate-btn">Continue</button>
            <div id="gate-error" class="gate-error"></div>
          </form>
          <div class="gate-trust">free access &middot; unsubscribe anytime</div>
        </div>
      </div>
    `;
    this.mount(html);
    document.getElementById('gate-email-form').addEventListener('submit', (e) => this.handleEmailSubmit(e));
  }

  async handleEmailSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('gate-email-input').value;
    const btn = e.target.querySelector('button');
    const errorEl = document.getElementById('gate-error');
    
    try {
      btn.disabled = true;
      btn.textContent = 'Sending...';
      const res = await fetch('/api/brevo/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Failed to send code. Please try again.');
      this.renderCodeStep(email);
    } catch (err) {
      errorEl.textContent = err.message;
      btn.disabled = false;
      btn.textContent = 'Continue';
    }
  }

  renderCodeStep(email) {
    const html = `
      <div id="signup-gate-overlay" class="gate-overlay inert-bg">
        <div class="gate-modal">
          <h2 class="gate-headline">Enter the 6-digit code we sent to ${email}</h2>
          <form id="gate-code-form">
            <input type="text" id="gate-code-input" pattern="[0-9]{6}" maxlength="6" required />
            <button type="submit" class="gate-btn">Verify</button>
            <div id="gate-error" class="gate-error"></div>
          </form>
          <div class="gate-links">
            <a href="#" id="gate-resend">Resend code</a> | 
            <a href="#" id="gate-change-email">Change email</a>
          </div>
        </div>
      </div>
    `;
    this.mount(html);
    
    document.getElementById('gate-code-form').addEventListener('submit', (e) => this.handleCodeSubmit(e, email));
    document.getElementById('gate-resend').addEventListener('click', (e) => { e.preventDefault(); this.handleEmailSubmit({ preventDefault: () => {}, target: { querySelector: () => ({}) } }); });
    document.getElementById('gate-change-email').addEventListener('click', (e) => { e.preventDefault(); this.renderEmailStep(); });
  }

  async handleCodeSubmit(e, email) {
    e.preventDefault();
    const code = document.getElementById('gate-code-input').value;
    const btn = e.target.querySelector('button');
    const errorEl = document.getElementById('gate-error');
    
    try {
      btn.disabled = true;
      btn.textContent = 'Verifying...';
      this.renderInterestsStep(email, code);
    } catch (err) {
      errorEl.textContent = err.message;
      btn.disabled = false;
      btn.textContent = 'Verify';
    }
  }

  renderInterestsStep(email, code) {
    const html = `
      <div id="signup-gate-overlay" class="gate-overlay inert-bg">
        <div class="gate-modal">
          <h2 class="gate-headline">What are you here for?</h2>
          <form id="gate-interests-form">
            <div class="gate-chips">
              <label><input type="checkbox" value="Kits" /> Kits</label>
              <label><input type="checkbox" value="Guides" /> Guides</label>
              <label><input type="checkbox" value="Products" /> Products</label>
              <label><input type="checkbox" value="Tools" /> Tools</label>
            </div>
            <button type="submit" class="gate-btn">Continue</button>
            <div id="gate-error" class="gate-error"></div>
          </form>
        </div>
      </div>
    `;
    this.mount(html);
    
    document.getElementById('gate-interests-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkboxes = e.target.querySelectorAll('input[type="checkbox"]:checked');
      this.interests = Array.from(checkboxes).map(c => c.value);
      
      const btn = e.target.querySelector('button');
      const errorEl = document.getElementById('gate-error');
      
      try {
        btn.disabled = true;
        btn.textContent = 'Completing...';
        
        const res = await fetch('/api/brevo/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            code,
            interests: this.interests,
            source: window.location.href
          })
        });
        
        if (!res.ok) throw new Error('Verification failed. Please try again.');
        this.renderSuccessStep();
      } catch (err) {
        errorEl.textContent = err.message;
        btn.disabled = false;
        btn.textContent = 'Continue';
      }
    });
  }

  renderSuccessStep() {
    const html = `
      <div id="signup-gate-overlay" class="gate-overlay inert-bg">
        <div class="gate-modal">
          <h2 class="gate-headline">Welcome to Bitroot.</h2>
        </div>
      </div>
    `;
    this.mount(html);
    setTimeout(() => this.unmount(), 1500);
  }

  mount(html) {
    let overlay = document.getElementById('signup-gate-overlay');
    if (overlay) overlay.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    document.body.classList.add('gate-active');
  }

  unmount() {
    const overlay = document.getElementById('signup-gate-overlay');
    if (overlay) overlay.remove();
    document.body.classList.remove('gate-active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SignupGate();
});