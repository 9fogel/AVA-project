import State from '../state.ts/editorState';
import Support from './support';

class Settings {
  private readonly support: Support;

  constructor() {
    this.support = new Support();
  }

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

    this.listenTooltips();
  }

  private showSettings(): void {
    const settingsMenu: HTMLElement | null = document.querySelector('.settings-menu');
    settingsMenu?.classList.toggle('hidden');
    this.support.hideSupport();
  }

  private switchTheme(): void {
    document.body.classList.toggle('dark-theme');
    if (State.theme === 'light') {
      State.theme = 'dark';
    } else {
      State.theme = 'light';
    }
    localStorage.setItem('ava-theme', State.theme);
  }

  private listenTooltips(): void {
    const tooltipsBtns = document.querySelectorAll('.tooltips-wrap');
    const toolTipTextElems: NodeListOf<HTMLElement> = document.querySelectorAll('.tooltip .tooltiptext');

    tooltipsBtns.forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelector('.tooltips-wrap.selected')?.classList.remove('selected');
        button.classList.add('selected');
        if (button.id === 'no-tooltips') {
          toolTipTextElems.forEach((elem) => (elem.style.display = 'none'));
        } else {
          toolTipTextElems.forEach((elem) => (elem.style.display = 'block'));
        }
      });
    });
  }
}

export default Settings;
