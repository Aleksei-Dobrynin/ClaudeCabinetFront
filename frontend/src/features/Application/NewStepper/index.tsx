// src/features/Application/NewStepper/index.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Home as HomeIcon,
  NavigateNext,
  Security
} from "@mui/icons-material";
import { rootStore } from './stores/RootStore';

// Import step components
import ObjectStep from './components/steps/ObjectStep';
import ParticipantsStep from './components/steps/ParticipantsStep';
import DocumentsStep from './components/steps/DocumentsStep';
import ReviewStep from './components/steps/ReviewStep';
import PrintStep from './components/steps/PrintStep';
import CompletionStep from './components/steps/CompletionStep';
import Ckeditor from "components/ckeditor/ckeditor";
import MainStore from "MainStore";
import { runInAction } from "mobx";

const NewStepperApp: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");
  const tab = query.get("tab");
  const [consentSign, setConsentSign] = React.useState(false);
  const langRaw = i18n.language.split('-')[0];
  const currentLang = langRaw === 'ky' ? 'kg' : langRaw;

  React.useEffect(() => {
    const appId = id ? parseInt(id) : 0;
    rootStore.initialize(appId);
  }, [id]);

  React.useEffect(() => {
    if (tab && !isNaN(parseInt(tab))) {
      rootStore.setCurrentStep(parseInt(tab));
    }
  }, [tab]);

  const stepComponents = [
    <ObjectStep key="objects" />,
    <ParticipantsStep key="participants" />,
    <DocumentsStep key="documents" />,
    <ReviewStep key="review" />,
    <CompletionStep key="completion" />
  ];

  const getStepLabel = (label: string, index: number) => {
    if (isMobile) {
      return (
        <Box>
          <Typography variant="body2">{label}</Typography>
          {index < rootStore.currentStep && (
            <Check sx={{ fontSize: 16, ml: 1, color: 'success.main' }} />
          )}
        </Box>
      );
    }
    return label;
  };

  const handleConsentSign = () => {
    setConsentSign(true);
    rootStore.loadPersonalDataAgreementText();
  };

  const handleCloseConsentSign = () => {
    setConsentSign(false);
  };

  const handleAcceptConsent = () => {
    runInAction(() => {
      rootStore.isConsentSign = true;
    });
    setConsentSign(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          color="inherit"
          href="/user/dashboard"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          {t('common:home')}
        </Link>
        <Link
          color="inherit"
          href="/user/ApplicationAll"
          sx={{ textDecoration: 'none' }}
        >
          {t('common:applications')}
        </Link>
        <Typography color="text.primary">
          {rootStore.applicationId ? t('label:application.header.editApplication') : t('label:application.header.newApplication')}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {rootStore.applicationId ? t('label:application.header.editApplication') : t('label:application.header.newApplication')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('label:application.header.description')}
            </Typography>
          </Box>
          {rootStore.applicationNumber && (
            <Chip
              label={`№${rootStore.applicationNumber}`}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      </Paper>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper
          activeStep={rootStore.currentStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
        >
          {rootStore.steps.map((label, index) => (
            <Step key={label} completed={index < rootStore.currentStep}>
              <StepLabel>
                {getStepLabel(label, index)}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {rootStore.isLoading && (
          <LinearProgress sx={{ mt: 2 }} />
        )}
      </Paper>

      {/* Content */}
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        {rootStore.isLoading && rootStore.currentStep !== 0 ? (
          <Box display="flex" justifyContent="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {stepComponents[rootStore.currentStep]}

            {/* Navigation */}
            {!rootStore.isLastStep && (
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={isMobile ? 'column' : 'row'}
                gap={2}
                mt={4}
                pt={3}
                borderTop={1}
                borderColor="divider"
              >
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeft />}
                  onClick={() => rootStore.previousStep()}
                  disabled={!rootStore.canNavigateBack}
                  fullWidth={isMobile}
                >
                  {t('common:back')}
                </Button>

                <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'} width={isMobile ? '100%' : 'auto'}>
                  {!rootStore.isReviewStep && (
                    <Button
                      variant="contained"
                      endIcon={rootStore.isPrintStep ? <Check /> : <ChevronRight />}
                      onClick={async () => {
                        console.log('🖱️ Next button clicked');
                        await rootStore.nextStep();
                      }}
                      disabled={!rootStore.canNavigateNext || rootStore.isLoading}
                      fullWidth={isMobile}
                    >
                      {rootStore.isPrintStep ? t('common:finish') : t('common:next')}
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={rootStore.snackbar.open}
        autoHideDuration={6000}
        onClose={() => rootStore.closeSnackbar()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => rootStore.closeSnackbar()}
          severity={rootStore.snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {rootStore.snackbar.message}
        </Alert>
      </Snackbar>

      {/* Consent Dialog */}
      <Dialog
        open={consentSign}
        onClose={handleCloseConsentSign}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Security color="primary" />
            <Typography variant="h6">
              {t('label:application.consent.title')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Ckeditor
            onChange={() => { }}
            value={rootStore.personalDataAgreementText}
            withoutPlaceholder
            disabled={true}
            name="personalDataAgreementText"
            id="personalDataAgreementText"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsentSign} color="inherit">
            {t('common:cancel')}
          </Button>
          <Button
            onClick={handleAcceptConsent}
            variant="contained"
            startIcon={<Check />}
          >
            {t('common:accept')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default NewStepperApp;