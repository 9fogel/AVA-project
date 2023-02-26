import UserPage from './userPage';
import State from '../state.ts/editorState';
import SystemPopup from './systemPopup';
import Popup from './popup';

class HelpMethodsUser {
  private readonly systemPopup: SystemPopup;
  private readonly popup: Popup;
  userPage: UserPage;
  static State: State;
  inputName = document.querySelector('#info-user-name') as HTMLInputElement;
  inputEmail: HTMLInputElement | null = document.querySelector('#info-email');

  constructor() {
    this.userPage = new UserPage();
    this.systemPopup = new SystemPopup();
    this.popup = new Popup();
  }

  public logIn(name: string, email: string) {
    const buttonLogin = document.querySelector('.login-btn');
    const buttonName = document.querySelector('.profile-btn');
    if (buttonLogin && buttonName) {
      buttonLogin.classList.add('hidden');
      buttonName.classList.remove('hidden');
      buttonName.textContent = name;
    }
    //document.querySelector('.login-modal')?.classList.remove('active');
    //document.querySelector('.wrapper')?.classList.remove('active');

    this.popup.hideModal();

    if (this.inputName && this.inputEmail) {
      this.inputName.value = name;
      this.inputEmail.value = email;
      State.userName = name;
      State.userEmail = email;
    }
  }

  public logOut() {
    const buttonLogin = document.querySelector('.login-btn');
    const buttonName = document.querySelector('.profile-btn');
    if (buttonName && buttonLogin) {
      buttonLogin.classList.remove('hidden');
      buttonName.classList.add('hidden');
      buttonName.textContent = 'User Profil';
      //this.JWT =
      localStorage.setItem('JWT', '');

      State.userState = 'default';
      State.userName = '';
      State.userEmail = '';
    }
  }

  public nonLogIn() {
    this.logOut();
    this.userPage.hideUserPage();

    this.systemPopup.showModal(
      'Looks likes you have already signed out or your account was deleted. Please try to sign in again.',
    );

    setTimeout(() => {
      this.systemPopup.hideModal();
    }, 6000);

    this.systemPopup.handleModal();
  }

  public updateState(array: Array<string>) {
    if (array.includes('USER') && !array.includes('PREMIUM')) {
      State.userState = 'user';
    } else if (array.includes('PREMIUM')) {
      State.userState = 'premium';
    } else {
      State.userState = 'default';
    }
  }

  public clearText(container: HTMLElement) {
    setTimeout(() => {
      container.textContent = '';
    }, 5000);
  }

  public listenInputsPasswords(
    inputNewPassword: HTMLInputElement | null,
    inputConfirmNewPassword: HTMLInputElement | null,
    updatePasswordBtn: HTMLButtonElement | null,
    messageNewPassword: HTMLElement | null,
    flag: number,
  ) {
    // const messageNewPassword = document.querySelectorAll('.info-password-message')[2] as HTMLElement;

    if (inputNewPassword && inputConfirmNewPassword && updatePasswordBtn && messageNewPassword) {
      [inputNewPassword, inputConfirmNewPassword].forEach((el) => {
        el.addEventListener('input', () => {
          if (inputNewPassword?.value === inputConfirmNewPassword?.value) {
            if (flag === 1) {
              updatePasswordBtn?.removeAttribute('disabled');
            }
            if (flag === 2) {
              updatePasswordBtn?.classList.remove('hidden');
            }
            messageNewPassword.textContent = 'Password matches';
            messageNewPassword.style.color = 'green';

            this.clearText(messageNewPassword);
          } else {
            if (flag === 1) {
              updatePasswordBtn?.setAttribute('disabled', '');
            }
            if (flag === 2) {
              updatePasswordBtn?.classList.add('hidden');
            }
            messageNewPassword.textContent = 'Password mismatches';
            messageNewPassword.style.color = 'red';
          }
        });
      });

      [inputNewPassword, inputConfirmNewPassword].forEach((el) => {
        el.addEventListener('change', () => {
          this.clearText(messageNewPassword);
        });
      });
    }
  }

  public controlInputLength(input: HTMLInputElement, button: HTMLButtonElement) {
    //if (input && button) {
    input.addEventListener('input', () => {
      if (input.value.length < 10 || input.value.length > 600) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
    });
    //}
  }

  public writeMessageLength(input: HTMLInputElement, container: HTMLElement) {
    input.addEventListener('input', () => {
      container.textContent = `${input.value.length}/600`;
      // container.style.color = 'black';
    });
  }
}

export default HelpMethodsUser;
