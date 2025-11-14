// src/components/Application/tabs/ContractTab.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore, useUIStore, useErrorStore } from '../../stores/StoreContext';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Alert, 
  AlertTitle,
  CircularProgress,
  Link,
  Grid,
  Divider,
  Fade,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme
} from '@mui/material';
import { 
  DescriptionOutlined as DocumentIcon,
  CloudDownload as DownloadIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export const ContractTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();
  
  const application = applicationStore.application;
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  if (!application) return null;

  const handleSignContract = async () => {
    if (!application.contract) return;
    setConfirmDialogOpen(false);
    
    // await applicationStore.signContract(application.contract.id);
  };

  if (!application.contract) {
    return (
      <Box 
        sx={{ 
          py: 8, 
          px: 3, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            bgcolor: 'grey.100', 
            borderRadius: '50%', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <DocumentIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        </Box>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          fontWeight="medium"
        >
          {t('label:ApplicationAddEdit.contract.notGenerated')}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          {t('label:ApplicationAddEdit.contract.notGeneratedDescription')}
        </Typography>
      </Box>
    );
  }

  const createdDate = new Date(application.contract.createdDate).toLocaleDateString('ru-RU');
  const signedDate = application.contract.signedDate 
    ? new Date(application.contract.signedDate).toLocaleDateString('ru-RU') 
    : null;

  return (
    <Box>
      <Typography 
        variant="h6" 
        component="h2"
        sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
      >
        <DocumentIcon sx={{ mr: 1 }} />
        {t('label:ApplicationAddEdit.contract.title')}
      </Typography>
      
      {errorStore.hasError('signContract') && (
        <Alert 
          severity="error" 
          onClose={() => errorStore.clearError('signContract')} 
          sx={{ mb: 3 }}
        >
          {errorStore.getError('signContract')}
        </Alert>
      )}
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box>
              <Typography 
                variant="h6" 
                component="div"
                sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
              >
                {t('label:ApplicationAddEdit.contract.contractNumber', { number: application.contract.number })}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  component="div"
                  sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                >
                  <Box component="span" sx={{ mr: 1, fontWeight: 'medium' }}>
                    {t('label:ApplicationAddEdit.contract.created')}:
                  </Box> 
                  {createdDate}
                </Typography>
                
                {signedDate && (
                  <Typography 
                    variant="body2" 
                    color="success.main"
                    component="div"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Box component="span" sx={{ mr: 1, fontWeight: 'medium' }}>
                      {t('label:ApplicationAddEdit.contract.signed')}:
                    </Box> 
                    {signedDate}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {t('label:ApplicationAddEdit.contract.description')}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                justifyContent: { xs: 'flex-start', md: 'flex-end' } 
              }}
            >
              <Tooltip title={t('label:ApplicationAddEdit.contract.downloadForReview')}>
                <Button
                  component={Link}
                  href={application.contract.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  aria-label={t('label:ApplicationAddEdit.contract.downloadContract')}
                >
                  {t('label:ApplicationAddEdit.contract.download')}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Fade in={true} timeout={500}>
        <Box>
          {application.contract.signed ? (
            <Alert 
              severity="success"
              variant="outlined"
              icon={<CheckCircleIcon fontSize="inherit" />}
              sx={{ mb: 3 }}
            >
              <AlertTitle>{t('label:ApplicationAddEdit.contract.successfullySigned')}</AlertTitle>
              <Typography variant="body2">
                {t('label:ApplicationAddEdit.contract.successfullySignedDescription')}
              </Typography>
              {application.status_code === 'signing' && (
                <Button
                  size="small"
                  color="success"
                  onClick={() => uiStore.setActiveTab('payment')}
                  sx={{ mt: 1 }}
                >
                  {t('label:ApplicationAddEdit.contract.proceedToPayment')}
                </Button>
              )}
            </Alert>
          ) : (
            <Alert 
              severity="warning"
              variant="outlined"
              icon={<WarningIcon fontSize="inherit" />}
              sx={{ mb: 3 }}
            >
              <AlertTitle>{t('label:ApplicationAddEdit.contract.signRequired')}</AlertTitle>
              <Typography variant="body2">
                {t('label:ApplicationAddEdit.contract.signRequiredDescription')}
              </Typography>
            </Alert>
          )}
        </Box>
      </Fade>
      
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="sign-contract-dialog-title"
        aria-describedby="sign-contract-dialog-description"
      >
        <DialogTitle id="sign-contract-dialog-title">
          {t('label:ApplicationAddEdit.contract.confirmSignDialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="sign-contract-dialog-description">
            {t('label:ApplicationAddEdit.contract.confirmSignDialog.description', { number: application.contract.number })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="inherit"
          >
            {t('label:ApplicationAddEdit.common.cancel')}
          </Button>
          <Button 
            onClick={handleSignContract} 
            color="primary"
            variant="contained"
            autoFocus
          >
            {t('label:ApplicationAddEdit.contract.confirmSign')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});