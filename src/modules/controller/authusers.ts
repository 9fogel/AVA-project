import AuthModel from '../model/auth';
import { user } from '../model/auth';

class UsersControler {
  users: AuthModel;
  inputName = document.querySelector('#info-user-name') as HTMLInputElement;
  inputEmail: HTMLInputElement | null = document.querySelector('#info-email');
  saveName: HTMLButtonElement | null = document.querySelector('#save-username');
  saveEmail: HTMLButtonElement | null = document.querySelector('#save-email');
  userMessage: HTMLElement | null = document.querySelector('.info-user-message');
  emailMessage: HTMLElement | null = document.querySelector('.info-email-message');
  JWT = localStorage.getItem('JWT') || localStorage.setItem('JWT', '');
  constructor() {
    this.users = new AuthModel();
  }

  handleUsers() {
    this.handleRegistrationUser();
    this.handleGetUsers();
    this.handleLoginUser();
    this.handlegetUserName();
    this.clickLogOut();

    this.updateUser(this.inputName, 'updateusername', this.saveName, this.userMessage, 1);
    //&& this.inputEmail instanceof HTMLInputElement
    if (this.inputEmail) {
      this.updateUser(this.inputEmail, 'updateuseremail', this.saveEmail, this.emailMessage, 2);
    }
  }

  handleGetUsers() {
    this.users.getUsers();
  }

  handleRegistrationUser() {
    const userName = document.querySelector('#user-name') as HTMLInputElement;
    const userEmail = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;
    const repeatPassword = document.querySelector('#confirm-psw') as HTMLInputElement;

    const regUs = async () => {
      const data = await this.users.registrationUser(userName.value, userEmail.value, password.value);

      if (data.token) {
        this.logIn(data.username, data.username, data.userEmail);

        localStorage.JWT = data.token;
        // document.cookie = `user = ${data.username}; SameSite=None; HTTPOnly`;
        // document.cookie = `token = ${data.token}; SameSite=None; HTTPOnly`;
      }
    };

    [password, repeatPassword].forEach((el) => {
      el.addEventListener('input', () => {
        const messagePassword: HTMLElement | null = document.querySelector('.confirm-password-message');
        if (messagePassword) {
          if (password.value !== repeatPassword.value) {
            messagePassword.textContent = 'Password mismatch';
            messagePassword.style.color = 'red';
            document.getElementById('sign-up')?.setAttribute('disabled', '');
          } else if (password.value === repeatPassword.value) {
            messagePassword.textContent = 'Password match';
            messagePassword.style.color = 'green';
            document.getElementById('sign-up')?.removeAttribute('disabled');
          }
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
    }
  }

  private async handlegetUserName() {
    const data = await this.users.getUserName();
    //console.log(data);
    if (data.username) {
      this.logIn(data.username, data.username, data.userEmail);
    } else {
      this.logOut();
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
      console.log('logout');
    }
  }

  private clickLogOut() {
    document.querySelector('.sign-out-item')?.addEventListener('click', this.logOut);
  }

  private updateUser(
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
        console.log(`update: ${JSON.stringify(data)}`, name.value, path);

        if (data.messageLog || data.message) {
          this.nonLogIn();
        }
        if (data.messageNo) {
          textMessage.textContent = 'It looks like this name is already in use. Try entering something else.';
          textMessage.style.color = 'red';
        }
        if (data.messageOK) {
          textMessage.textContent = 'Name was updated.';
          textMessage.style.color = 'green';
          const buttonName = document.querySelector('.profile-btn');
          if (buttonName) {
            buttonName.textContent = data.newUserName;
          }
        }

        if (data.errors) {
          if (flag === 1) {
            textMessage.textContent = 'Name is not be empty';
          }
          if (flag === 2) {
            textMessage.textContent = "It's not valid Email";
          }
          textMessage.style.color = 'red';
        }
      });
    }
  }

  private nonLogIn() {
    this.logOut();
    //message: string
    //const messageText = document.querySelector('#');
    document.querySelector('.profile-page-wrapper')?.classList.add('hidden');
    // if (messageText) {
    //   messageText.textContent = message;
    //   setTimeout(() => {
    //     messageText.textContent = '';
    //   }, 6000);

    //}
    alert('You log out earlier. ');
  }
}

export default UsersControler;
