import Popup from './popup';
import Editor from './editor';

class Login {
  private readonly popup: Popup;
  private readonly editor: Editor;

  constructor() {
    this.popup = new Popup();
    this.editor = new Editor();
  }

  public handleLogin(): void {
    this.listenLoginBtn();
    this.popup.handleModal();
  }

  private listenLoginBtn(): void {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn?.addEventListener('click', () => {
      this.editor.hideOpenedToolMenus();
      this.editor.hideOpenedOptionControls();
      this.popup.showModal();
    });
  }
}

export default Login;
