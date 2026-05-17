import { makeAutoObservable, runInAction } from 'mobx';
import type { WeatherData, SavedCity } from '../types';
import { generateWeatherData, PRESET_CITIES } from '../utils/weatherData';

class WeatherStore {
  currentWeather: WeatherData | null = null;
  savedCities: SavedCity[] = [];
  citiesWeather: Record<string, WeatherData> = {};
  searchQuery = '';
  isLoading = false;
  isCityLoading = false;
  error: string | null = null;
  unit: 'C' | 'F' = 'C';
  activeTab: 'hourly' | 'daily' = 'hourly';
  searchResults: typeof PRESET_CITIES = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadSavedCities();
    this.fetchCurrentLocation();
  }

  // ── Setters ──────────────────────────────────────────────────────────────

  setUnit(u: 'C' | 'F') {
    this.unit = u;
  }

  setActiveTab(t: 'hourly' | 'daily') {
    this.activeTab = t;
  }

  setSearchQuery(q: string) {
    this.searchQuery = q;

    if (q.length > 1) {
      this.searchResults = PRESET_CITIES.filter(
        (c) =>
          c.city.toLowerCase().includes(q.toLowerCase()) ||
          c.country.toLowerCase().includes(q.toLowerCase())
      );
    } else {
      this.searchResults = [];
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  // ── Temperature conversion ────────────────────────────────────────────────

  toDisplay(tempC: number): number {
    return this.unit === 'F' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
  }

  tempLabel(tempC: number): string {
    return `${this.toDisplay(tempC)}°${this.unit}`;
  }

  // ── Fetch current location weather ────────────────────────────────────────

  async fetchCurrentLocation() {
    this.isLoading = true;
    this.error = null;

    try {
      await new Promise((r) => setTimeout(r, 800));
      const data = generateWeatherData('New York', 'US', 40.71, -74.01, 14);

      runInAction(() => {
        this.currentWeather = data;
        this.isLoading = false;
      });
    } catch {
      runInAction(() => {
        this.error = 'Failed to fetch weather';
        this.isLoading = false;
      });
    }
  }

  // ── Search & select a city ────────────────────────────────────────────────

  async selectCity(city: (typeof PRESET_CITIES)[0]) {
    this.isLoading = true;
    this.error = null;
    this.clearSearch();

    try {
      await new Promise((r) => setTimeout(r, 600));
      const data = generateWeatherData(city.city, city.country, city.lat, city.lon, city.baseTemp);

      runInAction(() => {
        this.currentWeather = data;
        this.isLoading = false;
      });
    } catch {
      runInAction(() => {
        this.error = 'Failed to load city weather';
        this.isLoading = false;
      });
    }
  }

  // ── Saved cities ──────────────────────────────────────────────────────────

  async saveCity(city: SavedCity) {
    if (this.savedCities.find((c) => c.city === city.city)) return;

    this.savedCities.push(city);
    this.persistCities();

    const preset = PRESET_CITIES.find((p) => p.city === city.city);
    const data = generateWeatherData(
      city.city,
      city.country,
      city.lat,
      city.lon,
      preset?.baseTemp ?? 20
    );

    runInAction(() => {
      this.citiesWeather[city.city] = data;
    });
  }

  removeCity(cityName: string) {
    this.savedCities = this.savedCities.filter((c) => c.city !== cityName);
    delete this.citiesWeather[cityName];
    this.persistCities();
  }

  isSaved(cityName: string) {
    return this.savedCities.some((c) => c.city === cityName);
  }

  private persistCities() {
    localStorage.setItem('weather_cities', JSON.stringify(this.savedCities));
  }

  private loadSavedCities() {
    const raw = localStorage.getItem('weather_cities');
    if (!raw) return;

    const cities: SavedCity[] = JSON.parse(raw);
    this.savedCities = cities;

    cities.forEach((c) => {
      const preset = PRESET_CITIES.find((p) => p.city === c.city);
      this.citiesWeather[c.city] = generateWeatherData(
        c.city,
        c.country,
        c.lat,
        c.lon,
        preset?.baseTemp ?? 20
      );
    });
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  get aqiLabel(): string {
    const aqi = this.currentWeather?.airQuality ?? 0;
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Hazardous';
  }

  get aqiColor(): string {
    const aqi = this.currentWeather?.airQuality ?? 0;
    if (aqi <= 50) return '#00C853';
    if (aqi <= 100) return '#FFD600';
    if (aqi <= 150) return '#FF6D00';
    if (aqi <= 200) return '#D50000';
    return '#6A0080';
  }
}

export const weatherStore = new WeatherStore();
