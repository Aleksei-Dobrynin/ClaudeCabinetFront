// src/App.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ApplicationView } from './Application';
import { useStore } from './stores/StoreContext';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { ReportProblem, Refresh } from '@mui/icons-material';

const ApplicationContainer = observer(() => {
  const { t } = useTranslation();
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");

  useEffect(() => {
    if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
      applicationStore.doLoad(Number(id))
    }
  }, []);
  const applicationId = 'app-123456';

  const { applicationStore, errorStore } = useStore();

  // useEffect(() => {
  //   applicationStore.fetchApplication(applicationId);
  // }, [applicationId, applicationStore]);

  if (applicationStore.isLoading && !applicationStore.application) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={48} color="primary" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('label:application.loading.dataLoading')}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (errorStore.hasError('fetchApplication') && !applicationStore.application) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 'md',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <ReportProblem color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h5" component="h2" sx={{ mt: 2, fontWeight: 'bold' }}>
            {t('label:application.error.loadingError')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {errorStore.getError('fetchApplication')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={() => applicationStore.fetchApplication()}
            sx={{ mt: 3 }}
          >
            {t('label:application.error.tryAgain')}
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!applicationStore.application) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 'md',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <ReportProblem color="warning" sx={{ fontSize: 48 }} />
          <Typography variant="h5" component="h2" sx={{ mt: 2, fontWeight: 'bold' }}>
            {t('label:application.error.notFound')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('label:application.error.notFoundDescription')}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {errorStore.hasGlobalError && (
        <Alert
          severity="error"
          onClose={() => errorStore.setGlobalError(null)}
          sx={{ mb: 3 }}
        >
          {errorStore.globalError}
        </Alert>
      )}

      <ErrorBoundary onError={(error) => errorStore.setGlobalError(error.message)}>
        <ApplicationView />
      </ErrorBoundary>
    </Container>
  );
});

const App: React.FC = () => {
  return <ApplicationContainer />;
};

export default App;