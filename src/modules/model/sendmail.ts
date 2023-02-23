const Baseurl = 'http://localhost:5000';
//'https://ava-editor-server-final-task-production.up.railway.app';
//'http://localhost:5000';

class MailModel {
  async getKey(userEmail: string) {
    const response = await fetch(`${Baseurl}/auth/sendkey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }
    //console.log(data);
    return data;
  }

  async recoverPassword(key: string, userEmail: string, password: string) {
    const response = await fetch(`${Baseurl}/auth/recoverpassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, userEmail, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }

    return data;
  }

  async sendMessage(userEmail: string, text: string) {
    const response = await fetch(`${Baseurl}/auth/help`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail, text }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Erros:${response.status}`);
    }
    //console.log(data);
    return data;
  }
}

export default MailModel;
