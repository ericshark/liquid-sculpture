export const THEME_STORAGE_KEY = "theme";

/** Runs before hydration so the stored theme applies on first paint. */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;
