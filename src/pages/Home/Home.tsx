import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';
import { themeStore } from '../../stores/themeStore';
import { CONDITION_META, PRESET_CITIES } from '../../utils/weatherData';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { HourlyChart } from '../../components/HourlyChart/HourlyChart';
import { WeeklyForecast } from '../../components/WeeklyForecast/WeeklyForecast';
import { WeatherDetails } from '../../components/WeatherDetails/WeatherDetails';
import { CityCard } from '../../components/CityCard/CityCard';

function glassCard(dark: boolean) {
  return {
    backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(5,15,40,0.58)',
    backdropFilter: 'blur(24px)',
    border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.18)',
    borderRadius: 3,
    p: { xs: 2, sm: 3 },
  };
}

export const Home = observer(function Home() {
  const { currentWeather: w, isLoading, unit, activeTab, savedCities } = weatherStore;
  const dark = themeStore.isDark;
  const meta = w ? CONDITION_META[w.condition] : null;
  const isSaved = w ? weatherStore.isSaved(w.city) : false;

  function handleSave() {
    if (!w) return;
    weatherStore.saveCity({ city: w.city, country: w.country, lat: w.lat, lon: w.lon });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: meta
          ? `linear-gradient(160deg, ${meta.gradient[0]} 0%, ${meta.gradient[1]} 100%)`
          : 'linear-gradient(160deg, #0f2027, #203a43, #2c5364)',
        transition: 'background 1.2s ease',
      }}
    >
      {/* ── Top bar ── */}
      <Box sx={{ pt: { xs: 2, sm: 3 }, pb: 1 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="h5"
              fontWeight={900}
              color="white"
              sx={{ flexShrink: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              ⛅ WeatherNow
            </Typography>

            {/* Search — на мобильном переносится под логотип */}
            <Box
              sx={{
                order: { xs: 3, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
                flex: { sm: 1 },
                maxWidth: { sm: 480 },
                mx: { sm: 'auto' },
              }}
            >
              <SearchBar />
            </Box>

            {/* Controls */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: { xs: 'auto', sm: 0 } }}
            >
              <ToggleButtonGroup
                value={unit}
                exclusive
                size="small"
                onChange={(_, v) => v && weatherStore.setUnit(v)}
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 700,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                    },
                  },
                }}
              >
                <ToggleButton value="C">°C</ToggleButton>
                <ToggleButton value="F">°F</ToggleButton>
              </ToggleButtonGroup>

              <Tooltip title="My location">
                <IconButton
                  onClick={weatherStore.fetchCurrentLocation}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <MyLocationIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh">
                <IconButton
                  onClick={weatherStore.fetchCurrentLocation}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={dark ? 'Light mode' : 'Dark mode'}>
                <IconButton
                  onClick={themeStore.toggleTheme}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {dark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Main content ── */}
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Grid container spacing={3}>
          {/* ── Left — Main weather card ── */}
          <Grid item xs={12} md={5} lg={4}>
            <Box
              sx={{
                ...glassCard(dark),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={40}
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={100}
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)' }}
                  />
                </>
              ) : w ? (
                <>
                  {/* City header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box>
                      <Typography variant="h4" fontWeight={900} color="white">
                        {w.city}
                      </Typography>

                      <Typography variant="body2" color="rgba(255,255,255,0.7)">
                        {w.country} · {w.timezone}
                      </Typography>

                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        Updated {w.updatedAt}
                      </Typography>
                    </Box>

                    <Tooltip title={isSaved ? 'Already saved' : 'Save city'}>
                      <IconButton
                        onClick={handleSave}
                        disabled={isSaved}
                        sx={{ color: 'rgba(255,255,255,0.8)' }}
                      >
                        {isSaved ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Temperature */}
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography sx={{ fontSize: 90, lineHeight: 1, mb: 0 }}>
                      {CONDITION_META[w.condition].emoji}
                    </Typography>

                    <Typography
                      variant="h1"
                      fontWeight={900}
                      color="white"
                      sx={{
                        fontSize: { xs: '5rem', sm: '6rem' },
                        lineHeight: 1,
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      {weatherStore.tempLabel(w.temp)}
                    </Typography>

                    <Typography variant="h6" color="rgba(255,255,255,0.85)" fontWeight={400}>
                      {w.description}
                    </Typography>

                    <Typography variant="body2" color="rgba(255,255,255,0.65)">
                      Feels like {weatherStore.tempLabel(w.feelsLike)} · H:
                      {weatherStore.tempLabel(w.tempMax)} L:{weatherStore.tempLabel(w.tempMin)}
                    </Typography>
                  </Box>

                  {/* Quick stats */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      py: 2,
                      borderTop: '1px solid rgba(255,255,255,0.12)',
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {[
                      { label: 'Humidity', value: `${w.humidity}%` },
                      { label: 'Wind', value: `${w.windSpeed} km/h` },
                      { label: 'UV Index', value: String(w.uvIndex) },
                    ].map((s) => (
                      <Box key={s.label} sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" fontWeight={800} color="white">
                          {s.value}
                        </Typography>

                        <Typography variant="caption" color="rgba(255,255,255,0.6)">
                          {s.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Sunrise / Sunset */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        🌅 Sunrise
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="white">
                        {w.sunrise}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        🌇 Sunset
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="white">
                        {w.sunset}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.6)">
                        👁 Visibility
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="white">
                        {w.visibility} km
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : null}
            </Box>
          </Grid>

          {/* ── Right — Charts & details ── */}
          <Grid item xs={12} md={7} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
              {/* Forecast tabs */}
              <Box sx={{ ...glassCard(dark) }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={800} color="white">
                    Forecast
                  </Typography>

                  <ToggleButtonGroup
                    value={activeTab}
                    exclusive
                    size="small"
                    onChange={(_, v) => v && weatherStore.setActiveTab(v)}
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        px: 2,
                        py: 0.4,
                        fontSize: 13,
                        fontWeight: 700,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderColor: 'rgba(255,255,255,0.35)',
                        },
                      },
                    }}
                  >
                    <ToggleButton value="hourly">Hourly</ToggleButton>
                    <ToggleButton value="daily">7-Day</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {isLoading ? (
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)' }}
                  />
                ) : activeTab === 'hourly' ? (
                  <HourlyChart />
                ) : (
                  <WeeklyForecast />
                )}
              </Box>

              {/* Details grid */}
              {!isLoading && (
                <Box sx={{ ...glassCard(dark) }}>
                  <WeatherDetails />
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── Saved cities ── */}
          {savedCities.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ ...glassCard(dark) }}>
                <Typography variant="h6" fontWeight={800} color="white" mb={2}>
                  Saved Cities
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {savedCities.map((c) => (
                    <CityCard key={c.city} cityName={c.city} />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* ── Explore cities ── */}
          <Grid item xs={12}>
            <Box sx={{ ...glassCard(dark) }}>
              <Typography variant="h6" fontWeight={800} color="white" mb={2}>
                🌍 Explore Cities
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {PRESET_CITIES.map((c) => (
                  <Chip
                    key={c.city}
                    label={`${c.city}, ${c.country}`}
                    onClick={() => weatherStore.selectCity(c)}
                    icon={<AddIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontWeight: 600,
                      fontSize: 13,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});
