import Editor from './editor';

class UserPage {
  editorView = document.querySelector('.main-content');
  userPageView = document.querySelector('.profile-page-wrapper');
  navItems = document.querySelectorAll('.nav-item');
  userAccWrap = document.querySelector('.user-account-content');
  getPremiumWrap = document.querySelector('.get-premium-content');
  infoInputs = document.querySelectorAll('.info-input');
  saveBtns = document.querySelectorAll('.save-changes-btn');
  infoMessages: NodeListOf<HTMLElement> | null = document.querySelectorAll('.info-message');

  changePswBtn = document.querySelector('.change-password-btn');
  changePswTitle = document.querySelector('.change-password-title');
  changePswContent = document.querySelector('.info-password-content');
  passwordInputs = document.querySelectorAll('.change-password-input');
  updatePswBtn = document.querySelector('.update-password-btn');

  confirmDeletionWrap = document.querySelector('.confirm-deletion-wrap');
  deleteBtn = document.querySelector('.delete-account-btn');
  confirmDeletionBtn = document.querySelector('.confirm-deletion-btn');

  premiumBtn = document.querySelector('.get-premium-btn');
  buyPremiumContent = document.querySelector('.buy-premium-content');
  alreadyPremiumContent = document.querySelector('.already-premium-content');

  private readonly editor: Editor;

  constructor() {
    this.editor = new Editor();
  }

  public handlePage() {
    this.listenProfileBtn();
    this.listenReturnBtns();
    this.handleNav();
    this.handleInputs();
    this.handleSaveChanges();
    this.handlePasswordChange();
    this.handleAccDeletion();

    this.listenDeleteBtn();
    this.handlePremium();
  }

  public showUserPage(): void {
    this.editorView?.classList.add('hidden');
    this.editor.hideOpenedToolMenus();
    this.editor.hideOpenedOptionControls();
    this.userPageView?.classList.remove('hidden');
    this.setDefaultState();
  }

  public hideUserPage(): void {
    this.editorView?.classList.remove('hidden');
    this.userPageView?.classList.add('hidden');
  }

  private listenProfileBtn(): void {
    const profileBtn = document.querySelector('.profile-btn');
    profileBtn?.addEventListener('click', () => {
      this.showUserPage();
    });
  }

  private listenReturnBtns(): void {
    const returnBtns = document.querySelectorAll('.return-btn');
    returnBtns.forEach((btn) => {
      btn?.addEventListener('click', () => {
        this.hideUserPage();
      });
    });
  }

  private handleNav(): void {
    this.navItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.switchContent(index);
      });
    });
  }

  private switchContent(index: number): void {
    document.querySelector('.nav-item.selected')?.classList.remove('selected');
    this.navItems[index].classList.add('selected');
    if (index === 0) {
      this.userAccWrap?.classList.remove('hidden');
      this.getPremiumWrap?.classList.add('hidden');
    } else if (index === 1) {
      this.userAccWrap?.classList.add('hidden');
      this.getPremiumWrap?.classList.remove('hidden');
    } else if (index === 2) {
      console.log('User signs out');
      //TODO: метод, который разлогинит пользователя (sign out)
      this.hideUserPage();
    }
  }

  private setDefaultState(): void {
    this.navItems.forEach((item) => {
      item.classList.remove('selected');
    });
    this.navItems[0].classList.add('selected');
    this.userAccWrap?.classList.remove('hidden');
    this.getPremiumWrap?.classList.add('hidden');
    //TODO: заполнить инпуты в User Account нужной инфой пользователя
    this.changePswBtn?.classList.remove('hidden');
    this.changePswTitle?.classList.add('hidden');
    this.changePswContent?.classList.add('hidden');
  }

  private handleInputs(): void {
    this.infoInputs.forEach((input, index) => {
      input.addEventListener('click', () => {
        this.saveBtns[index].classList.remove('hidden');
      });
    });
  }

  private handleSaveChanges(): void {
    this.saveBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        console.log('changes saved');
        btn.classList.add('hidden');
        if (this.infoMessages) {
          //TODO: выводим какое-то временное сообщение, что пароль успешно изменён?
          this.infoMessages[index].innerText = 'Changes saved'; // сейчас появляется сообщение под инпутом, но оно красное и потом не исчезает
        }
      });
    });
  }

  //_______________________________________________PASSWORD CHANGE
  private handlePasswordChange(): void {
    this.listenChangePswBtn();
    this.listenPswInputs();
    this.listenUpdatePswBtn();
  }

  private listenChangePswBtn(): void {
    this.changePswBtn?.addEventListener('click', () => {
      this.changePswBtn?.classList.add('hidden');
      this.changePswTitle?.classList.remove('hidden');
      this.changePswContent?.classList.remove('hidden');
    });
  }

  private listenPswInputs(): void {
    this.passwordInputs.forEach((input, index) => {
      input.addEventListener('change', () => {
        console.log(`input with index ${index} was changed`);
        //TODO: метод, который валидирует каждый инпут (инпуты можно различать по индексу)
      });
    });
    //TODO: если все инпуты проходят валидацию, то активировать кнопку Update Password
    // this.updatePswBtn?.classList.remove('hidden');
  }

  private listenUpdatePswBtn(): void {
    this.updatePswBtn?.addEventListener('click', () => {
      console.log('update password');
      //TODO: метод, который обновляет пароль в системе/на сервере
      //TODO: выводим какое-то временное сообщение, что пароль успешно изменён?
      this.setDefaultState();
    });
  }

  //_______________________________________________DELETE ACCOUNT
  private handleAccDeletion(): void {
    this.listenDeleteBtn();
    this.listenConfirmDeletionBtn();
  }

  private listenDeleteBtn(): void {
    this.deleteBtn?.addEventListener('click', () => {
      this.deleteBtn?.classList.add('hidden');
      this.confirmDeletionWrap?.classList.remove('hidden');
    });
  }

  private listenConfirmDeletionBtn(): void {
    this.confirmDeletionBtn?.addEventListener('click', () => {
      console.log('account will be deleted');
      //TODO: метод, который удаляет профиль пользователя + делает sign out
      this.hideUserPage();
    });
  }

  //_______________________________________________PREMIUM
  private handlePremium(): void {
    //TODO: если инпут с промо проходит валидацию, то активируем кнопку get-premium
    // this.premiumBtn?.removeAttribute('disabled');
    this.premiumBtn?.addEventListener('click', () => {
      console.log('i want to get premium');
      //TODO: метод, который дает премиум доступ
      //TODO: выводить какое-то сообщение, что премиум получен? или просто переключать вид блока как для премиум пользователя?
      this.switchPremiumView(); //переключает на блок как для премиум пользователя
    });
  }

  public switchPremiumView(): void {
    this.buyPremiumContent?.classList.add('hidden');
    this.alreadyPremiumContent?.classList.remove('hidden');
  }
}

export default UserPage;
