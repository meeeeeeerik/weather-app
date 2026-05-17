import type { WeatherCondition, WeatherData, HourlyData, DailyForecast } from '../types';

export interface ConditionMeta {
  label: string;
  emoji: string;
  gradient: [string, string];
  textColor: string;
}

export const CONDITION_META: Record<WeatherCondition, ConditionMeta> = {
  clear: { label: 'Clear Sky', emoji: '☀️', gradient: ['#F7971E', '#FFD200'], textColor: '#fff' },
  partly_cloudy: {
    label: 'Partly Cloudy',
    emoji: '⛅',
    gradient: ['#4DA0B0', '#D39D38'],
    textColor: '#fff',
  },
  cloudy: { label: 'Cloudy', emoji: '🌤️', gradient: ['#757F9A', '#D7DDE8'], textColor: '#fff' },
  overcast: { label: 'Overcast', emoji: '☁️', gradient: ['#485563', '#29323C'], textColor: '#fff' },
  rain: { label: 'Rain', emoji: '🌧️', gradient: ['#373B44', '#4286f4'], textColor: '#fff' },
  heavy_rain: {
    label: 'Heavy Rain',
    emoji: '⛈️',
    gradient: ['#1F1C2C', '#928DAB'],
    textColor: '#fff',
  },
  drizzle: { label: 'Drizzle', emoji: '🌦️', gradient: ['#536976', '#292E49'], textColor: '#fff' },
  thunderstorm: {
    label: 'Thunderstorm',
    emoji: '⛈️',
    gradient: ['#200122', '#6f0000'],
    textColor: '#fff',
  },
  snow: { label: 'Snow', emoji: '❄️', gradient: ['#83a4d4', '#b6fbff'], textColor: '#1a2a4a' },
  blizzard: { label: 'Blizzard', emoji: '🌨️', gradient: ['#d7d2cc', '#304352'], textColor: '#fff' },
  fog: { label: 'Foggy', emoji: '🌫️', gradient: ['#B8C6DB', '#F5F7FA'], textColor: '#333' },
  haze: { label: 'Haze', emoji: '🌁', gradient: ['#C9D6FF', '#E2E2E2'], textColor: '#333' },
  windy: { label: 'Windy', emoji: '🌬️', gradient: ['#1a1a2e', '#16213e'], textColor: '#fff' },
};

function rand(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
const conditions: WeatherCondition[] = [
  'clear',
  'partly_cloudy',
  'cloudy',
  'rain',
  'drizzle',
  'overcast',
];
const windDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function generateWeatherData(
  city: string,
  country: string,
  lat: number,
  lon: number,
  baseTempC = 18
): WeatherData {
  const condition = conditions[rand(0, conditions.length - 1)];
  const temp = baseTempC + rand(-5, 5);
  const isRainy = ['rain', 'heavy_rain', 'drizzle', 'thunderstorm'].includes(condition);

  const now = new Date();

  // Hourly — next 24 hours
  const hourly: HourlyData[] = Array.from({ length: 24 }, (_, i) => {
    const h = new Date(now.getTime() + i * 3600000);
    const hour = h.getHours();
    const dayTemp = temp + Math.sin(((hour - 6) * Math.PI) / 12) * 5;
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      temp: Math.round(dayTemp + rand(-2, 2)),
      feelsLike: Math.round(dayTemp - rand(1, 4)),
      condition: i % 6 === 0 && rand(0, 1) ? conditions[rand(0, conditions.length - 1)] : condition,
      humidity: rand(40, 90),
      windSpeed: rand(5, 35),
      precipChance: isRainy ? rand(40, 95) : rand(0, 30),
    };
  });

  // Daily — 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const daily: DailyForecast[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    const dc = conditions[rand(0, conditions.length - 1)];
    const isR = ['rain', 'heavy_rain', 'drizzle'].includes(dc);
    return {
      date: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
      dateLabel: `${months[d.getMonth()]} ${d.getDate()}`,
      tempHigh: temp + rand(0, 6),
      tempLow: temp - rand(3, 8),
      condition: dc,
      precipChance: isR ? rand(50, 90) : rand(5, 30),
      humidity: rand(40, 85),
      windSpeed: rand(8, 40),
      uvIndex: rand(1, 10),
    };
  });

  return {
    city,
    country,
    lat,
    lon,
    timezone: 'Local Time',
    temp,
    feelsLike: temp - rand(1, 5),
    tempMin: temp - rand(3, 7),
    tempMax: temp + rand(2, 6),
    humidity: rand(45, 85),
    windSpeed: rand(8, 35),
    windDir: windDirs[rand(0, windDirs.length - 1)],
    visibility: rand(5, 20),
    uvIndex: rand(1, 10),
    pressure: rand(1005, 1025),
    dewPoint: temp - rand(5, 12),
    condition,
    description: CONDITION_META[condition].label,
    sunrise: `0${rand(5, 7)}:${String(rand(15, 55)).padStart(2, '0')}`,
    sunset: `1${rand(6, 9)}:${String(rand(10, 55)).padStart(2, '0')}`,
    airQuality: rand(20, 120),
    hourly,
    daily,
    updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export const PRESET_CITIES = [
  { city: 'New York', country: 'US', lat: 40.71, lon: -74.01, baseTemp: 14 },
  { city: 'London', country: 'GB', lat: 51.51, lon: -0.13, baseTemp: 11 },
  { city: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69, baseTemp: 16 },
  { city: 'Dubai', country: 'AE', lat: 25.2, lon: 55.27, baseTemp: 34 },
  { city: 'Paris', country: 'FR', lat: 48.85, lon: 2.35, baseTemp: 12 },
  { city: 'Sydney', country: 'AU', lat: -33.87, lon: 151.21, baseTemp: 22 },
  { city: 'Moscow', country: 'RU', lat: 55.75, lon: 37.62, baseTemp: 3 },
  { city: 'Singapore', country: 'SG', lat: 1.35, lon: 103.82, baseTemp: 30 },
  { city: 'São Paulo', country: 'BR', lat: -23.55, lon: -46.63, baseTemp: 24 },
  { city: 'Cairo', country: 'EG', lat: 30.04, lon: 31.24, baseTemp: 28 },
  { city: 'Toronto', country: 'CA', lat: 43.65, lon: -79.38, baseTemp: 10 },
  { city: 'Berlin', country: 'DE', lat: 52.52, lon: 13.4, baseTemp: 10 },
];
