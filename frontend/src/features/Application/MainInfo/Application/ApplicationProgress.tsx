// src/components/Application/ApplicationProgress.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useApplicationStore } from '../stores/StoreContext';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  useTheme,
  Button
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('ru');

export const ApplicationProgress: React.FC = observer(() => {
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const application = applicationStore.applicationMain;
  const { t } = useTranslation();

  if (!application) return null;

  const registrationDate = dayjs(application.registration_date);
  const deadlineDate = application.deadline ? dayjs(application.deadline) : null;
  const currentDate = dayjs();

  const calculateProgress = (): number => {
    if (application.status_code === 'completed') return 100;
    if (application.status_code === 'rejected') return 0;
    
    if (!deadlineDate) {
      const standardDays = 30;
      const progress = Math.min((elapsedDays / standardDays) * 100, 99);
      return Math.round(progress);
    }
    
    const totalDays = deadlineDate.diff(registrationDate, 'day');
    if (totalDays <= 0) return 0;
    
    const progress = Math.min((elapsedDays / totalDays) * 100, 99);
    return Math.round(progress);
  };

  const calculateTotalDays = (): number => {
    if (!deadlineDate) return 30; 
    return deadlineDate.diff(registrationDate, 'day');
  };

  const calculateElapsedDays = (): number => {
    return currentDate.diff(registrationDate, 'day');
  };

  const calculateRemainingDays = (): number => {
    if (!deadlineDate) return 0;
    const diff = deadlineDate.diff(currentDate, 'day');
    return diff > 0 ? diff : 0;
  };

  const totalDays = calculateTotalDays();
  const elapsedDays = calculateElapsedDays();
  const remainingDays = calculateRemainingDays();
  const progress = calculateProgress();
  
  const timeProgress = progress;

  const getProgressColor = () => {
    if (application.status_code === 'rejected') return theme.palette.error.main;
    if (application.status_code === 'completed') return theme.palette.success.main;
    if (remainingDays > 0 && remainingDays < 5) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  const getDeadlineStatus = () => {
    if (application.status_code === 'completed') {
      return { 
        text: t('common:Completed'), 
        color: 'success', 
        icon: <CheckCircleIcon fontSize="small" /> 
      };
    }
    if (application.status_code === 'rejected') {
      return { 
        text: t('common:Rejected'), 
        color: 'error', 
        icon: <WarningIcon fontSize="small" /> 
      };
    }
    if (!deadlineDate) {
      return { 
        text: t('common:DateNotDetermened'), 
        color: 'default', 
        icon: <InfoIcon fontSize="small" /> 
      };
    }
    if (remainingDays === 0) {
      return { 
        text: t('common:DateMissed'), 
        color: 'error', 
        icon: <WarningIcon fontSize="small" /> 
      };
    }
    if (remainingDays < 5) {
      return { 
        text: t('label:applicationProgress.remainingDays', { days: remainingDays }), 
        color: 'warning', 
        icon: <WarningIcon fontSize="small" /> 
      };
    }
    return { 
      text: t('label:applicationProgress.remainingDays', { days: remainingDays }), 
      color: 'info', 
      icon: <InfoIcon fontSize="small" /> 
    };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
        {t('label:applicationProgress.processingTitle')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
          {application.service_name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {t('label:applicationProgress.currentStep')}:
          </Typography>
          <Chip 
            label={application.current_step?.name}
            size="small"
            color={application.status_code === 'approved_cabinet' ? 'success' : 'default'}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('label:applicationProgress.submissionDate')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {registrationDate.format('DD.MM.YYYY')}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                color: getProgressColor()
              }}
            >
              {progress}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('label:applicationProgress.timeProgress')}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              {t('label:applicationProgress.deadline')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {deadlineDate 
                ? deadlineDate.format('DD.MM.YYYY')
                : t('label:applicationProgress.notSet')
              }
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: getProgressColor(),
                borderRadius: 6
              }
            }}
          />
          
          {deadlineDate && progress < 100 && (
            <Tooltip title={t('label:applicationProgress.dayTooltip', { elapsed: elapsedDays, total: totalDays })}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: `${progress}%`,
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 28,
                  bgcolor: 'text.secondary',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: `4px solid ${theme.palette.text.secondary}`
                  }
                }}
              />
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {deadlineDate 
              ? t('label:applicationProgress.dayProgress', { elapsed: elapsedDays, total: totalDays })
              : t('label:applicationProgress.elapsedDays', { days: elapsedDays })
            }
          </Typography>
          <Chip
            label={deadlineStatus.text}
            color={deadlineStatus.color as any}
            size="small"
            icon={deadlineStatus.icon}
          />
        </Box>
      </Box>
    </Paper>
  );
});