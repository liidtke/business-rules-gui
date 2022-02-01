

export let isLight: boolean = true;
let light = 'light-theme';
let dark = 'dark-theme';

export function initialCheck() {
  if(!document){
    return;
  }

  try{
    isLight = !document.cookie.split(';').some(x => x.includes('theme=dark-theme'));
  }
  finally{
    setTheme();
  }

}

function setTheme() {
  document.body.className = isLight ? light : dark;
  defineCookie();
}

function defineCookie() {
  document.cookie = `theme=${isLight ? light : dark}`;
}

export function changeTheme() {
  isLight = !isLight;
  setTheme();
}