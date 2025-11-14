// components/steps/ParticipantsStep.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person,
  Business,
  Search,
  Close,
  AccountCircle,
  AssignmentInd,
  Phone,
  Email,
  LocationOn,
  Badge
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';
import CustomCheckbox from "../../../../../components/Checkbox";
import dayjs from "dayjs";
import DateField from "components/DateField";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ParticipantsStep: React.FC = observer(() => {
  const { participantsStore } = rootStore;
  const { t } = useTranslation();
  const [tabValue, setTabValue] = React.useState(0);
  
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');

    let local = digits.startsWith('996') ? digits.slice(3) : digits;

    local = local.slice(0, 9);

    let formatted = '';
    if (local.length > 0) formatted += local.slice(0, 3);             
    if (local.length > 3) formatted += '-' + local.slice(3, 5);       
    if (local.length > 5) formatted += '-' + local.slice(5, 7);       
    if (local.length > 7) formatted += '-' + local.slice(7);          

    return `+996 ${formatted}`.trim();
  };
  
  const handleRoleSelect = (role: 'customer' | 'applicant') => {
    participantsStore.setSelectedRole(role);
  };
  
  const handleCustomerTypeChange = (event: React.MouseEvent<HTMLElement>, newType: boolean | null) => {
    if (newType !== null) {
      participantsStore.setCustomerType(newType);
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        {t('label:steps.participants.title')}
      </Typography>
      
      <Dialog 
        open={participantsStore.showRoleDialog} 
        maxWidth="sm" 
        fullWidth
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('label:steps.participants.selectRole')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('label:steps.participants.selectRoleDescription')}
          </Typography>
          
          <RadioGroup value={participantsStore.selectedRole} onChange={(e) => handleRoleSelect(e.target.value as 'customer' | 'applicant')}>
            <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleRoleSelect('customer')}>
              <CardContent>
                <FormControlLabel
                  value="customer"
                  control={<Radio />}
                  label={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccountCircle color="primary" />
                        <Typography variant="subtitle1">{t('label:steps.participants.imCustomer')}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.participants.imCustomerDescription')}
                      </Typography>
                    </Box>
                  }
                />
              </CardContent>
            </Card>
            
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleRoleSelect('applicant')}>
              <CardContent>
                <FormControlLabel
                  value="applicant"
                  control={<Radio />}
                  label={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <AssignmentInd color="secondary" />
                        <Typography variant="subtitle1">{t('label:steps.participants.imApplicant')}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.participants.imApplicantDescription')}
                      </Typography>
                    </Box>
                  }
                />
              </CardContent>
            </Card>
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            onClick={() => {
              participantsStore.onClickRole()
            }}
            disabled={!participantsStore.selectedRole}
          >
            {t('common:next')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {!participantsStore.showRoleDialog && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              {t('label:steps.participants.customerType')}
            </Typography>
            
            <ToggleButtonGroup
              value={participantsStore.customerData.isPhysical}
              exclusive
              onChange={handleCustomerTypeChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value={true}>
                <Person sx={{ mr: 1 }} />
                {t('label:steps.participants.individual')}
              </ToggleButton>
              <ToggleButton value={false}>
                <Business sx={{ mr: 1 }} />
                {t('label:steps.participants.legal')}
              </ToggleButton>
            </ToggleButtonGroup>
            
            {participantsStore.selectedRole === 'applicant' && (
              <Alert severity="info">
                {t('label:steps.participants.applicantInfo')}
              </Alert>
            )}
          </Paper>
          
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={participantsStore.customerData.isPhysical ? t('label:steps.participants.pin') : t('label:steps.participants.innOkpo')}
                    required
                    value={participantsStore.customerData.pin}
                    onChange={async (e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (!participantsStore.customerData.isForeign) {
                        value = value.slice(0, 14);
                      }
                      participantsStore.updateCustomerData('pin', value);
                      await participantsStore.validate();
                    }}
                    error={!!participantsStore.errors.pin}
                    helperText={participantsStore.errors.pin || (participantsStore.customerData.isPhysical ? t('label:steps.participants.pinHelperText') : t('label:steps.participants.innOkpoHelperText'))}
                    placeholder={participantsStore.customerData.isPhysical ? "11705200000473" : "00000000000000"}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <CustomCheckbox
                    value={participantsStore.customerData.isForeign}
                    onChange={(e) => {
                      const value = e.target.value
                      participantsStore.updateCustomerData('isForeign', value);
                    }}
                    name="isForeign"
                    label={ participantsStore.customerData.isPhysical ? t("label:CustomerAddEditView.is_foreign_citezen"): t("label:CustomerAddEditView.is_foreign_company") }
                    id="id_f_isForeign"
                  />
                </Grid>
                {!participantsStore.customerData.isPhysical && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('label:steps.participants.okpo')}
                      value={participantsStore.customerData.okpo || ''}
                      onChange={(e) => participantsStore.updateCustomerData('okpo', e.target.value)}
                      helperText={t('label:steps.participants.okpoHelperText')}
                    />
                  </Grid>
                )}

                {!participantsStore.customerData.isPhysical && <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={participantsStore.customerData.isPhysical ? t('label:steps.participants.fullName') : t('label:steps.participants.organizationName')}
                    required
                    value={participantsStore.customerData.name}
                    onChange={(e) => participantsStore.updateCustomerData('name', e.target.value)}
                    error={!!participantsStore.errors.name}
                    helperText={participantsStore.errors.name}
                    placeholder={participantsStore.customerData.isPhysical ? t('label:steps.participants.fullNamePlaceholder') : t('label:steps.participants.organizationNamePlaceholder')}
                  />
                </Grid>}
                {participantsStore.customerData.isPhysical && (
                  <>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.lastName')}
                        required
                        InputLabelProps={{ shrink: true }}
                        value={participantsStore.customerData.lastName}
                        onChange={(e) => participantsStore.updateCustomerData('lastName', e.target.value)}
                        error={!!participantsStore.errors.name}
                        helperText={participantsStore.errors.name}
                        placeholder={t('label:steps.participants.lastNamePlaceholder')}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.firstName')}
                        required
                        InputLabelProps={{ shrink: true }}
                        value={participantsStore.customerData.firstName}
                        onChange={(e) => participantsStore.updateCustomerData('firstName', e.target.value)}
                        error={!!participantsStore.errors.name}
                        helperText={participantsStore.errors.name}
                        placeholder={t('label:steps.participants.firstNamePlaceholder')}
                      />
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.secondName')}
                        required
                        InputLabelProps={{ shrink: true }}
                        value={participantsStore.customerData.secondName}
                        onChange={(e) => participantsStore.updateCustomerData('secondName', e.target.value)}
                        error={!!participantsStore.errors.name}
                        helperText={participantsStore.errors.name}
                        placeholder={t('label:steps.participants.secondNamePlaceholder')}
                      />
                    </Grid>
                  </>
                )}
                
                {!participantsStore.customerData.isPhysical && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('label:steps.participants.directorName')}
                      required
                      value={participantsStore.customerData.director}
                      onChange={(e) => participantsStore.updateCustomerData('director', e.target.value)}
                      error={!!participantsStore.errors.director}
                      helperText={participantsStore.errors.director}
                      placeholder={t('label:steps.participants.directorNamePlaceholder')}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('label:steps.participants.phone')}
                    required
                    value={participantsStore.customerData.phone1}
                    onChange={async (e) => {
                      const formatted = formatPhone(e.target.value);
                      participantsStore.updateCustomerData('phone1', formatted);
                      await participantsStore.validate();
                    }}
                    error={!!participantsStore.errors.phone1}
                    helperText={participantsStore.errors.phone1 || t('label:steps.participants.phoneFormat')}
                    placeholder={t('label:steps.participants.phonePlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('label:steps.participants.additionalPhone')}
                    value={participantsStore.customerData.phone2 || ''}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      participantsStore.updateCustomerData('phone2', formatted);
                    }}
                    placeholder={t('label:steps.participants.phonePlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('label:steps.participants.email')}
                    required
                    type="email"
                    value={participantsStore.customerData.email}
                    onChange={(e) => participantsStore.updateCustomerData('email', e.target.value)}
                    error={!!participantsStore.errors.email}
                    helperText={participantsStore.errors.email}
                    placeholder={t('label:steps.participants.emailPlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('label:steps.participants.address')}
                    required
                    value={participantsStore.customerData.address}
                    onChange={(e) => participantsStore.updateCustomerData('address', e.target.value)}
                    error={!!participantsStore.errors.address}
                    helperText={participantsStore.errors.address}
                    placeholder={t('label:steps.participants.addressPlaceholder')}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('label:steps.participants.postalCode')}
                    value={participantsStore.customerData.postalCode}
                    onChange={(e) => participantsStore.updateCustomerData('postalCode', e.target.value)}
                    placeholder={t('label:steps.participants.postalCodePlaceholder')}
                  />
                </Grid>
                
                {participantsStore.customerData.isPhysical && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.passportSeries')}
                        value={participantsStore.customerData.passport_series || ''}
                        onChange={(e) => participantsStore.updateCustomerData('passport_series', e.target.value)}
                        placeholder={t('label:steps.participants.passportSeriesPlaceholder')}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <DateField
                        label={t('label:steps.participants.passportIssueDate')}
                        value={participantsStore.customerData.passport_issued_date}
                        onChange={(e) => participantsStore.updateCustomerData('passport_issued_date', e.target.value)}
                        name="passportIssueDate"
                        id="passportIssueDate"
                        helperText=""
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.passportIssuer')}
                        value={participantsStore.customerData.passport_whom_issued || ''}
                        onChange={(e) => participantsStore.updateCustomerData('passport_whom_issued', e.target.value)}
                        placeholder={t('label:steps.participants.passportIssuerPlaceholder')}
                      />
                    </Grid>
                  </>
                )}
                
                {!participantsStore.customerData.isPhysical && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.paymentAccount')}
                        value={participantsStore.customerData.payment_account || ''}
                        onChange={(e) => participantsStore.updateCustomerData('payment_account', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.bank')}
                        value={participantsStore.customerData.bank || ''}
                        onChange={(e) => participantsStore.updateCustomerData('bank', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('label:steps.participants.bik')}
                        value={participantsStore.customerData.bik || ''}
                        onChange={(e) => participantsStore.updateCustomerData('bik', e.target.value)}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              
              {participantsStore.searchError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {participantsStore.searchError}
                </Alert>
              )}
            </Box>
        </>
      )}
    </Box>
  );
});

export default ParticipantsStep;