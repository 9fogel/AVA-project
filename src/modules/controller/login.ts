import Popup from './popup';

class Login {
  private readonly popup: Popup;

  constructor() {
    this.popup = new Popup();
  }

  public handleLogin(): void {
    this.listenLoginBtn();
    this.popup.handleModalclosure();
  }

  private listenLoginBtn(): void {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn?.addEventListener('click', () => {
      this.popup.showModal();
    });
  }
}

export default Login;
