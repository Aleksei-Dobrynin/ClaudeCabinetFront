import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  FormHelperText, 
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Paper
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CountryPhone, DEFAULT_COUNTRIES } from 'constants/countrieCodes';

export interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string, country: CountryPhone) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id: string;
  label: string;
  countries?: CountryPhone[]; 
  defaultCountryId?: string; 
}

const PhoneInputWithCountry: React.FC<PhoneInputWithCountryProps> = ({
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  id,
  label,
  countries = DEFAULT_COUNTRIES,
  defaultCountryId = 'kg'
}) => {
  const [open, setOpen] = useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const toggleCountryList = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const parsePhoneValue = (phoneValue: string) => {
    if (!phoneValue) {
      const defaultCountry = countries.find(c => c.id === defaultCountryId) || countries[0];
      return { country: defaultCountry, localNumber: '' };
    }

    for (const country of countries) {
      if (phoneValue.startsWith(country.phoneCode)) {
        const localNumber = phoneValue.substring(country.phoneCode.length);
        return { country, localNumber };
      }
    }

    const defaultCountry = countries.find(c => c.id === defaultCountryId) || countries[0];
    return { country: defaultCountry, localNumber: phoneValue };
  };

  const { country, localNumber } = parsePhoneValue(value);

  const handleCountrySelect = (selectedCountry: CountryPhone) => {
    onChange(selectedCountry.phoneCode + localNumber.replace(/\D/g, ''), selectedCountry);
    setOpen(false);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocalNumber = event.target.value;
    
    const digitsOnly = newLocalNumber.replace(/\D/g, '');
    
    onChange(country.phoneCode + digitsOnly, country);
  };

  const applyMask = (input: string, format: string) => {
    if (!input) return '';
    
    let result = '';
    let inputIndex = 0;

    for (let i = 0; i < format.length && inputIndex < input.length; i++) {
      if (format[i] === '0') {
        if (inputIndex < input.length) {
          result += input[inputIndex];
          inputIndex++;
        }
      } else {
        result += format[i];
      }
    }

    return result;
  };

  const cleanLocalNumber = localNumber.replace(/\D/g, '');
  
  const formattedLocalNumber = applyMask(cleanLocalNumber, country.phoneFormat);

  const CountryAdornment = () => (
    <InputAdornment position="start">
      <Box 
        onClick={toggleCountryList}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: disabled ? 'default' : 'pointer',
          borderRight: '1px solid #ccc',
          pr: 1,
          mr: 1
        }}
      >
        {country.flagIcon && (
          <Avatar 
            src={country.flagIcon} 
            alt={country.name} 
            sx={{ width: 24, height: 24, mr: 1 }}
          />
        )}
        <Typography variant="body2">{country.phoneCode}</Typography>
        {open ? 
          <KeyboardArrowUpIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
          <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
        }
      </Box>
    </InputAdornment>
  );

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        label={label}
        id={id}
        value={formattedLocalNumber}
        onChange={handlePhoneNumberChange}
        disabled={disabled}
        error={error}
        InputProps={{
          startAdornment: <CountryAdornment />
        }}
      />
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            zIndex: 1200,
            mt: 0.5,
            maxHeight: 300,
            overflow: 'auto'
          }}
        >
          <List dense disablePadding>
            {countries.map((option) => (
              <ListItem 
                key={option.id} 
                onClick={() => handleCountrySelect(option)}
                selected={option.id === country.id}
                button
                divider
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  '&.Mui-selected': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  {option.flagIcon && (
                    <Avatar 
                      src={option.flagIcon} 
                      alt={option.name}
                      sx={{ width: 24, height: 24 }}
                    />
                  )}
                </ListItemAvatar>
                <ListItemText 
                  primary={option.name} 
                  sx={{ margin: 0 }} 
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {option.phoneCode}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default PhoneInputWithCountry;