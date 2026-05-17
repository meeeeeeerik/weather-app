import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';
import { CONDITION_META } from '../../utils/weatherData';

export const WeeklyForecast = observer(function WeeklyForecast() {
  const { currentWeather: w, toDisplay } = weatherStore;
  if (!w) return null;

  const allHighs = w.daily.map((d) => d.tempHigh);
  const allLows = w.daily.map((d) => d.tempLow);
  const minTemp = Math.min(...allLows);
  const maxTemp = Math.max(...allHighs);
  const range = maxTemp - minTemp || 1;

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} color="white" mb={1.5}>
        7-Day Forecast
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {w.daily.map((day, i) => {
          const meta = CONDITION_META[day.condition];
          const barStart = ((day.tempLow - minTemp) / range) * 100;
          const barWidth = ((day.tempHigh - day.tempLow) / range) * 100;

          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.2,
                px: 1.5,
                borderRadius: 2.5,
                transition: 'background 0.15s',
                backgroundColor: i === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
                border: i === 0 ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <Box sx={{ width: 72, flexShrink: 0 }}>
                <Typography variant="body2" fontWeight={i === 0 ? 800 : 600} color="white">
                  {day.date}
                </Typography>

                <Typography variant="caption" color="rgba(255,255,255,0.45)">
                  {day.dateLabel}
                </Typography>
              </Box>

              <Typography fontSize={22} sx={{ flexShrink: 0 }}>
                {meta.emoji}
              </Typography>

              <Box sx={{ flexShrink: 0, width: 70 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.65)" noWrap>
                  {meta.label}
                </Typography>

                {day.precipChance > 20 && (
                  <Typography variant="caption" color="#69C9D0" display="block">
                    💧 {day.precipChance}%
                  </Typography>
                )}
              </Box>

              <Box sx={{ flex: 1, position: 'relative', height: 6, mx: 1 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    borderRadius: 4,
                    left: `${barStart}%`,
                    width: `${barWidth}%`,
                    background: 'linear-gradient(90deg, #4DA0B0, #F7971E)',
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexShrink: 0,
                  minWidth: 80,
                  justifyContent: 'flex-end',
                }}
              >
                <Typography variant="body2" color="rgba(255,255,255,0.5)" fontWeight={600}>
                  {toDisplay(day.tempLow)}°
                </Typography>

                <Typography variant="body2" color="white" fontWeight={800}>
                  {toDisplay(day.tempHigh)}°
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
});
