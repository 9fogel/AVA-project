class Support {
  public handleSupport() {
    this.listenSupport();
  }

  public hideSupport(): void {
    const activeSupportIcon: HTMLElement | null = document.querySelector('.support.active');
    const supportMenu: HTMLElement | null = document.querySelector('.support-menu');
    activeSupportIcon?.classList.remove('active');
    supportMenu?.classList.add('hidden');
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
    if (email instanceof HTMLInputElement) {
      email.value = '';
    }
    if (messageToSupport instanceof HTMLTextAreaElement) {
      messageToSupport.value = '';
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
