function checkSelectedTools(): boolean {
  const tools: NodeListOf<HTMLLIElement> = document.querySelectorAll('.tool-item');
  const toolsArray = Array.from(tools);
  return toolsArray?.every((tool: HTMLLIElement) => !tool.classList.contains('selected'));
}

export default checkSelectedTools;
