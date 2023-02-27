import MailModel from '../model/sendmail';
import HelpMethodsUser from './helpUserController';
import Popup from './popup';
import Support from './support';

class MailController {
  private readonly mail: MailModel;
  private readonly helpMethods: HelpMethodsUser;
  private readonly popup: Popup;
  private readonly support: Support;
  inputEmail: HTMLInputElement | null = document.querySelector('#restore-psw-email');
  textResponse: HTMLElement | null = document.querySelector('.restore-psw-email-message');
  buttonEmail: HTMLButtonElement | null = document.querySelector('#send-key-btn');

  inputKey: HTMLInputElement | null = document.querySelector('#restore-psw-key');
  messageKey: HTMLElement | null = document.querySelector('.restore-psw-key-message');
  inputPassword: HTMLInputElement | null = document.querySelector('#restore-psw-new-psw');
  inputConfirmPassword: HTMLInputElement | null = document.querySelector('#restore-psw-confirm-psw');
  messagePassword: HTMLElement | null = document.querySelector('.restore-psw-confirm-psw-message');
  buttonRecoverePassword: HTMLButtonElement | null = document.querySelector('#set-new-psw-btn');

  inputEmailHelp: HTMLInputElement | null = document.querySelector('#contact-email');
  helpMessage: HTMLElement | null = document.querySelector('.support-message');
  inputTextMessage: HTMLInputElement | null = document.querySelector('#message-to-support');
  buttonHelpMessage: HTMLButtonElement | null = document.querySelector('#support-btn');
  countCharacter = document.querySelectorAll('.support-message')[1] as HTMLElement;

  constructor() {
    this.mail = new MailModel();
    this.helpMethods = new HelpMethodsUser();
    this.popup = new Popup();
    this.support = new Support();
  }

  public handleMailController() {
    this.handleGetKey();
    this.handleRecoverPassword();
    this.handleSendMessage();
  }

  private handleGetKey() {
    if (this.buttonEmail) {
      this.buttonEmail.addEventListener('click', async () => {
        if (this.inputEmail) {
          const data = await this.mail.getKey(this.inputEmail.value);

          if (data.messageNo && this.textResponse) {
            this.textResponse.textContent = JSON.stringify(data.messageNo).replace(/"/g, '');
            this.textResponse.style.color = 'red';
            this.helpMethods.clearText(this.textResponse);
          }

          if (data.message && this.textResponse) {
            this.textResponse.textContent = JSON.stringify(data.message).replace(/"/g, '');
            this.textResponse.style.color = 'red';
            this.helpMethods.clearText(this.textResponse);
          }

          if (data.messageOK && this.textResponse) {
            this.textResponse.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
            this.textResponse.style.color = 'green';
            this.helpMethods.clearText(this.textResponse);
            this.popup.showKeyEntryView();
          }
        }
      });
    }
  }

  private handleRecoverPassword() {
    this.helpMethods.listenInputsPasswords(
      this.inputPassword,
      this.inputConfirmPassword,
      this.buttonRecoverePassword,
      this.messagePassword,
      1,
    );

    this.buttonRecoverePassword?.addEventListener('click', async () => {
      if (this.inputEmail && this.inputKey && this.inputPassword) {
        const data = await this.mail.recoverPassword(
          this.inputKey?.value,
          this.inputEmail?.value,
          this.inputPassword?.value,
        );

        if (data.errors && this.messagePassword) {
          this.messagePassword.textContent = 'Password length must be between 4 and 10 characters';
          this.messagePassword.style.color = 'red';
          this.helpMethods.clearText(this.messagePassword);
        }

        if (data.messageNo && this.messageKey) {
          this.messageKey.textContent = JSON.stringify(data.messageNo).replace(/"/g, '');
          this.messageKey.style.color = 'red';
          this.helpMethods.clearText(this.messageKey);
        }

        if (data.message && this.textResponse) {
          this.textResponse.textContent = JSON.stringify(data.message).replace(/"/g, '');
          this.textResponse.style.color = 'red';
          this.helpMethods.clearText(this.textResponse);
        }

        if (data.messageOK && this.textResponse) {
          this.textResponse.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
          this.textResponse.style.color = 'green';
          this.helpMethods.clearText(this.textResponse);
          setTimeout(() => {
            this.helpMethods.logIn(data.username, data.userEmail);
          }, 2000);

          this.helpMethods.updateState(data.roles);
          localStorage.setItem('JWT', data.token);
        }
      }
    });
  }

  private handleSendMessage() {
    if (this.inputTextMessage && this.buttonHelpMessage) {
      this.helpMethods.controlInputLength(this.inputTextMessage, this.buttonHelpMessage);
      this.helpMethods.writeMessageLength(this.inputTextMessage, this.countCharacter);
    }

    this.buttonHelpMessage?.addEventListener('click', async () => {
      if (this.inputEmailHelp && this.helpMessage && this.inputTextMessage) {
        const data = await this.mail.sendMessage(this.inputEmailHelp.value, this.inputTextMessage.value);
        if (data.errors) {
          this.helpMessage.textContent = 'It is not a valid email';
          this.helpMessage.style.color = 'red';
          this.helpMethods.clearText(this.helpMessage);
        }

        if (data.message) {
          this.helpMessage.textContent = JSON.stringify(data.message).replace(/"/g, '');
          this.helpMessage.style.color = 'red';
          this.helpMethods.clearText(this.helpMessage);
        }

        if (data.messageOK) {
          this.helpMessage.textContent = JSON.stringify(data.messageOK).replace(/"/g, '');
          this.helpMessage.style.color = 'green';
          this.helpMethods.clearText(this.helpMessage);
          setTimeout(() => {
            this.support.hideSupport();
            this.countCharacter.textContent = '0/600';
          }, 3000);
        }
      }
    });
  }
}

export default MailController;
