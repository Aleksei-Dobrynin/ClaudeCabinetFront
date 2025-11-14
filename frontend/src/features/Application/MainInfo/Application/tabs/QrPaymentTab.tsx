// src/components/Application/tabs/QrPaymentTab.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore, useUIStore } from '../../stores/StoreContext';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Skeleton,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Phone as PhoneIcon,
  HelpOutline as HelpIcon
} from '@mui/icons-material';
import QRCode from 'qrcode';
import { GenerateQr } from 'api/MainBackAPI';

interface PaymentAmount {
  total_payed: number;
  total_sum: number;
}

export const QrPaymentTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();

  const [paymentAmount, setPaymentAmount] = useState<PaymentAmount | null>(null);
  const [isLoadingAmount, setIsLoadingAmount] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [qrAmount, setQrAmount] = useState<number>(0);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [manualAmount, setManualAmount] = useState<string>('');
  const [showManualPayment, setShowManualPayment] = useState(false);

  const application = applicationStore.application;

  useEffect(() => {
    if (application) {
      // Check if data already exists in store
      if (applicationStore.paymentAmount && !paymentAmount) {
        // Use existing data only if local state is empty
        setPaymentAmount(applicationStore.paymentAmount);
        setIsLoadingAmount(false);
      } else if (!applicationStore.paymentAmount && !paymentAmount) {
        // Fetch only if both store and local state are empty
        fetchPaymentAmount();
      }
    }
  }, [application]);

  const fetchPaymentAmount = async () => {
    // Clear current data before fetching
    setPaymentAmount(null);
    setIsLoadingAmount(true);
    
    try {
      // Force fetch new data from API
      await applicationStore.fetchPaymentAmount();
      
      if (applicationStore.paymentAmount) {
        setPaymentAmount(applicationStore.paymentAmount);
      }
    } catch (error) {
      console.error('Error fetching payment amount:', error);
      uiStore.showSnackbar(t('label:qrPayment.errors.fetchAmount'), 'error');
    } finally {
      setIsLoadingAmount(false);
    }
  };

  const generateQrCode = async () => {
    if (!paymentAmount || !application || paymentAmount.total_payed >= paymentAmount.total_sum) return;

    setIsGeneratingQr(true);
    try {
      const remainingAmount = paymentAmount.total_sum - paymentAmount.total_payed;
      
      // Call backend API to generate QR link
      const response = await GenerateQr(application.id, remainingAmount);
      
      if (response?.data) {
        const link = response.data; // Backend returns the final QR link
        setPaymentLink(link);
        setQrAmount(remainingAmount);

        // Generate QR code image from the link
        const qrDataUrl = await QRCode.toDataURL(link, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrDataUrl);
        uiStore.showSnackbar(t('label:qrPayment.qrGenerated'), 'success');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      uiStore.showSnackbar(t('label:qrPayment.errors.generateQr'), 'error');
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      uiStore.showSnackbar(t('label:qrPayment.linkCopied'), 'success');
    }
  };

  const handleDownloadQr = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `payment-qr-${application?.number || 'unknown'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleManualPayment = async () => {
    if (!application) return;
    
    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      uiStore.showSnackbar(t('label:qrPayment.errors.invalidAmount'), 'error');
      return;
    }

    setIsGeneratingQr(true);
    try {
      // Call backend API to generate QR link
      const response = await GenerateQr(application.id, amount);
      
      if (response?.data) {
        const link = response.data; // Backend returns the final QR link
        setPaymentLink(link);
        setQrAmount(amount);

        // Generate QR code image from the link
        const qrDataUrl = await QRCode.toDataURL(link, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrDataUrl);
        setShowManualPayment(false);
        setManualAmount('');
        uiStore.showSnackbar(t('label:qrPayment.qrGeneratedManual'), 'success');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      uiStore.showSnackbar(t('label:qrPayment.errors.generateQr'), 'error');
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleResetQr = () => {
    setQrCodeUrl('');
    setPaymentLink('');
    setQrAmount(0);
  };

  if (!application) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount).replace('KGS', 'сом');
  };

  const remainingAmount = paymentAmount 
    ? paymentAmount.total_sum - paymentAmount.total_payed 
    : 0;

  const paymentProgress = paymentAmount 
    ? (paymentAmount.total_payed / paymentAmount.total_sum) * 100 
    : 0;

  const isFullyPaid = paymentAmount && paymentAmount.total_payed >= paymentAmount.total_sum && paymentAmount.total_payed > 0;

  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
      >
        <QrCodeIcon sx={{ mr: 1 }} />
        {t('label:qrPayment.title')}
      </Typography>

      {/* Payment Summary */}
      {isLoadingAmount ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Box>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
          </Box>
        </Paper>
      ) : paymentAmount ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isFullyPaid ? 'success.50' : 'background.paper'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('label:qrPayment.totalAmount')}
              </Typography>
              <Typography variant="h5" fontWeight="medium">
                {formatAmount(paymentAmount.total_sum)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('label:qrPayment.paidAmount')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="medium"
                color="success.main"
              >
                {formatAmount(paymentAmount.total_payed)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                {t('label:qrPayment.remainingAmount')}
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight="medium"
                color={isFullyPaid ? 'success.main' : 'error.main'}
              >
                {formatAmount(remainingAmount)}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('label:qrPayment.paymentProgress')}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {Math.round(paymentProgress)}%
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 8, bgcolor: 'grey.200', borderRadius: 4 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${paymentProgress}%`,
                  bgcolor: isFullyPaid ? 'success.main' : 'primary.main',
                  borderRadius: 4,
                  transition: 'width 0.3s ease'
                }}
              />
            </Box>
          </Box>

          {isFullyPaid && (
            <Alert 
              severity="success" 
              sx={{ mt: 2 }}
              icon={<CheckCircleIcon />}
            >
              {t('label:qrPayment.fullyPaid')}
            </Alert>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchPaymentAmount}
              disabled={isLoadingAmount}
            >
              {t('label:qrPayment.refresh')}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper'
          }}
        >
          <Alert severity="error">
            {t('label:qrPayment.errors.noPaymentData')}
          </Alert>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={fetchPaymentAmount}
              disabled={isLoadingAmount}
            >
              {t('label:qrPayment.refresh')}
            </Button>
          </Box>
        </Paper>
      )}

      {/* QR Code Generation */}
      {!isFullyPaid && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('label:qrPayment.generateQr')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('label:qrPayment.generateQrDescription')}
                </Typography>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={isGeneratingQr ? <CircularProgress size={20} color="inherit" /> : <QrCodeIcon />}
                    onClick={generateQrCode}
                    disabled={isGeneratingQr || !paymentAmount || remainingAmount <= 0 || qrCodeUrl !== ''}
                  >
                    {t('label:qrPayment.payFullAmount')}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setShowManualPayment(true)}
                    disabled={qrCodeUrl !== ''}
                  >
                    {t('label:qrPayment.enterManualAmount')}
                  </Button>

                  {qrCodeUrl && (
                    <Button
                      variant="text"
                      color="error"
                      fullWidth
                      onClick={handleResetQr}
                    >
                      {t('label:qrPayment.resetAndCreateNew')}
                    </Button>
                  )}

                  <Button
                    variant="text"
                    size="small"
                    startIcon={<HelpIcon />}
                    onClick={() => setShowInstructions(true)}
                  >
                    {t('label:qrPayment.howToPay')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {qrCodeUrl ? (
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {t('label:qrPayment.scanToPay')}
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {t('label:qrPayment.qrAmountInfo', { amount: formatAmount(qrAmount) })}
                    </Typography>
                  </Alert>
                  
                  <Box sx={{ my: 3 }}>
                    <img 
                      src={qrCodeUrl} 
                      alt="Payment QR Code" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      value={paymentLink}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleCopyLink} edge="end">
                              <CopyIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadQr}
                      >
                        {t('label:qrPayment.downloadQr')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<RefreshIcon />}
                        onClick={handleResetQr}
                      >
                        {t('label:qrPayment.createNewQr')}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: `2px dashed ${theme.palette.divider}`,
                  bgcolor: 'grey.50',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <QrCodeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  {t('label:qrPayment.noQrGenerated')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('label:qrPayment.clickToGenerate')}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* Instructions Dialog */}
      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('label:qrPayment.instructions.title')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2">
              {t('label:qrPayment.instructions.step1')}
            </Typography>
            <Typography variant="body2">
              {t('label:qrPayment.instructions.step2')}
            </Typography>
            <Typography variant="body2">
              {t('label:qrPayment.instructions.step3')}
            </Typography>
            <Typography variant="body2">
              {t('label:qrPayment.instructions.step4')}
            </Typography>
            <Alert severity="warning">
              {t('label:qrPayment.instructions.warning')}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Payment Dialog */}
      <Dialog
        open={showManualPayment}
        onClose={() => setShowManualPayment(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('label:qrPayment.manualPayment.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('label:qrPayment.manualPayment.description')}
          </Typography>
          <TextField
            fullWidth
            label={t('label:qrPayment.manualPayment.amount')}
            type="number"
            value={manualAmount}
            onChange={(e) => setManualAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">сом</InputAdornment>,
            }}
            helperText={t('label:qrPayment.manualPayment.helper')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowManualPayment(false)}>
            {t('common:cancel')}
          </Button>
          <Button 
            onClick={handleManualPayment}
            variant="contained"
            disabled={!manualAmount || parseFloat(manualAmount) <= 0 || isGeneratingQr}
          >
            {t('label:qrPayment.generateQr')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});