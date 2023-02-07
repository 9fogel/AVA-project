class Editor {
  public handleEditor() {
    this.listenTools();
  }

  private listenTools(): void {
    const tools: NodeListOf<HTMLLIElement> = document.querySelectorAll('.tool-item');
    tools?.forEach((tool: HTMLLIElement) => {
      tool?.addEventListener('click', () => {
        const toolName = tool.id;
        if (toolName) {
          this.showToolOptions(toolName);
        }
      });
    });
  }

  private showToolOptions(toolName: string) {
    const options = document.querySelector(`.${toolName}-list`);
    const toolItem = document.querySelector(`.${toolName}-tool`);
    options?.classList.toggle('hidden');
    toolItem?.classList.toggle('selected');
  }
}

export default Editor;
