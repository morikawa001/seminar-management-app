(function(){
  const KEY = 'theme-preference-v2';
  function getPreferredTheme(){
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  }
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    return theme;
  }
  function toggleTheme(){
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }
  window.SharedTheme = { getPreferredTheme, applyTheme, toggleTheme };
  applyTheme(getPreferredTheme());
})();
