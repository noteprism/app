class ApiStatus extends HTMLElement {
  private status: string | null = null;
  private isLoading: boolean = true;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.checkHealth();
  }

  async checkHealth() {
    const host = window.location.hostname;
    let apiUrl;
    if (host === 'preview.noteprism.com') {
      apiUrl = 'https://preview-768383813386.us-central1.run.app/health';
    } else if (host === 'noteprism.com' || host === 'www.noteprism.com') {
      apiUrl = 'https://api-768383813386.us-central1.run.app/health';
    } else {
      this.status = 'error';
      this.isLoading = false;
      this.render();
      return;
    }
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      this.status = data.status;
    } catch {
      this.status = 'error';
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2rem;
        }
        ion-progress-bar {
          width: 80%;
        }
      </style>
      <ion-progress-bar type="indeterminate" style="display: ${this.isLoading ? 'block' : 'none'};"></ion-progress-bar>
      <div style="display: ${!this.isLoading ? 'block' : 'none'};">
        <ion-badge color="success" style="display: ${this.status === 'ok' ? 'inline-block' : 'none'};">API Healthy</ion-badge>
        <ion-badge color="danger" style="display: ${this.status !== 'ok' ? 'inline-block' : 'none'};">API Down</ion-badge>
      </div>
    `;
  }
}

customElements.define('api-status', ApiStatus); 