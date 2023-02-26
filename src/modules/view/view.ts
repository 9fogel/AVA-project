import State from '../state.ts/editorState';

class View {
  public render(): void {
    // this.renderBodyContent();
    this.setTheme();
  }

  // private renderBodyContent(): void {
  // const bodyContent = ``;
  // document.body.innerHTML = bodyContent;
  // }

  private setTheme(): void {
    const toggleWrap: HTMLElement | null = document.querySelector('.toggle-wrap');

    State.theme = localStorage.getItem('ava-theme') || 'light';
    if (State.theme === 'light') {
      document.body.classList.remove('dark-theme');
      toggleWrap?.classList.remove('active');
    } else {
      document.body.classList.add('dark-theme');
      toggleWrap?.classList.add('active');
    }
  }
}

export default View;
