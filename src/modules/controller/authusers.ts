import AuthModel from '../model/auth';

class UsersControler {
  users: AuthModel;
  JWT = localStorage.getItem('JWT') || localStorage.setItem('JWT', '');
  constructor() {
    this.users = new AuthModel();
  }

  handleUsers() {
    this.handleRegistrationUser();
    this.handleGetUsers();
    this.handleLoginUser();
    this.handlegetUserName();
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
        this.logIn(userName.value, data.username, data.userEmail);

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

    const inputName: HTMLElement | null = document.getElementById('info-user-name');
    const inputEmail: HTMLElement | null = document.getElementById('info-email');
    if (inputName && inputEmail && inputName instanceof HTMLInputElement && inputEmail instanceof HTMLInputElement) {
      inputName.value = name;
      inputEmail.value = email;
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
      buttonName.textContent = 'User Pr';
      this.JWT = localStorage.setItem('JWT', '');
      console.log('logout');
    }
  }
}

export default UsersControler;
