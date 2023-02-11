class AuthModel {
  async getUsers() {
    const response = await fetch('http://localhost:5000/auth/users/', {
      // method: 'GET',
      // headers: {
      //   Accept: 'applications/json',
      //   'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      //'Content-Type': 'application/json',
      //`Authorization`: 'Bearer',
      // 'Access-Control-Allow-Origin': 'origin-list',
      //},
      //body: JSON.stringify({ name, color }),
    });

    const data = await response.json();
    if (!response.ok) {
      //throw Error(`Памылка ${response.status}`);
      console.error(`Erros:${response.status}`);
    }
    console.log(data[0]._id);
    //return;
  }

  async registrationUser(username: string, password: string) {
    const response = await fetch('http://localhost:5000/auth/registration/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    //userName, password,

    const data = await response.json();
    if (!response.ok) {
      //throw Error(`Памылка ${response.status}`);
      console.error(`Erros:${response.status}`, data);
    }
    console.log(JSON.stringify(data));
  }

  async logInUser(username: string, password: string) {
    const response = await fetch('http://localhost:5000/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`, data);
    }
    console.log(JSON.stringify(data));
  }
}

export default AuthModel;
