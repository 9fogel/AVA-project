import AuthModel from '../model/auth';

class UsersControler {
  users: AuthModel;
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
    document.querySelector('.modal-login-btn')?.addEventListener('click', () => {
      return this.users.registrationUser('Anjjfg3', 'admin');
    });
  }

  handleLoginUser() {
    document.querySelector('.modal-login-btn')?.addEventListener('click', () => {
      console.log('click');
      return this.users.logInUser('Anjjfg3', 'admin');
    });
  }
}

export default UsersControler;
