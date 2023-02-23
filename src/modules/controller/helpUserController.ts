import UserPage from './userPage';
import State from '../state.ts/editorState';
import SystemPopup from './systemPopup';

class HelpMethodsUser {
  private readonly systemPopup: SystemPopup;
  userPage: UserPage;
  static State: State;
  inputName = document.querySelector('#info-user-name') as HTMLInputElement;
  inputEmail: HTMLInputElement | null = document.querySelector('#info-email');

  constructor() {
    this.userPage = new UserPage();
    this.systemPopup = new SystemPopup();
  }

  public logIn(userName: string, name: string, email: string) {
    const buttonLogin = document.querySelector('.login-btn');
    const buttonName = document.querySelector('.profile-btn');
    if (buttonLogin && buttonName) {
      buttonLogin.classList.add('hidden');
      buttonName.classList.remove('hidden');
      buttonName.textContent = userName;
    }
    document.querySelector('.login-modal')?.classList.remove('active');
    document.querySelector('.wrapper')?.classList.remove('active');

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
}

export default HelpMethodsUser;
