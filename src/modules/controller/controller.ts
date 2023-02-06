import Settings from './settings';

class Controller {
  private readonly settings: Settings;

  constructor() {
    this.settings = new Settings();
  }

  public run() {
    console.log('run controller');
    this.settings.handleSettings();
  }
}

export default Controller;
