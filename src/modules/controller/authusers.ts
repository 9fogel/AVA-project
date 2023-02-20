import AuthModel from '../model/auth';
import { user } from '../model/auth';
import UserPage from './userPage';
import State from '../state.ts/editorState';
import SystemPopup from './systemPopup';

// Вынести вспамогательные методы в отдельный класс и вызывать их оттуда

class UsersControler {
  private readonly systemPopup: SystemPopup;
  static State: State;
  users: AuthModel;
  userPage: UserPage;
  inputName = document.querySelector('#info-user-name') as HTMLInputElement;
  inputEmail: HTMLInputElement | null = document.querySelector('#info-email');
  saveName: HTMLButtonElement | null = document.querySelector('#save-username');
  saveEmail: HTMLButtonElement | null = document.querySelector('#save-email');
  userMessage: HTMLElement | null = document.querySelector('.info-user-message');
  emailMessage: HTMLElement | null = document.querySelector('.info-email-message');

  inputOldPasswors: HTMLInputElement | null = document.querySelector('#old-password');
  inputNewPassword: HTMLInputElement | null = document.querySelector('#new-password');
  inputConfirmNewPassword: HTMLInputElement | null = document.querySelector('#confirm-new-password');
  updatePasswordBtn: HTMLButtonElement | null = document.querySelector('.update-password-btn');

  JWT = localStorage.getItem('JWT') || localStorage.setItem('JWT', '');
  constructor() {
    this.users = new AuthModel();
    this.userPage = new UserPage();
    this.systemPopup = new SystemPopup();
  }

  handleUsers() {
    this.handleRegistrationUser();
    //this.handleGetUsers();
    this.handleLoginUser();
    this.handlegetUserName();
    this.clickLogOut();

    this.handleUpdateUser(this.inputName, 'updateusername', this.saveName, this.userMessage, 1);
    //&& this.inputEmail instanceof HTMLInputElement
    if (this.inputEmail) {
      this.handleUpdateUser(this.inputEmail, 'updateuseremail', this.saveEmail, this.emailMessage, 2);
    }

    this.handleDeleteUser();

    this.handleUpdatePassword();

    this.handeUpdatePremium();
  }

  // handleGetUsers() {
  //   this.users.getUsers();
  // }

  handleRegistrationUser() {
    const userName = document.querySelector('#user-name') as HTMLInputElement;
    const userEmail = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;
    const repeatPassword = document.querySelector('#confirm-psw') as HTMLInputElement;

    const regUs = async () => {
      const data = await this.users.registrationUser(userName.value, userEmail.value, password.value);

      if (data.token) {
        this.logIn(data.username, data.username, data.userEmail);
        this.updateState(data.roles);

        localStorage.JWT = data.token;
        // document.cookie = `user = ${data.username}; SameSite=None; HTTPOnly`;
        // document.cookie = `token = ${data.token}; SameSite=None; HTTPOnly`;
      }
    };

    //Вынести в отдельный метод
    const messagePassword: HTMLElement | null = document.querySelector('.confirm-password-message');
    [password, repeatPassword].forEach((el) => {
      el.addEventListener('input', () => {
        if (messagePassword) {
          if (password.value !== repeatPassword.value) {
            messagePassword.textContent = 'Password mismatches';
            messagePassword.style.color = 'red';
            document.getElementById('sign-up')?.setAttribute('disabled', '');
          } else if (password.value === repeatPassword.value) {
            messagePassword.textContent = 'Password matches';
            messagePassword.style.color = 'green';
            document.getElementById('sign-up')?.removeAttribute('disabled');
          }
        }
      });
    });

    //Вынести в отдельный метод
    [password, repeatPassword].forEach((el) => {
      el.addEventListener('change', () => {
        if (messagePassword) {
          this.clearText(messagePassword);
        }
      });
    });

    document.getElementById('sign-up')?.addEventListener('click', regUs);
  }

  async handleLoginUser() {
    const userEmail = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;

    document.getElementById('sign-in')?.addEventListener('click', async () => {
      console.log('click');
      const data = await this.users.logInUser(userEmail.value, userEmail.value, password.value);
      console.log(data);
      if (data.token) {
        this.logIn(data.username1, data.username1, data.userEmail1);
        this.updateState(data.roles);

        localStorage.JWT = data.token;
        // document.cookie = `user = ${data.username1}; SameSite=None; HTTPOnly`;
        // document.cookie = `token = ${data.token}; SameSite=None; HTTPOnly`;
      }
    });
  }

  private logIn(userName: string, name: string, email: string) {
    const buttonLogin = document.querySelector('.login-btn');
    const buttonName = document.querySelector('.profile-btn');
    if (buttonLogin && buttonName) {
      buttonLogin.classList.add('hidden');
      buttonName.classList.remove('hidden');
      buttonName.textContent = userName;
    }
    document.querySelector('.login-modal')?.classList.remove('active');
    document.querySelector('.wrapper')?.classList.remove('active');

    // const inputName: HTMLElement | null = document.getElementById('info-user-name');
    // const inputEmail: HTMLElement | null = document.getElementById('info-email');
    if (this.inputName && this.inputEmail) {
      this.inputName.value = name;
      this.inputEmail.value = email;
      State.userName = name;
      State.userEmail = email;
      // console.log('State', State.userName, State.userEmail);
    }
  }

  private async handlegetUserName() {
    const data = await this.users.getUserName();
    if (data.username) {
      this.logIn(data.username, data.username, data.userEmail);
      this.updateState(data.roles);
      console.log('Role:', State.userState);
    } else {
      this.logOut();
      console.log('Role:', State.userState);
    }
  }

  private logOut() {
    const buttonLogin = document.querySelector('.login-btn');
    const buttonName = document.querySelector('.profile-btn');
    if (buttonName && buttonLogin) {
      buttonLogin.classList.remove('hidden');
      buttonName.classList.add('hidden');
      buttonName.textContent = 'User Profil';
      this.JWT = localStorage.setItem('JWT', '');

      State.userState = 'default';
      State.userName = '';
      State.userEmail = '';
      //console.log('State', State.userName, State.userEmail);
    }
  }

  private clickLogOut() {
    document.querySelector('.sign-out-item')?.addEventListener('click', this.logOut);
  }

  private handleUpdateUser(
    name: HTMLInputElement,
    path: string,
    button: HTMLButtonElement | null,
    textMessage: HTMLElement | null,
    flag: number,
  ) {
    if (button && textMessage) {
      button.addEventListener('click', async () => {
        const user: user = flag === 1 ? { username: name.value } : { userEmail: name.value };
        const data = await this.users.updateUser(path, user);
        //console.log(`update: ${JSON.stringify(data)}`, name.value, path);

        if (data.messageLog || data.message) {
          this.nonLogIn();
        }
        if (data.messageNo) {
          textMessage.textContent = 'It looks like this name is already in use. Try entering something else.';
          this.clearText(textMessage);
          textMessage.style.color = 'red';
        }
        if (data.messageOK) {
          textMessage.textContent = 'Changes were applied';
          this.clearText(textMessage);
          textMessage.style.color = 'green';
          const buttonName = document.querySelector('.profile-btn');
          if (buttonName) {
            buttonName.textContent = data.newUserName;
          }
          State.userName = data.newUserName;
          State.userEmail = data.newUserEmail;
          //console.log('state', State.userName, State.userEmail);
        }

        if (data.errors) {
          if (flag === 1) {
            textMessage.textContent = 'Name cannot be empty';
            this.clearText(textMessage);
          }
          if (flag === 2) {
            textMessage.textContent = "It's not a valid Email";
            this.clearText(textMessage);
          }
          textMessage.style.color = 'red';
        }
      });
    }
  }

  private handleDeleteUser() {
    const inputDelete: HTMLInputElement | null = document.querySelector('.confirm-deletion-input');
    const buttonDelete: HTMLButtonElement | null = document.querySelector('#confirm-deletion');
    const deleteMessage: HTMLElement | null = document.querySelector('.delete-account-message');

    if (inputDelete && buttonDelete && deleteMessage) {
      buttonDelete.addEventListener('click', async () => {
        const data = await this.users.deleteUser(inputDelete.value);

        if (data.message || data.messageLog) {
          this.nonLogIn();
        }

        if (data.messageNo) {
          deleteMessage.textContent = JSON.stringify(data.messageNo).replace(/"/g, '');
          deleteMessage.style.color = 'red';
          this.clearText(deleteMessage);
        }
        if (data.messageOK) {
          deleteMessage.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
          deleteMessage.style.color = 'green';

          setTimeout(() => {
            this.logOut();
            this.userPage.hideUserPage();
          }, 3000);
        }
      });
    }
  }

  //ПЕРЕПИСАТЬ МЕТОД ТАК ЧТОБЫ ОН БЫЛ УНИВЕРСАЛЬНЫМ
  private listenInputs() {
    const messageNewPassword = document.querySelectorAll('.info-password-message')[2] as HTMLElement;

    if (
      this.inputOldPasswors &&
      this.inputNewPassword &&
      this.inputConfirmNewPassword &&
      this.updatePasswordBtn &&
      messageNewPassword
    ) {
      [this.inputNewPassword, this.inputConfirmNewPassword].forEach((el) => {
        el.addEventListener('input', () => {
          if (
            this.inputNewPassword?.value === this.inputConfirmNewPassword?.value
            // && String(this.inputOldPasswors?.value).length > 0
          ) {
            this.updatePasswordBtn?.classList.remove('hidden');
            messageNewPassword.textContent = 'Password matches';
            messageNewPassword.style.color = 'green';

            this.clearText(messageNewPassword);
          } else {
            this.updatePasswordBtn?.classList.add('hidden');
            messageNewPassword.textContent = 'Password mismatches';
            messageNewPassword.style.color = 'red';
          }

          //this.clearText(messageNewPassword);
        });
      });

      [this.inputNewPassword, this.inputConfirmNewPassword].forEach((el) => {
        el.addEventListener('change', () => {
          this.clearText(messageNewPassword);
        });
      });
    }
  }

  private handleUpdatePassword() {
    this.listenInputs();

    const messageOldPassword = document.querySelectorAll('.info-password-message')[0] as HTMLElement;
    const messageNewPassword = document.querySelectorAll('.info-password-message')[2] as HTMLElement;

    this.updatePasswordBtn?.addEventListener('click', async () => {
      if (this.inputOldPasswors) {
        const data = await this.users.checkPassword(this.inputOldPasswors.value);
        //console.log(data);

        if (data.messageLog || data.message) {
          this.nonLogIn();
        }

        if (data.messageNo) {
          messageOldPassword.textContent = JSON.stringify(data.messageNo).replace(/"/g, '');
          messageOldPassword.style.color = 'red';
          this.clearText(messageOldPassword);
        }

        if (data.messageOK && this.inputNewPassword) {
          messageOldPassword.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
          messageOldPassword.style.color = 'green';
          this.clearText(messageOldPassword);
          //console.log(data);

          const newData = await this.users.updatePassword(data.userEmail, this.inputNewPassword.value);
          if (newData.errors) {
            messageNewPassword.textContent = 'Password length must be between 4 and 10 characters';
            messageNewPassword.style.color = 'red';
            this.clearText(messageNewPassword);
          }

          if (newData.messageOK) {
            messageOldPassword.textContent = JSON.stringify(newData.messageOK).replace(/"/g, '');
            messageOldPassword.style.color = 'green';
            // this.inputNewPassword.value = '';
            // this.inputOldPasswors.value = '';
            // if (this.inputConfirmNewPassword) {
            //   this.inputConfirmNewPassword.value = '';
            // }
            this.clearText(messageOldPassword);
            this.clearText(messageNewPassword);
            setTimeout(() => this.userPage.setDefaultState(), 6000);
          }

          if (newData.message) {
            this.nonLogIn();
          }
        }
      }
    });
  }

  private nonLogIn() {
    this.logOut();
    //message: string
    //const messageText = document.querySelector('#');
    // document.querySelector('.profile-page-wrapper')?.classList.add('hidden');
    this.userPage.hideUserPage();
    // if (messageText) {
    //   messageText.textContent = message;
    //   setTimeout(() => {
    //     messageText.textContent = '';
    //   }, 6000);

    //}

    this.systemPopup.showModal(
      'Looks likes you have already signed out or your account was deleted. Please try to sign in again.',
    );

    setTimeout(() => {
      this.systemPopup.hideModal();
    }, 6000);

    this.systemPopup.handleModal();
    //alert('Looks likes you have already signed out or your account was deleted. Please try to sign in again.');
  }

  private updateState(array: Array<string>) {
    if (array.includes('USER') && !array.includes('PREMIUM')) {
      State.userState = 'user';
    } else if (array.includes('PREMIUM')) {
      State.userState = 'premium';
    } else {
      State.userState = 'default';
    }
    //console.log('state:', State.userState);
  }

  private handeUpdatePremium() {
    const inputPremium: HTMLInputElement | null = document.querySelector('#promo');
    const buttonPremium: HTMLButtonElement | null = document.querySelector('#get-premium');
    const messgePremium: HTMLElement | null = document.querySelector('.promo-user-message');
    if (inputPremium && messgePremium) {
      buttonPremium?.addEventListener('click', async () => {
        const data = await this.users.updatePremium(inputPremium.value);

        if (data.messageLog || data.message) {
          this.nonLogIn();
        }

        if (data.messageNo) {
          messgePremium.textContent = JSON.stringify(data.messageNo).replace(/"/g, '');
          messgePremium.style.color = 'red';
          this.clearText(messgePremium);

          //console.log('Premium no');
        }

        if (data.messageOK) {
          // messgePremium.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
          // messgePremium.style.color = 'green';
          this.userPage.switchPremiumView();

          State.userState = 'premium';
          //console.log('Premium yes');
        }
      });
    }
  }

  private clearText(container: HTMLElement) {
    setTimeout(() => {
      container.textContent = '';
    }, 5000);
  }
}

export default UsersControler;
