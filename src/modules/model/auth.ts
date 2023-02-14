interface ValidError {
  errors: {
    errors: Array<{ value?: string; msg: string; param: string; location: string }>;
  };
}

function findIndexError(error: ValidError, value: string): number {
  const arr1 = error.errors.errors;
  return arr1.findIndex((el) => el.param === value);
}

class AuthModel {
  async getUsers() {
    const response = await fetch('http://localhost:5000/auth/users/', {});

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }
    console.log(data[0]._id);
  }

  async registrationUser(username: string, userEmail: string, password: string) {
    const response = await fetch('http://localhost:5000/auth/registration/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Accept: 'application/json',
      },
      body: JSON.stringify({ username, userEmail, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`, data);
      const messageUser = document.querySelector('.user-message');
      const messageEmail = document.querySelector('.email-message');
      const messagePassword = document.querySelector('.password-message');

      if (messageUser) {
        messageUser.textContent = String(
          JSON.stringify(data.message || data.errors?.errors[findIndexError(data, 'username')]?.msg) || '',
        );
      }

      if (messageEmail) {
        messageEmail.textContent = String(
          JSON.stringify(data.errors?.errors[findIndexError(data, 'userEmail')]?.msg) || '',
        );
      }

      if (messagePassword) {
        messagePassword.textContent = String(
          JSON.stringify(data.errors?.errors[findIndexError(data, 'password')]?.msg) || '',
        );
      }
    }
    console.log(JSON.stringify(data));
    return data;
  }

  async logInUser(username: string, userEmail: string, password: string) {
    const response = await fetch('http://localhost:5000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Accept: 'application/json',
      },
      body: JSON.stringify({ username, userEmail, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`, data);
      const messageUser = document.querySelector('.email-message');
      if (messageUser) {
        messageUser.textContent = String(JSON.stringify(data.message));
      }
    }
    console.log(JSON.stringify(data));
    return data;
  }
}

export default AuthModel;
