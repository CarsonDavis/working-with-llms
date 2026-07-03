// Adds a copy button to every code block. Without JS the code is still
// perfectly selectable text.
document.querySelectorAll('.prose pre').forEach((pre) => {
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.type = 'button';
  button.textContent = 'Copy';
  button.addEventListener('click', async () => {
    const text = pre.querySelector('code')?.textContent ?? pre.textContent;
    await navigator.clipboard.writeText(text.trimEnd());
    button.textContent = 'Copied';
    setTimeout(() => (button.textContent = 'Copy'), 1500);
  });
  pre.appendChild(button);
});
