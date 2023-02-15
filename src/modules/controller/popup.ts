class Popup {
  loginModal = document.querySelector('.login-modal');
  loginWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-modal');

  text: { [key: string]: { [key: string]: string | Array<string> } } = {
    create: {
      noAccText: 'Don’t have an account?',
      noAccLink: 'Create Account',
      title: 'Sign in for more options',
      emailLabel: 'Email / User Name',
      inputs: ['user-name', 'email', 'password'],
    },
    login: {
      noAccText: 'Already have an account?',
      noAccLink: 'Sign In',
      title: 'Create Account',
      emailLabel: 'Email',
      inputs: ['create-user-name', 'create-email', 'create-password'],
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
    const emailLabel: HTMLElement | null = document.querySelector('.modal-email-label');
    const userInput: HTMLElement | null = document.querySelector('.user-name-wrap');
    const confirmPsw: HTMLElement | null = document.querySelector('.confirm-psw-wrap');
    const signInBtn: HTMLElement | null = document.querySelector('.modal-login-btn');
    const signUpBtn: HTMLElement | null = document.querySelector('.modal-create-btn');
    const inputs = document.getElementsByClassName('modal-input');
    console.log(inputs);

    const id = noAccLink?.id;
    const key = id;

    if (noAccLink) {
      if (id === 'login') {
        noAccLink.id = 'create';
        userInput?.classList.remove('hidden');
        confirmPsw?.classList.remove('hidden');
        signInBtn?.classList.add('hidden');
        signUpBtn?.classList.remove('hidden');
      } else if (id === 'create') {
        noAccLink.id = 'login';
        userInput?.classList.add('hidden');
        confirmPsw?.classList.add('hidden');
        signUpBtn?.classList.add('hidden');
        signInBtn?.classList.remove('hidden');
      }
    }

    if (key && noAccText && title && signInBtn && emailLabel) {
      noAccText.innerText = this.text[key].noAccText.toString();
      noAccLink.innerText = this.text[key].noAccLink.toString();
      title.innerText = this.text[key].title.toString();
      emailLabel.innerText = this.text[key].emailLabel.toString();

      Array.from(inputs).forEach((input, i) => {
        input.id = this.text[key].inputs[i];
      });
    }
  }
}

export default Popup;
