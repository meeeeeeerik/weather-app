import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompressIcon from '@mui/icons-material/Compress';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import SpeedIcon from '@mui/icons-material/Speed';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';

const tileStyle = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 3,
  color: 'white',
};

interface DetailTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  progressColor?: string;
}

function DetailTile({ icon, label, value, sub, progress, progressColor }: DetailTileProps) {
  return (
    <Card sx={{ ...tileStyle, height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            mb: 1.5,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {icon}
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}
          >
            {label}
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={800} color="white" mb={0.3}>
          {value}
        </Typography>

        {sub && (
          <Typography variant="caption" color="rgba(255,255,255,0.55)">
            {sub}
          </Typography>
        )}

        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              mt: 1.5,
              height: 6,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.15)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: progressColor ?? '#4DA0B0',
                borderRadius: 4,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export const WeatherDetails = observer(function WeatherDetails() {
  const { currentWeather: w, tempLabel, aqiLabel, aqiColor } = weatherStore;
  if (!w) return null;

  const uvColor =
    w.uvIndex <= 2
      ? '#00C853'
      : w.uvIndex <= 5
        ? '#FFD600'
        : w.uvIndex <= 7
          ? '#FF6D00'
          : '#D50000';

  const tiles = [
    {
      icon: <WaterDropIcon fontSize="small" />,
      label: 'Humidity',
      value: `${w.humidity}%`,
      sub: w.humidity > 70 ? 'High' : w.humidity > 40 ? 'Comfortable' : 'Low',
      progress: w.humidity,
      progressColor: '#4DA0B0',
    },
    {
      icon: <AirIcon fontSize="small" />,
      label: 'Wind',
      value: `${w.windSpeed} km/h`,
      sub: `Direction: ${w.windDir}`,
      progress: Math.min(100, (w.windSpeed / 60) * 100),
      progressColor: '#69C9D0',
    },
    {
      icon: <VisibilityIcon fontSize="small" />,
      label: 'Visibility',
      value: `${w.visibility} km`,
      sub: w.visibility >= 10 ? 'Excellent' : w.visibility >= 5 ? 'Good' : 'Poor',
    },
    {
      icon: <WbSunnyIcon fontSize="small" />,
      label: 'UV Index',
      value: String(w.uvIndex),
      sub:
        w.uvIndex <= 2
          ? 'Low'
          : w.uvIndex <= 5
            ? 'Moderate'
            : w.uvIndex <= 7
              ? 'High'
              : 'Very High',
      progress: (w.uvIndex / 11) * 100,
      progressColor: uvColor,
    },
    {
      icon: <CompressIcon fontSize="small" />,
      label: 'Pressure',
      value: `${w.pressure} hPa`,
      sub: w.pressure >= 1013 ? 'High pressure' : 'Low pressure',
    },
    {
      icon: <ThermostatIcon fontSize="small" />,
      label: 'Dew Point',
      value: tempLabel(w.dewPoint),
      sub: 'Moisture in air',
    },
    {
      icon: <SpeedIcon fontSize="small" />,
      label: 'Air Quality',
      value: `AQI ${w.airQuality}`,
      sub: aqiLabel,
      progress: Math.min(100, (w.airQuality / 200) * 100),
      progressColor: aqiColor,
    },
    {
      icon: <WbTwilightIcon fontSize="small" />,
      label: 'Sun',
      value: w.sunrise,
      sub: `Sunset: ${w.sunset}`,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} color="white" mb={2}>
        Details
      </Typography>

      <Grid container spacing={1.5}>
        {tiles.map((t) => (
          <Grid item xs={6} sm={4} md={3} lg={6} xl={3} key={t.label}>
            <DetailTile {...t} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});
