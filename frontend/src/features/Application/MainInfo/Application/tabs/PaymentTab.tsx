// src/components/Application/tabs/PaymentTab.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore } from '../../stores/StoreContext';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Chip
} from '@mui/material';
import { 
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

interface Payment {
  id: number;
  date: string;
  payment_identifier: string;
  sum: number;
  bank_identifier: string;
  application_id: number;
  tax: number | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  mbank: string | null;
  number: string | null;
}

export const PaymentTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  
  const [paymentInfoDialogOpen, setPaymentInfoDialogOpen] = useState(false);
  
  const payments: Payment[] = applicationStore.payments || [];

  const formatDateTime = (dateString: string) => {
    try {
      dayjs.locale('ru');
      return dayjs(dateString).format('DD.MM.YYYY HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount).replace('KGS', t('label:ApplicationAddEdit.payment.currency'));
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ReceiptIcon sx={{ mr: 1 }} />
          {t('label:ApplicationAddEdit.payment.title')}
        </Typography>
      </Stack>
      
      {payments.length > 0 ? (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 'medium' }}>{t('label:ApplicationAddEdit.payment.columns.dateTime')}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{t('label:ApplicationAddEdit.payment.columns.amount')}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{t('label:ApplicationAddEdit.payment.columns.paymentId')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow 
                  key={payment.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(payment.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={formatAmount(payment.sum)}
                      color="success"
                      size="small"
                      icon={<WalletIcon />}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {payment.payment_identifier || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            py: 8, 
            px: 3, 
            textAlign: 'center',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'grey.50'
          }}
        >
          <Box 
            sx={{ 
              width: 80,
              height: 80,
              bgcolor: 'background.paper', 
              borderRadius: '50%', 
              mb: 3,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadows[1]
            }}
          >
            <WalletIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            fontWeight="medium"
          >
            {t('label:ApplicationAddEdit.payment.noPayments')}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ maxWidth: 400, mx: 'auto' }}
          >
            {t('label:ApplicationAddEdit.payment.noPaymentsDescription')}
          </Typography>
        </Paper>
      )}
      
      <Dialog
        open={paymentInfoDialogOpen}
        onClose={() => setPaymentInfoDialogOpen(false)}
        aria-labelledby="payment-info-dialog-title"
        aria-describedby="payment-info-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="payment-info-dialog-title">
          {t('label:ApplicationAddEdit.payment.instructionDialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="payment-info-dialog-description" component="div">
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary', mt: 1 }}>
              {t('label:ApplicationAddEdit.payment.instructionDialog.methods')}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                {t('label:ApplicationAddEdit.payment.instructionDialog.bankTransfer.title')}
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                {t('label:ApplicationAddEdit.payment.instructionDialog.bankTransfer.description')}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                {t('label:ApplicationAddEdit.payment.instructionDialog.onlinePayment.title')}
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                {t('label:ApplicationAddEdit.payment.instructionDialog.onlinePayment.description')}
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.primary' }}>
              {t('label:ApplicationAddEdit.payment.instructionDialog.confirmationRequirements')}
            </Typography>
            <Typography variant="body2" component="div" sx={{ pl: 2 }}>
              {t('label:ApplicationAddEdit.payment.instructionDialog.confirmationDetails')}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPaymentInfoDialogOpen(false)} 
            color="primary"
            variant="contained"
          >
            {t('label:ApplicationAddEdit.common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});