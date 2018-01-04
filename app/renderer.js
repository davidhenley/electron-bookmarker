const { shell, remote: { systemPreferences } } = require('electron');

const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('#new-link-url');
const submitBtn = document.querySelector('.new-link-form--submit');
const linkTemplate = document.querySelector('#link-template');
const linksSection = document.querySelector('.links');

linksSection.addEventListener('click', e => {
  if (e.target.href) {
    e.preventDefault();
    shell.openExternal(e.target.href);
  }
});

newLinkUrl.addEventListener('keyup', () => {
  submitBtn.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();
const parseResponse = text => parser.parseFromString(text, 'text/html');
const findTitle = nodes => nodes.querySelector('title').textContent;

const addToPage = ({ title, url }) => {
  const newLink = linkTemplate.content.cloneNode(true);
  const titleElement = newLink.querySelector('.link--title');
  const urlElement = newLink.querySelector('.link--url');

  titleElement.textContent = title;
  urlElement.href = url;
  urlElement.textContent = url;

  linksSection.appendChild(newLink);

  return { title, url };
};

newLinkForm.addEventListener('submit', e => {
  e.preventDefault();

  const url = newLinkUrl.value;

  fetch(url)
    .then(res => res.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => addToPage({ title, url }))
    .then(() => {
      newLinkUrl.value = '';
      newLinkUrl.focus();
    })
    .catch(err => console.error(err));
});

window.addEventListener('load', () => {
  if (systemPreferences.isDarkMode()) {
    document.querySelector('link').href = 'styles-dark.css';
  }
});
