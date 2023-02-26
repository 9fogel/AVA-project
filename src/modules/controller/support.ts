class Support {
  public handleSupport() {
    this.listenSupport();
  }

  public hideSupport(): void {
    const activeSupportIcon: HTMLElement | null = document.querySelector('.support.active');
    const supportMenu: HTMLElement | null = document.querySelector('.support-menu');
    const sendBtn = document.querySelector('.support-btn');
    activeSupportIcon?.classList.remove('active');
    supportMenu?.classList.add('hidden');
    sendBtn?.setAttribute('disabled', 'disabled');
    this.clearSupportInputs();
  }

  private listenSupport(): void {
    const supportIcon: HTMLElement | null = document.querySelector('.support');
    supportIcon?.addEventListener('click', () => {
      this.showSupport();
      supportIcon.classList.toggle('active');
    });
  }

  private showSupport(): void {
    const supportMenu: HTMLElement | null = document.querySelector('.support-menu');
    this.clearSupportInputs();
    supportMenu?.classList.toggle('hidden');
    this.hideOpenedSettings();
  }

  private clearSupportInputs(): void {
    const email = document.querySelector('.support-input');
    const messageToSupport = document.querySelector('.support-textarea');
    const counter = document.querySelector('.support-counter-message');
    if (email instanceof HTMLInputElement) {
      email.value = '';
    }
    if (messageToSupport instanceof HTMLTextAreaElement) {
      messageToSupport.value = '';
    }
    if (counter instanceof HTMLElement) {
      counter.innerText = '0/600';
    }
  }

  private hideOpenedSettings(): void {
    const activeSettingsIcon: HTMLElement | null = document.querySelector('.settings.active');
    const settingsMenu: HTMLElement | null = document.querySelector('.settings-menu');
    activeSettingsIcon?.classList.remove('active');
    settingsMenu?.classList.add('hidden');
  }
}

export default Support;
