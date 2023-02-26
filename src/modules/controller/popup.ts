class Popup {
  loginModal = document.querySelector('.login-modal');
  loginWrapper = document.querySelector('.wrapper');
  closeIcon = document.querySelector('.close-modal');

  modalInputs = document.querySelectorAll('.modal-input');

  loginContent = document.querySelector('.login-content');
  restoreContent = document.querySelector('.restore-psw-content');
  restoreText = document.querySelector('.restore-text');
  restorePswInput = document.querySelector('#restore-psw-email');
  sendKeyBtn = document.querySelector('.modal-send-key-btn');
  setNewPswBtn = document.querySelector('.modal-set-new-psw-btn');
  cancelRestoreBtn = document.querySelector('.modal-cancel-restore-btn');
  restoreKeyInputWraps = document.querySelectorAll('.restore-key-wrap');
  restoreInputs = document.querySelectorAll('.restore-input');
  restoreMessages = document.querySelectorAll('.restore-message');

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
    this.listenForgotPswLink();
    this.listenCancelRestorePsw();
  }

  public hideModal(): void {
    this.loginModal?.classList.remove('active');
    this.loginWrapper?.classList.remove('active');
    setTimeout(() => this.showLoginView(), 1000);
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
    const forgotPsw: HTMLElement | null = document.querySelector('.forgot-password');
    const title: HTMLElement | null = document.querySelector('.modal-title');
    const emailLabel: HTMLElement | null = document.querySelector('.modal-email-label');
    const userInput: HTMLElement | null = document.querySelector('.user-name-wrap');
    const confirmPsw: HTMLElement | null = document.querySelector('.confirm-psw-wrap');
    const signInBtn: HTMLElement | null = document.querySelector('.modal-login-btn');
    const signUpBtn: HTMLElement | null = document.querySelector('.modal-create-btn');
    const inputs = document.getElementsByClassName('modal-input');
    const messages = document.querySelectorAll('.modal-message');

    const id = noAccLink?.id;
    const key = id;

    if (noAccLink) {
      if (id === 'login') {
        noAccLink.id = 'create';
        userInput?.classList.remove('hidden');
        confirmPsw?.classList.remove('hidden');
        forgotPsw?.classList.add('hidden');
        signInBtn?.classList.add('hidden');
        signUpBtn?.classList.remove('hidden');
      } else if (id === 'create') {
        noAccLink.id = 'login';
        userInput?.classList.add('hidden');
        confirmPsw?.classList.add('hidden');
        forgotPsw?.classList.remove('hidden');
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

    messages.forEach((message) => {
      if (message instanceof HTMLElement) {
        message.innerText = '';
      }
    });
  }

  private clearInputs(): void {
    this.modalInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = '';
      }
    });
  }

  //_______________________________________RESTORE PSW
  public showKeyEntryView(): void {
    if (this.restoreText instanceof HTMLElement) {
      this.restoreText.innerText = 'Please enter restore key and create new password';
    }
    this.sendKeyBtn?.classList.add('hidden');
    this.restorePswInput?.setAttribute('disabled', 'disabled');
    this.restoreKeyInputWraps.forEach((wrap) => {
      wrap.classList.remove('hidden');
    });
    this.setNewPswBtn?.classList.remove('hidden');
  }

  private listenForgotPswLink(): void {
    const link = document.querySelector('.forgot-password');
    link?.addEventListener('click', () => {
      this.showRestorePswView();
    });
  }

  private showRestorePswView(): void {
    this.loginContent?.classList.add('hidden');
    this.restoreContent?.classList.remove('hidden');
  }

  private showLoginView(): void {
    this.clearInputs();
    this.loginContent?.classList.remove('hidden');
    this.restoreContent?.classList.add('hidden');
    this.setRestoreModalDefaultState();
  }

  private setRestoreModalDefaultState(): void {
    if (this.restoreText instanceof HTMLElement) {
      this.restoreText.innerText = 'Please enter your email address and we will send a restore key to it';
    }
    this.sendKeyBtn?.classList.remove('hidden');
    this.cancelRestoreBtn?.classList.remove('hidden');
    this.restorePswInput?.removeAttribute('disabled');
    if (this.restorePswInput instanceof HTMLInputElement) {
      this.restorePswInput.value = '';
    }
    this.restoreKeyInputWraps.forEach((wrap) => {
      wrap.classList.add('hidden');
    });
    this.restoreInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = '';
      }
    });
    this.restoreMessages.forEach((message) => {
      if (message instanceof HTMLElement) {
        message.innerText = '';
      }
    });
    this.setNewPswBtn?.classList.add('hidden');
    this.setNewPswBtn?.setAttribute('disabled', 'disabled');
  }

  private listenCancelRestorePsw(): void {
    this.cancelRestoreBtn?.addEventListener('click', () => {
      this.showLoginView();
    });
  }
}

export default Popup;
