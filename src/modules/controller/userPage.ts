import Editor from './editor';
import State from '../state.ts/editorState';

class UserPage {
  editorView = document.querySelector('.main-content');
  userPageView = document.querySelector('.profile-page-wrapper');
  navItems = document.querySelectorAll('.nav-item');
  userAccWrap = document.querySelector('.user-account-content');
  getPremiumWrap = document.querySelector('.get-premium-content');
  infoInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.info-input');
  saveBtns = document.querySelectorAll('.save-changes-btn');
  infoMessages: NodeListOf<HTMLElement> | null = document.querySelectorAll('.info-message');

  changePswBtn = document.querySelector('.change-password-btn');
  changePswTitle = document.querySelector('.change-password-title');
  changePswContent = document.querySelector('.info-password-content');
  passwordInputs = document.querySelectorAll('.change-password-input');
  passwordMessages = document.querySelectorAll('.info-password-message');
  updatePswBtn = document.querySelector('.update-password-btn');

  confirmDeletionWrap = document.querySelector('.confirm-deletion-wrap');
  deteleInput = document.querySelector('.confirm-deletion-input');
  deleteMessage = document.querySelector('.delete-account-message');
  deleteBtn = document.querySelector('.delete-account-btn');
  confirmDeletionBtn = document.querySelector('.confirm-deletion-btn');

  promoInput = document.querySelector('.promo-input');
  premiumMessage = document.querySelector('.promo-user-message');
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
    this.handlePasswordChange();
    this.listenDeleteBtn();
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

  public setDefaultState(): void {
    this.navItems.forEach((item) => {
      item.classList.remove('selected');
    });
    this.navItems[0].classList.add('selected');
    this.userAccWrap?.classList.remove('hidden');
    this.getPremiumWrap?.classList.add('hidden');
    this.updateInputsContent();
    this.hideSaveBtns();
    this.hidePswUpdateBlock();
    this.hideConfirmDeletionBlock();
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
      this.setDefaultState();
      this.userAccWrap?.classList.remove('hidden');
      this.getPremiumWrap?.classList.add('hidden');
    } else if (index === 1) {
      this.userAccWrap?.classList.add('hidden');
      this.getPremiumWrap?.classList.remove('hidden');
      if (State.userState === 'premium') {
        this.showPremiumUserView();
      } else {
        this.setDefaultPremiumState();
      }
    } else if (index === 2) {
      this.hideUserPage();
    }
  }

  private handleInputs(): void {
    this.infoInputs.forEach((input, index) => {
      input.addEventListener('click', () => {
        this.saveBtns[index].classList.remove('hidden');
      });
    });
  }

  private updateInputsContent(): void {
    this.infoInputs[0].value = State.userName;
    this.infoInputs[1].value = State.userEmail;
  }

  private hideSaveBtns(): void {
    this.saveBtns.forEach((btn) => {
      btn.classList.add('hidden');
    });
  }

  //_______________________________________________PASSWORD CHANGE
  public hidePswUpdateBlock() {
    this.passwordInputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = '';
      }
    });
    this.passwordMessages.forEach((message) => {
      if (message instanceof HTMLElement) {
        message.innerText = '';
      }
    });
    this.changePswBtn?.classList.remove('hidden');
    this.changePswTitle?.classList.add('hidden');
    this.changePswContent?.classList.add('hidden');
    this.updatePswBtn?.classList.add('hidden');
  }

  private handlePasswordChange(): void {
    this.listenChangePswBtn();
  }

  private listenChangePswBtn(): void {
    this.changePswBtn?.addEventListener('click', () => {
      this.showPswUpdateBlock();
    });
  }

  private showPswUpdateBlock() {
    this.changePswBtn?.classList.add('hidden');
    this.changePswTitle?.classList.remove('hidden');
    this.changePswContent?.classList.remove('hidden');
  }

  //_______________________________________________DELETE ACCOUNT
  private listenDeleteBtn(): void {
    this.deleteBtn?.addEventListener('click', () => {
      this.showConfirmDeletionBlock();
    });
  }

  private showConfirmDeletionBlock(): void {
    if (this.deteleInput instanceof HTMLInputElement && this.deleteMessage instanceof HTMLElement) {
      this.deteleInput.value = '';
      this.deleteMessage.innerText = '';
    }
    this.deleteBtn?.classList.add('hidden');
    this.confirmDeletionWrap?.classList.remove('hidden');
  }

  private hideConfirmDeletionBlock(): void {
    this.deleteBtn?.classList.remove('hidden');
    this.confirmDeletionWrap?.classList.add('hidden');
  }

  //_______________________________________________PREMIUM
  public switchPremiumView(): void {
    this.buyPremiumContent?.classList.add('hidden');
    this.alreadyPremiumContent?.classList.remove('hidden');
  }

  private showPremiumUserView(): void {
    this.buyPremiumContent?.classList.add('hidden');
    this.alreadyPremiumContent?.classList.remove('hidden');
  }

  private setDefaultPremiumState(): void {
    if (this.promoInput instanceof HTMLInputElement && this.premiumMessage instanceof HTMLElement) {
      this.promoInput.value = '';
      this.premiumMessage.innerText = '';
    }
    this.buyPremiumContent?.classList.remove('hidden');
    this.alreadyPremiumContent?.classList.add('hidden');
  }
}

export default UserPage;
