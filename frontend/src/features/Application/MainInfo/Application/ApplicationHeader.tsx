// src/components/Application/ApplicationHeader.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useApplicationStore } from '../stores/StoreContext';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Grid,
  Stack
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  Edit,
  Warning,
  Payments,
  Description
} from '@mui/icons-material';
import RejectPopup from './RejectPopup';
import { useTranslation } from 'react-i18next';

export const ApplicationHeader: React.FC = observer(() => {
  const { application } = useApplicationStore();
  const { t } = useTranslation();

  if (!application) return null;

  const getStatusInfo = () => {
    switch (application.status_code) {
      case 'draft':
        return {
          label: t('label:applicationHeader.status.draft'),
          color: 'info',
          icon: <AccessTime fontSize="small" />
        };
      case 'under_consideration':
        return {
          label: t('label:applicationHeader.status.underConsideration'),
          color: 'success',
          icon: <AccessTime fontSize="small" />
        };
      case 'rejected':
        return {
          label: t('label:applicationHeader.status.rejected'),
          color: 'error',
          icon: <Warning fontSize="small" />
        };
      case 'accepted':
        return {
          label: t('label:applicationHeader.status.accepted'),
          color: 'success',
          icon: <CheckCircle fontSize="small" />
        };
      case 'return_with_error':
        return {
          label: t('label:applicationHeader.status.returnWithError'),
          color: 'error',
          icon: <Warning fontSize="small" />
        };
      case 'done':
        return {
          label: t('label:applicationHeader.status.done'),
          color: 'success',
          icon: <Edit fontSize="small" />
        };
      case 'payment_required':
        return {
          label: 'Требуется оплата',
          color: 'error',
          icon: <Payments fontSize="small" />
        };
      case 'signature_required':
        return {
          label: 'Требуется подпись',
          color: 'error',
          icon: <Warning fontSize="small" />
        };
      case 'documents_ready':
        return {
          label: t('label:applicationHeader.status.documentsReady'),
          color: 'success',
          icon: <CheckCircle fontSize="small" />
        };
      default:
        return {
          label: t('label:applicationHeader.status.unknown'),
          color: 'default',
          icon: <Description fontSize="small" />
        };
    }
  };

  const statusInfo = getStatusInfo();
  const submissionDate = new Date(application.registration_date).toLocaleDateString('ru-RU');

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8} md={9}>
          <Stack direction="column" spacing={0.5}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ mb: 0.5 }}
            >
              {t('label:applicationHeader.applicationNumber', { number: application.number })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                aria-label={t('label:applicationHeader.submissionDateLabel')}
              >
                {t('label:applicationHeader.submitted', { date: submissionDate })}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: "center" }}>
          <RejectPopup />
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.label}
            color={statusInfo.color as any}
            size="medium"
            sx={{
              fontWeight: 'medium',
              px: 1,
              '& .MuiChip-label': { px: 1 }
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
});