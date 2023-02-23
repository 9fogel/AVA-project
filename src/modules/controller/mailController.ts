import MailModel from '../model/sendmail';
import HelpMethodsUser from './helpUserController';

class MailController {
  private readonly mail: MailModel;
  private readonly helpMethods: HelpMethodsUser;

  constructor() {
    this.mail = new MailModel();
    this.helpMethods = new HelpMethodsUser();
  }
}

export default MailController;
