const Baseurl = 'http://localhost:5000';

interface ValidError {
  errors: {
    errors: Array<{ value?: string; msg: string; param: string; location: string }>;
  };
}

export type user = { username: string } | { userEmail: string };

function findIndexError(error: ValidError, value: string): number {
  const arr1 = error.errors.errors;
  return arr1.findIndex((el) => el.param === value);
}

class AuthModel {
  async getUsers() {
    const response = await fetch(`${Baseurl}/auth/users/`, {});

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }
    if (!data) {
      console.log('data not found');
    } else {
      console.log(data);
    }
  }

  async registrationUser(username: string, userEmail: string, password: string) {
    const response = await fetch(`${Baseurl}/auth/registration/`, {
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
    const response = await fetch(`${Baseurl}/auth/login/`, {
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
    //console.log(JSON.stringify(data));
    return data;
  }

  async getUserName() {
    const response = await fetch(`${Baseurl}/auth/username/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

        //Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }
    console.log(data);
    return data;
  }

  async updateUser(path: string, name: user) {
    const response = await fetch(`${Baseurl}/auth/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',

        //Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
      body: JSON.stringify(name),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`, data);
      // const messageUser = document.querySelector('.email-message');
      // if (messageUser) {
      //   messageUser.textContent = String(JSON.stringify(data.message));
      //}
    }
    console.log(JSON.stringify(data));
    return data;
  }

  async deleteUser(password: string) {
    const response = await fetch(`${Baseurl}/auth/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',

        //Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('JWT')}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`, data);
      // const messageUser = document.querySelector('.email-message');
      // if (messageUser) {
      //   messageUser.textContent = String(JSON.stringify(data.message));
      //}
    }
    //console.log(JSON.stringify(data));
    return data;
  }
}

export default AuthModel;
