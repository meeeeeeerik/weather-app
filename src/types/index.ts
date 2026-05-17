export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'heavy_rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'blizzard'
  | 'fog'
  | 'haze'
  | 'windy';

export interface HourlyData {
  time: string; // "14:00"
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  precipChance: number;
}

export interface DailyForecast {
  date: string; // "Mon", "Tue"...
  dateLabel: string; // "Dec 18"
  tempHigh: number;
  tempLow: number;
  condition: WeatherCondition;
  precipChance: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  visibility: number; // km
  uvIndex: number;
  pressure: number; // hPa
  dewPoint: number;
  condition: WeatherCondition;
  description: string;
  sunrise: string; // "06:42"
  sunset: string; // "17:28"
  airQuality: number; // AQI 0-500
  hourly: HourlyData[];
  daily: DailyForecast[];
  updatedAt: string;
}

export interface SavedCity {
  city: string;
  country: string;
  lat: number;
  lon: number;
}
