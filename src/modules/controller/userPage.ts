class UserPage {
  editorView = document.querySelector('.main-content');
  userPageView = document.querySelector('.profile-page-wrapper');
  navItems = document.querySelectorAll('.nav-item');
  userAccWrap = document.querySelector('.user-account-content');
  getPremiumWrap = document.querySelector('.get-premium-content');
  infoInputs = document.querySelectorAll('.info-input');
  saveBtns = document.querySelectorAll('.save-changes-btn');
  infoMessages: NodeListOf<HTMLElement> | null = document.querySelectorAll('.info-message');
  premiumBtn = document.querySelector('.get-premium-btn');

  public handlePage() {
    this.listenProfileBtn();
    this.listenReturnBtns();
    this.listenDeleteBtn();
    this.handleNav();
    this.handleInputs();
    this.handleSaveChanges();
    this.handlePremium();
  }

  public showUserPage(): void {
    this.editorView?.classList.add('hidden');
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
  }

  private listenDeleteBtn(): void {
    const deleteAcc = document.querySelector('.delete-account-btn');
    deleteAcc?.addEventListener('click', () => {
      console.log('account will be deleted');
      //TODO: метод, который удаляет профиль пользователя + делает sign out
      this.hideUserPage();
    });
  }

  private handleInputs(): void {
    this.infoInputs.forEach((input, index) => {
      input.addEventListener('click', () => {
        if (index !== 2) {
          this.saveBtns[index].classList.remove('hidden');
        } else {
          console.log('show modal for password change');
          //TODO: для изменения пароля сделать модалку и тут показывать её?
        }
      });
    });
  }

  private handleSaveChanges(): void {
    this.saveBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        console.log('changes saved');
        btn.classList.add('hidden');
        if (this.infoMessages) {
          this.infoMessages[index].innerText = 'Changes saved';
        }
      });
    });
  }

  private handlePremium(): void {
    this.premiumBtn?.addEventListener('click', () => {
      console.log('i want to get premium');
    });
  }
}

export default UserPage;
