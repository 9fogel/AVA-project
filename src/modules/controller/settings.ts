class Settings {
  public handleSettings() {
    this.listenSettings();
  }

  private listenSettings() {
    const settingsIcon = document.querySelector('.settings');
    settingsIcon?.addEventListener('click', () => {
      this.showSettings();
      settingsIcon.classList.toggle('active');
    });

    const themeCheckbox = document.querySelector('.theme-checkbox');
    const toggleWrap = document.querySelector('.toggle-wrap');
    themeCheckbox?.addEventListener('click', () => {
      console.log('theme changed');
      toggleWrap?.classList.toggle('active');
      this.switchTheme();
    });
  }

  private showSettings() {
    const settingsMenu = document.querySelector('.settings-menu');
    settingsMenu?.classList.toggle('hidden');
  }

  private switchTheme() {
    document.body.classList.toggle('dark-theme');
  }
}

export default Settings;
