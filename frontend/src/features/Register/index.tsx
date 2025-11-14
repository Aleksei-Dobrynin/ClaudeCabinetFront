import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Alert, Checkbox, FormLabel, RadioGroup, Radio
} from "@mui/material";
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MaskedTextField from 'components/MaskedTextField';
import MainStore from 'MainStore';
import companyRegistrationStore from './store';
import RegistrationSuccess from './success';
import LookUp from 'components/LookUp';
import LanguageSectionImport from "layouts/MainLayout/Header/LanguageSection";

// Icons
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormControlLabel from "@mui/material/FormControlLabel";
import i18n from "i18next";
import Ckeditor from "../../components/ckeditor/ckeditor";
import { rootStore } from "../Application/NewStepper/stores/RootStore";

const LanguageSection = LanguageSectionImport as unknown as React.FC<{ style?: React.CSSProperties }>;

// Separate component for INN input to prevent re-renders
const InnInputForm = observer(({ 
  registrationTypes, 
  onCheckInn, 
  onCancel 
}: {
  registrationTypes: any[];
  onCheckInn: () => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const translate = t;
  const langRaw = i18n.language.split('-')[0];
  const currentLang = langRaw === 'ky' ? 'kg' : langRaw;
  
  // Local state for registration type to prevent LookUp from re-rendering
  const [localRegType, setLocalRegType] = useState(companyRegistrationStore.id_registration_type);

  // Memoized handlers to prevent re-renders
  const handleRegistrationTypeChange = useCallback((e: any) => {
    const newValue = e.target.value;
    setLocalRegType(newValue);
    companyRegistrationStore.handleChange(e);
    companyRegistrationStore.code_registration_type = registrationTypes.find(x => x.id === Number(newValue))?.code;
  }, [registrationTypes]);

  const handleInnChange = useCallback((e: any) => {
    const innValue = e.target.value;
    
    // Only detect and update type if INN has meaningful length
    if (innValue.length >= 1) {
      const detectedType = companyRegistrationStore.detectInnType(innValue);
      const newRegTypeId = registrationTypes.find(x => x.code === detectedType)?.id;
      
      // Only update if type actually changed
      if (newRegTypeId && newRegTypeId !== localRegType) {
        setLocalRegType(newRegTypeId);
        companyRegistrationStore.id_registration_type = newRegTypeId;
        companyRegistrationStore.code_registration_type = detectedType;
      }
    }
    
    companyRegistrationStore.handleChange(e);
  }, [registrationTypes, localRegType]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          {translate("label:registration.agreementTitle")}
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            padding: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            mb: 2
          }}
        >
            <Ckeditor
              onChange={() => { }}
              value={ currentLang == 'ru'
                ? companyRegistrationStore.personalDataAgreementRu
                : companyRegistrationStore.personalDataAgreementKg}
              withoutPlaceholder
              disabled={true}
              name="personalDataAgreementText"
              id="personalDataAgreementText"
            />
        </Paper>


        <FormControlLabel
          control={
            <Checkbox
              checked={companyRegistrationStore.isAgreementAccepted}
              onChange={(e) => companyRegistrationStore.toggleAgreement(e.target.checked)}
              color="primary"
            />
          }
          label={t("label:registration.iAgreeToTerms")}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  onClick={() => companyRegistrationStore.toggleAgreement(true)}*/}
          {/*>*/}
          {/*  {translate("label:registration.continue")}*/}
          {/*</Button>*/}
        </Box>
      </Box>
      <br/>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <LookUp
          id="id_registration_type"
          name="id_registration_type"
          label={translate('label:registration.registrationType')}
          value={localRegType}
          onChange={handleRegistrationTypeChange}
          data={registrationTypes}
          required
          error={false}
          // Disable Chrome autocomplete
          // autoComplete="off"
          // inputProps={{ 
          //   autoComplete: 'new-password',
          //   'data-form-type': 'other'
          // }}
        />
      </Box>
      <Typography variant="h6" gutterBottom>
        {
          registrationTypes.find(x => x.id === Number(localRegType))?.code === 'company'
            ? translate('label:registration.companyEnterInnTitle')
            : translate('label:registration.personEnterInnTitle')
        }
      </Typography>
      <Typography variant="body1" gutterBottom>
        {
          registrationTypes.find(x => x.id === Number(localRegType))?.code === 'company'
            ? translate('label:registration.companyEnterInnDescription')
            : translate('label:registration.personEnterInnDescription')
        }
      </Typography>
      <MaskedTextField
        mask="00000000000000"
        label={translate('label:registration.inn')}
        value={companyRegistrationStore.inn}
        onChange={handleInnChange}
        id='id_company_inn'
        name='inn'
        error={!!companyRegistrationStore.innError}
        helperText={companyRegistrationStore.innError}
        // Disable Chrome autocomplete
        // autoComplete="off"
        inputProps={{ 
          autoComplete: 'new-password',
          'data-form-type': 'other',
          'data-lpignore': 'true'
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          {translate('common:cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onCheckInn}
          disabled={MainStore.loader || !companyRegistrationStore.isAgreementAccepted }
          startIcon={MainStore.loader ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {translate('common:next')}
        </Button>
      </Box>
    </Box>
  );
});

// Separate component for company details form
const CompanyDetailsForm = observer(({ 
  registrationTypes,
  onRegister,
  onBack,
  formatFileSize
}: {
  registrationTypes: any[];
  onRegister: () => void;
  onBack: () => void;
  formatFileSize: (size: number) => string;
}) => {
  const { t } = useTranslation();
  const translate = t;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized handlers
  const handleCompanyNameChange = useCallback((e: any) => {
    companyRegistrationStore.handleChange(e);
  }, []);

  const handleEmailChange = useCallback((e: any) => {
    companyRegistrationStore.handleChange(e);
  }, []);

  const handleFileInputClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    companyRegistrationStore.addFiles(event.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {translate('label:registration.additionalInfoTitle')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {translate('label:registration.additionalInfoDescription')}
      </Typography>

      {companyRegistrationStore.companyInfo && (
        <Paper variant="outlined" sx={{ p: 2, mt: 3, mb: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
          <Typography variant="subtitle1" gutterBottom>
            {registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company'
              ? translate('label:registration.companyInfoFromTunduk')
              : translate('label:registration.personInfoFromTunduk')}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {translate('label:registration.inn')}:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                {companyRegistrationStore.inn}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company'
                  ? translate('label:registration.companyName')
                  : translate('label:registration.fullName')}:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                {companyRegistrationStore.companyInfo.companyName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company'
                  ? translate('label:registration.legalAddress')
                  : translate('label:registration.residentialAddress')}:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                {companyRegistrationStore.companyInfo.legalAddress}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company'
                  ? translate('label:registration.registrationDate')
                  : translate('label:registration.birthDate')}:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">
                {companyRegistrationStore.companyInfo.registrationDate}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company' ? (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={translate('label:registration.companyName')}
              value={companyRegistrationStore.companyName}
              onChange={handleCompanyNameChange}
              error={!!companyRegistrationStore.companyNameError}
              helperText={companyRegistrationStore.companyNameError}
              id='id_company_name'
              name='companyName'
              // Disable Chrome autocomplete
              autoComplete="off"
              inputProps={{ 
                autoComplete: 'new-password',
                'data-form-type': 'other',
                'data-lpignore': 'true'
              }}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={translate('label:registration.lastName')}
                value={companyRegistrationStore.lastName}
                onChange={handleCompanyNameChange}
                error={!!companyRegistrationStore.lastNameError}
                helperText={companyRegistrationStore.lastNameError}
                id='id_last_name'
                name='lastName'
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={translate('label:registration.firstName')}
                value={companyRegistrationStore.firstName}
                onChange={handleCompanyNameChange}
                error={!!companyRegistrationStore.firstNameError}
                helperText={companyRegistrationStore.firstNameError}
                id='id_first_name'
                name='firstName'
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={translate('label:registration.secondName')}
                value={companyRegistrationStore.secondName}
                onChange={handleCompanyNameChange}
                error={!!companyRegistrationStore.secondNameError}
                helperText={companyRegistrationStore.secondNameError}
                id='id_second_name'
                name='secondName'
                autoComplete="off"
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={translate('label:registration.email')}
            value={companyRegistrationStore.email}
            onChange={handleEmailChange}
            error={!!companyRegistrationStore.emailError}
            helperText={companyRegistrationStore.emailError}
            id='id_company_email'
            name='email'
            type='email'
            // Properly disable Chrome autocomplete for email
            autoComplete="new-password"
            inputProps={{ 
              autoComplete: 'new-password',
              'data-form-type': 'other',
              'data-lpignore': 'true'
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={translate('label:registration.phone')}
            value={companyRegistrationStore.formatPhone(companyRegistrationStore.phone)}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12); // максимум 12 цифр (996 + 9)
              companyRegistrationStore.handleChange({
                ...e,
                target: { ...e.target, value: digitsOnly, name: 'phone' }
              });
            }}
            error={!!companyRegistrationStore.phoneError}
            helperText={companyRegistrationStore.phoneError}
            id='id_company_phone'
            name='phone'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">
            {translate('label:registration.selectAuthType')}
          </FormLabel>
          <RadioGroup
            row
            name="authMethod"
            value={companyRegistrationStore.authMethod}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'sms' || value === 'email') {
                companyRegistrationStore.setAuthMethod(value);
              }
            }}
          >
            <FormControlLabel value="email" control={<Radio />} label="Email" />
            <FormControlLabel value="sms" control={<Radio />} label="SMS" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
            {translate('label:registration.responsibilityWarning')}
          </Typography>
        </Grid>
        {/* File Upload Section - commented out as in original */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          {/* Hidden file input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={MainStore.loader}
        >
          {translate('common:back')}
        </Button>
        <Button
          variant="contained"
          onClick={onRegister}
          disabled={MainStore.loader}
          startIcon={MainStore.loader ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {translate('label:registration.register')}
        </Button>
      </Box>
    </Box>
  );
});

const CompanyRegistration = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [innChecked, setInnChecked] = useState(false);
  
  const registrationTypes = [
    { id: 1, code: 'company', name: translate('label:registration.company') },
    { id: 2, code: 'person', name: translate('label:registration.person') }
  ];

  useEffect(() => {
    companyRegistrationStore.clearStore();
    companyRegistrationStore.getAgreementText();
    // Set a unique form identifier to prevent cross-form autocomplete
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.setAttribute('autocomplete', 'off');
      formElement.setAttribute('data-form-identifier', 'company-registration-form');
    }
  }, []);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCheckInn = useCallback(async () => {
    if (!companyRegistrationStore.validateInn()) return;

    const innExists = await companyRegistrationStore.checkInnExistsBack();
    if (innExists) return;

    const infoFetched = await companyRegistrationStore.fetchCompanyInfoFromTunduk();
    if (!infoFetched) return;

    setInnChecked(true);
  }, []);

  const handleRegister = useCallback(async () => {
    let hasError = false;
    // Проверяем email перед открытием диалога
    if (!companyRegistrationStore.email || !companyRegistrationStore.validateEmail()) {
      companyRegistrationStore.emailError = translate('label:registration.emailRequired');
      hasError = true;
    } else {
      companyRegistrationStore.emailError = '';
    }

    if (!companyRegistrationStore.authMethod) {
      companyRegistrationStore.showErrorSnackbar(translate('label:registration.authTypeRequired'));
      hasError = true;
    }

    if (
      companyRegistrationStore.authMethod === 'sms' &&
      !companyRegistrationStore.phone.match(/^996\d{9}$/)
    ) {
      companyRegistrationStore.phoneError = translate('label:registration.invalidPhone');
      hasError = true;
    } else {
      companyRegistrationStore.phoneError = '';
    }

    if (hasError) {
      companyRegistrationStore.showErrorSnackbar(translate('label:registration.fixErrors'));
      return;
    }

    companyRegistrationStore.confirmDigitalSignature(async () => {
      const success = await companyRegistrationStore.registerCompany();
      if (success) {
        setRegistrationSuccess(true);
      }
    });
  }, [translate]);

  const handleBack = useCallback(() => {
    setInnChecked(false);
    companyRegistrationStore.clearErrors();
  }, []);

  const handleCancel = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const formatFileSize = useCallback((size: number): string => {
    if (size < 1024) return size + ' B';
    else if (size < 1048576) return (size / 1024).toFixed(1) + ' KB';
    else return (size / 1048576).toFixed(1) + ' MB';
  }, []);

  if (registrationSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form autoComplete="off" noValidate>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ flex: 1 }}
            >
            {
              registrationTypes.find(x => x.id === Number(companyRegistrationStore.id_registration_type))?.code === 'company'
                ? translate('label:registration.companyRegistration')
                : translate('label:registration.personRegistration')
            }
          </Typography>
            <Box sx={{ marginLeft: 'auto', zIndex: 10 }}>
              <LanguageSection style={{ marginLeft: '0px' }} />
            </Box>
          </Box>
          {!innChecked ? (
            <InnInputForm 
              registrationTypes={registrationTypes}
              onCheckInn={handleCheckInn}
              onCancel={handleCancel}
            />
          ) : (
            <CompanyDetailsForm 
              registrationTypes={registrationTypes}
              onRegister={handleRegister}
              onBack={handleBack}
              formatFileSize={formatFileSize}
            />
          )}
        </form>
      </Paper>
    </Container>
  );
});

export default CompanyRegistration;