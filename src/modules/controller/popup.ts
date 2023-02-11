class Popup {
  loginModal = document.querySelector('.login-modal');
  loginWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-modal');

  text: { [key: string]: { [key: string]: string } } = {
    create: {
      noAccText: 'Don’t have an account?',
      noAccLink: 'Create Account',
      title: 'Sign in for more options',
      btn: 'Sign In',
    },
    login: {
      noAccText: 'Already have an account?',
      noAccLink: 'Sign In',
      title: 'Create Account',
      btn: 'Sign Up',
    },
  };

  public showModal(): void {
    this.loginModal?.classList.add('active');
    this.loginWrapper?.classList.add('active');
  }

  public handleModal() {
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

  private listenAccLink() {
    const modalLink = document.getElementsByClassName('no-account-link')[0];
    console.log(modalLink);
    modalLink?.addEventListener('click', () => {
      this.switchModalView();
    });
  }

  private switchModalView() {
    const noAccText: HTMLElement | null = document.querySelector('.no-account-text');
    const noAccLink: HTMLElement | null = document.querySelector('.no-account-link');
    const title: HTMLElement | null = document.querySelector('.modal-title');
    const confirmPsw: HTMLElement | null = document.querySelector('.confirm-psw-wrap');
    const signInBtn: HTMLElement | null = document.querySelector('.modal-login-btn');

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
      console.log('change text');
      noAccText.innerText = this.text[key].noAccText;
      noAccLink.innerText = this.text[key].noAccLink;
      title.innerText = this.text[key].title;
      signInBtn.innerText = this.text[key].btn;
    }
  }
}

export default Popup;
