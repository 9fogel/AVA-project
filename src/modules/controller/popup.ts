class Popup {
  loginModal = document.querySelector('.login-modal');
  loginWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-modal');

  text: { [key: string]: { [key: string]: string | Array<string> } } = {
    create: {
      noAccText: 'Don’t have an account?',
      noAccLink: 'Create Account',
      title: 'Sign in for more options',
      inputs: ['user-name', 'email', 'password'],
      btn: 'Sign In',
      btnIds: ['sign-in', 'sign-in-google'],
    },
    login: {
      noAccText: 'Already have an account?',
      noAccLink: 'Sign In',
      title: 'Create Account',
      inputs: ['create-user-name', 'create-email', 'create-password'],
      btn: 'Sign Up',
      btnIds: ['sign-up', 'sign-up-google'],
    },
  };

  public showModal(): void {
    this.loginModal?.classList.add('active');
    this.loginWrapper?.classList.add('active');
  }

  public handleModal(): void {
    this.handleModalclosure();
    this.listenAccLink();
  }

  private hideModal(): void {
    this.loginModal?.classList.remove('active');
    this.loginWrapper?.classList.remove('active');
  }

  private handleModalclosure(): void {
    this.closeIcon?.addEventListener('click', () => {
      this.hideModal();
    });

    this.loginWrapper?.addEventListener('click', () => {
      this.hideModal();
    });
  }

  private listenAccLink(): void {
    const modalLink = document.getElementsByClassName('no-account-link')[0];
    modalLink?.addEventListener('click', () => {
      this.switchModalView();
    });
  }

  private switchModalView(): void {
    const noAccText: HTMLElement | null = document.querySelector('.no-account-text');
    const noAccLink: HTMLElement | null = document.querySelector('.no-account-link');
    const title: HTMLElement | null = document.querySelector('.modal-title');
    const confirmPsw: HTMLElement | null = document.querySelector('.confirm-psw-wrap');
    const signInBtn: HTMLElement | null = document.querySelector('.modal-login-btn');
    const inputs = document.getElementsByClassName('modal-input');
    const buttons = document.getElementsByClassName('modal-btn');
    console.log(inputs);

    const id = noAccLink?.id;
    const key = id;

    if (noAccLink) {
      if (id === 'login') {
        noAccLink.id = 'create';
        confirmPsw?.classList.remove('hidden');
      } else if (id === 'create') {
        noAccLink.id = 'login';
        confirmPsw?.classList.add('hidden');
      }
    }

    if (key && noAccText && title && signInBtn) {
      noAccText.innerText = this.text[key].noAccText.toString();
      noAccLink.innerText = this.text[key].noAccLink.toString();
      title.innerText = this.text[key].title.toString();
      signInBtn.innerText = this.text[key].btn.toString();

      Array.from(inputs).forEach((input, i) => {
        input.id = this.text[key].inputs[i];
      });

      Array.from(buttons).forEach((btn, i) => {
        btn.id = this.text[key].btnIds[i];
      });
    }
  }
}

export default Popup;
