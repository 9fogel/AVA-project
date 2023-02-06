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
  }

  private showSettings() {
    const settingsMenu = document.querySelector('.settings-menu');
    settingsMenu?.classList.toggle('hidden');
  }
}

export default Settings;
