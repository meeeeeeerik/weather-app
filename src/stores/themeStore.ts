import { makeAutoObservable } from 'mobx';

class ThemeStore {
  isDark = localStorage.getItem('weather_dark') !== 'false';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('weather_dark', String(this.isDark));
  }
}

export const themeStore = new ThemeStore();
