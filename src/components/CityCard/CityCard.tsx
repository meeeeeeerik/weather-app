import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';
import { CONDITION_META, PRESET_CITIES } from '../../utils/weatherData';

interface CityCardProps {
  cityName: string;
}

export const CityCard = observer(function CityCard({ cityName }: CityCardProps) {
  const data = weatherStore.citiesWeather[cityName];
  if (!data) return null;

  const meta = CONDITION_META[data.condition];
  const preset = PRESET_CITIES.find((p) => p.city === cityName);

  return (
    <Box
      onClick={() => preset && weatherStore.selectCity(preset)}
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: 3,
        cursor: 'pointer',
        flexShrink: 0,
        width: { xs: 160, sm: 180 },
        background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(0,0,0,0.3)' },
      }}
    >
      <Tooltip title="Remove">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            weatherStore.removeCity(cityName);
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            p: 0.3,
            color: meta.textColor,
            opacity: 0.7,
            '&:hover': { opacity: 1 },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>

      <Typography variant="caption" sx={{ color: `${meta.textColor}99` }} display="block">
        {data.country}
      </Typography>

      <Typography variant="body2" fontWeight={800} sx={{ color: meta.textColor }} mb={1}>
        {cityName}
      </Typography>

      <Typography fontSize={28} mb={0.5}>
        {meta.emoji}
      </Typography>

      <Typography variant="h5" fontWeight={900} sx={{ color: meta.textColor }}>
        {weatherStore.toDisplay(data.temp)}°{weatherStore.unit}
      </Typography>

      <Typography variant="caption" sx={{ color: `${meta.textColor}bb` }}>
        {meta.label}
      </Typography>
    </Box>
  );
});
