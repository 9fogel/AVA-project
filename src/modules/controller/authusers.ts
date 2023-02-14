import AuthModel from '../model/auth';

class UsersControler {
  users: AuthModel;
  JWT = localStorage.setItem('JWT', '');
  constructor() {
    this.users = new AuthModel();
  }

  handleUsers() {
    this.handleRegistrationUser();
    this.handleGetUsers();
    this.handleLoginUser();
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
        this.logIn(userName.value, '.login-btn');

        localStorage.JWT = data.token;
      }
    };

    [password, repeatPassword].forEach((el) => {
      el.addEventListener('input', () => {
        const messagePassword: HTMLElement | null = document.querySelector('.confirm-password-message');
        if (messagePassword) {
          if (password.value !== repeatPassword.value) {
            messagePassword.textContent = 'Password mismatch';
            messagePassword.style.color = 'red';
            document.getElementById('sign-up-google')?.setAttribute('disabled', '');
          } else if (password.value === repeatPassword.value) {
            messagePassword.textContent = 'Password match';
            messagePassword.style.color = 'green';
            document.getElementById('sign-up-google')?.removeAttribute('disabled');
          }
        }
      });
    });

    document.getElementById('sign-in-google')?.addEventListener('click', regUs);
  }

  async handleLoginUser() {
    const userEmail = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;

    document.getElementById('sign-in')?.addEventListener('click', async () => {
      console.log('click');
      const data = await this.users.logInUser(userEmail.value, userEmail.value, password.value);
      console.log(data);
      if (data.token) {
        this.logIn(data.username1, '.login-btn');

        localStorage.JWT = data.token;
      }
    });
  }

  private logIn(userName: string, button: string) {
    const buttonName = document.querySelector(button);
    if (buttonName) {
      buttonName.textContent = userName;
    }
    document.querySelector('.login-modal')?.classList.remove('active');
    document.querySelector('.wrapper')?.classList.remove('active');
  }

  private logOut() {
    const buttonName = document.querySelector('.login-btn');
    if (buttonName) {
      buttonName.textContent = 'Sign In / Sign Up';
      this.JWT = localStorage.setItem('JWT', '');
    }
  }
}

export default UsersControler;
