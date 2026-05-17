import { useRef, useEffect } from 'react';
import {
  Box,
  InputBase,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';
import { weatherStore } from '../../stores/weatherStore';

export const SearchBar = observer(function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchQuery, searchResults, isLoading } = weatherStore;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') weatherStore.clearSearch();
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 50,
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'all 0.2s',
          '&:focus-within': {
            backgroundColor: 'rgba(255,255,255,0.22)',
            border: '1px solid rgba(255,255,255,0.5)',
          },
        }}
      >
        {isLoading && searchQuery ? (
          <CircularProgress size={18} sx={{ color: 'white' }} />
        ) : (
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
        )}

        <InputBase
          inputRef={inputRef}
          placeholder="Search city..."
          value={searchQuery}
          onChange={(e) => weatherStore.setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            color: 'white',
            fontSize: 15,
            '& ::placeholder': { color: 'rgba(255,255,255,0.6)' },
          }}
        />

        {searchQuery && (
          <CloseIcon
            onClick={weatherStore.clearSearch}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 18,
              cursor: 'pointer',
              '&:hover': { color: 'white' },
            }}
          />
        )}
      </Paper>

      {searchResults.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            zIndex: 100,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'rgba(20,30,50,0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <List dense disablePadding>
            {searchResults.map((city) => (
              <ListItemButton
                key={`${city.city}-${city.country}`}
                onClick={() => weatherStore.selectCity(city)}
                sx={{
                  py: 1.2,
                  px: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <LocationOnIcon sx={{ color: '#4DA0B0', fontSize: 18, mr: 1.5 }} />

                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={700} color="white">
                      {city.city}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">
                      {city.country}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
});
