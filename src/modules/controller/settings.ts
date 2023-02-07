class Settings {
  public handleSettings() {
    this.listenSettings();
  }

  private listenSettings(): void {
    const settingsIcon: HTMLElement | null = document.querySelector('.settings');
    settingsIcon?.addEventListener('click', () => {
      this.showSettings();
      settingsIcon.classList.toggle('active');
    });

    const themeCheckbox: HTMLElement | null = document.querySelector('.theme-checkbox');
    const toggleWrap: HTMLElement | null = document.querySelector('.toggle-wrap');
    themeCheckbox?.addEventListener('click', () => {
      console.log('theme changed');
      toggleWrap?.classList.toggle('active');
      this.switchTheme();
    });
  }

  private showSettings(): void {
    const settingsMenu: HTMLElement | null = document.querySelector('.settings-menu');
    settingsMenu?.classList.toggle('hidden');
  }

  private switchTheme(): void {
    document.body.classList.toggle('dark-theme');
  }
}

export default Settings;
