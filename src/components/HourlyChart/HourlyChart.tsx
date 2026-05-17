import { Box, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';
import { CONDITION_META } from '../../utils/weatherData';

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(0,10,30,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 2,
        px: 2,
        py: 1.2,
      }}
    >
      <Typography variant="caption" color="rgba(255,255,255,0.6)" display="block">
        {label}
      </Typography>

      <Typography variant="body2" fontWeight={800} color="white">
        {payload[0].value}°{weatherStore.unit}
      </Typography>
    </Box>
  );
}

export const HourlyChart = observer(function HourlyChart() {
  const { currentWeather: w, toDisplay } = weatherStore;
  if (!w) return null;

  const data = w.hourly.slice(0, 24).map((h) => ({
    time: h.time,
    temp: toDisplay(h.temp),
    precip: h.precipChance,
    emoji: CONDITION_META[h.condition].emoji,
  }));

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 2,
          mb: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {w.hourly.slice(0, 12).map((h, i) => (
          <Box
            key={i}
            sx={{
              flexShrink: 0,
              textAlign: 'center',
              px: 1.5,
              py: 1.5,
              borderRadius: 3,
              minWidth: 64,
              backgroundColor: i === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
              border:
                i === 0 ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="caption" color="rgba(255,255,255,0.65)" display="block" mb={0.5}>
              {i === 0 ? 'Now' : h.time}
            </Typography>

            <Typography fontSize={22} mb={0.5}>
              {CONDITION_META[h.condition].emoji}
            </Typography>

            <Typography variant="body2" fontWeight={800} color="white">
              {toDisplay(h.temp)}°
            </Typography>

            {h.precipChance > 20 && (
              <Typography variant="caption" color="#69C9D0" display="block">
                💧{h.precipChance}%
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Typography variant="body2" fontWeight={700} color="rgba(255,255,255,0.7)" mb={1}>
        24h Temperature
      </Typography>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F7971E" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#F7971E" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            tickLine={false}
            interval={3}
          />

          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            unit="°"
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#F7971E"
            strokeWidth={2.5}
            fill="url(#tempGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
});
