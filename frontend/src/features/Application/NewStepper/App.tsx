// App.tsx

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
import Ckeditor from "../../../components/ckeditor/ckeditor";
import MainStore from "../../../MainStore";
import { runInAction } from "mobx";

const App: React.FC = observer(() => {
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
    if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
      rootStore.initialize(Number(id));
      if (tab && !isNaN(Number(tab.toString()))) {
        rootStore.setCurrentStep(Number(tab))
      } else {
        setConsentSign(true);
        rootStore.loadPersonalDataAgreementText();
      }
    }
  }, []);

  const stepComponents = [
    <ObjectStep />,
    <ParticipantsStep />,
    <DocumentsStep />,
    <ReviewStep />,
    // <PrintStep />,
    <CompletionStep />
  ];

  const handleCloseConsentSign = () => {
    setConsentSign(false);
  };

  const handleSignDocuments = async () => {
    MainStore.openDigitalSign(
      [],
      rootStore.applicationId,
      async () => {
        MainStore.onCloseDigitalSign();
        runInAction(() => {
          rootStore.digitalSignatureDate = new Date();
          rootStore.isConsentSign = true;
        })
      },
      () => MainStore.onCloseDigitalSign(),
    );
  };

  const getStepLabel = (step: string, index: number) => {
    if (index === 0 && rootStore.applicationId > 0) {
      return `${step} ✓`;
    }
    return step;
  };

  if (rootStore.isLoading && rootStore.currentStep === 0 && rootStore.applicationId > 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            href="/user"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            {t('label:application.breadcrumbs.home')}
          </Link>
          <Link
            color="inherit"
            href="/user/ApplicationAll"
            sx={{
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {t('label:application.breadcrumbs.myApplications')}
          </Link>
        </Breadcrumbs>

        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {rootStore.applicationId > 0 ? t('label:application.header.editApplication') : t('label:application.header.newApplication')}
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
                    {!rootStore.isReviewStep &&
                      <Button
                        variant="contained"
                        endIcon={rootStore.isPrintStep ? <Check /> : <ChevronRight />}
                        onClick={() => {
                          // if (rootStore.isConsentSign){
                            rootStore.nextStep()
                          // }else {
                            // setConsentSign(true);
                            // rootStore.loadPersonalDataAgreementText();
                          // }
                        }}
                        disabled={!rootStore.canNavigateNext}
                        color={rootStore.isPrintStep ? "success" : "primary"}
                        fullWidth={isMobile}
                      >
                        {t('common:next')}
                      </Button>
                    }
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
      </Container>

      <Dialog open={consentSign} onClose={handleCloseConsentSign} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Security color="primary" />
            {rootStore.personalDataAgreementText[`name_${currentLang}`] || ''}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Ckeditor
            onChange={() => { }}
            value={rootStore.personalDataAgreementText[`content_${currentLang}`] || ''}
            withoutPlaceholder
            // disabled={true}
            name="personalDataAgreementText"
            id="personalDataAgreementText"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsentSign}>
            {rootStore.isConsentSign ? t('common:close') : t('common:cancel')}
          </Button>
          {!rootStore.isConsentSign && (
            <Button
              onClick={handleSignDocuments}
              variant="contained"
              autoFocus
            >
              {t('common:sign.Sign')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default App;