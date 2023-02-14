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
    const repeatPassword = document.querySelector('#undefined') as HTMLInputElement;

    password.addEventListener('input', () => {
      const messagePassword = document.querySelector('.confirm-password-message');
      if (messagePassword) {
        if (password.value !== repeatPassword.value) {
          messagePassword.textContent = 'Password mismatch';
        } else {
          messagePassword.textContent = 'Password match';
        }
      }
    });

    if (password.value === repeatPassword.value) {
      document.getElementById('sign-in-google')?.addEventListener('click', async () => {
        //await this.users.registrationUser(userName.value, userEmail.value, password.value);
        const data = await this.users.registrationUser(userName.value, userEmail.value, password.value);

        if (data.token) {
          this.logIn(userName.value, '.login-btn');
        }
      });
    }
    // document.getElementById('sign-in-google')?.addEventListener('click', async () => {
    //   const data = await this.users.registrationUser(userName.value, userEmail.value, password.value);

    //   if (data.token) {
    //     this.logIn(userName.value, '.login-btn');
    //   }
    // });
  }

  async handleLoginUser() {
    document.getElementById('sign-in')?.addEventListener('click', () => {
      console.log('click');
      this.users.logInUser('Anjjfg367', 'Anjjfg3', 'admin');
    });
  }

  private logIn(userName: string, button: string) {
    const buttonName = document.querySelector(button);
    if (buttonName) {
      buttonName.textContent = userName;
    }
    document.querySelector('.login-modal')?.classList.remove('active');
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
