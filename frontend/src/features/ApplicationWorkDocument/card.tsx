import React from 'react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { 
  Paper, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertTitle,
  styled
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import store from './store';

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '& .MuiCardHeader-title': {
    fontSize: '1.3rem',
    fontWeight: 600
  },
  '& .MuiCardHeader-subheader': {
    color: theme.palette.primary.contrastText,
    opacity: 0.9
  }
}));

const InfoLabel = styled(Typography)({
  color: '#757575',
  fontSize: '14px',
  marginBottom: '4px'
});

const InfoValue = styled(Typography)({
  fontSize: '16px',
  marginBottom: '12px'
});

const SignatureTable = ({ signatures, t }) => (
  <TableContainer component={Box} sx={{ marginTop: 2, maxWidth: '100%', mb: 2 }}>
    <Table aria-label="signature table" size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: 'grey.100' }}>
          <TableCell sx={{ fontWeight: 'bold' }}>{t('label:documentCard.signature.whoSigned')}</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>{t('label:documentCard.signature.whenSigned')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {signatures.map((signature) => (
          <TableRow key={signature.id} hover>
            <TableCell>{signature.user_full_name}</TableCell>
            <TableCell>
              {signature.timestamp && dayjs(signature.timestamp).format("DD.MM.YYYY HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const OfficialStamp = ({ t }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      mt: 4, 
      mb: 2,
      p: 2,
      border: '1px dashed',
      borderColor: 'primary.main',
      borderRadius: 1
    }}
  >
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1 
      }}
    >
      <SecurityIcon color="primary" />
      <Typography variant="h6" color="primary.main">
        {t('label:documentCard.officialStamp.title')}
      </Typography>
    </Box>
    <Typography variant="body1" align="center">
      {t('label:documentCard.officialStamp.description')}
    </Typography>
  </Box>
);

const DocumentFound = ({ t }) => (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<VerifiedIcon />}
      title={t('label:documentCard.documentFound.title')}
      subheader={t('label:documentCard.documentFound.subtitle', { date: dayjs().format('DD.MM.YYYY') })}
    />
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <InfoLabel>{t('label:documentCard.documentName')}</InfoLabel>
          <InfoValue>{store.file_doc_name}</InfoValue>
          <InfoValue>{store.file_name}</InfoValue>
          {store.status_name && <InfoValue>{store.status_name}</InfoValue>}
        </Box>
        
        <Divider />
        
        <Box>
          <InfoLabel>{t('label:documentCard.signatureInfo')}</InfoLabel>
          <SignatureTable signatures={store.signs} t={t} />
        </Box>
      </Box>
      
      <OfficialStamp t={t} />
    </CardContent>
  </Card>
);

const DocumentNotFound = ({ t }) => (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<ArticleIcon />}
      title={t('label:documentCard.documentNotFound.title')}
      subheader={t('label:documentCard.documentNotFound.subtitle')}
    />
    <CardContent>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>{t('label:documentCard.documentNotFound.alertTitle')}</AlertTitle>
        {t('label:documentCard.documentNotFound.alertDescription')}
      </Alert>
      <Typography variant="body1" color="text.secondary">
        {t('label:documentCard.documentNotFound.possibleReasons')}
      </Typography>
      <ul>
        <Typography component="li" variant="body2" color="text.secondary">
          {t('label:documentCard.documentNotFound.reason1')}
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary">
          {t('label:documentCard.documentNotFound.reason2')}
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary">
          {t('label:documentCard.documentNotFound.reason3')}
        </Typography>
      </ul>
    </CardContent>
  </Card>
);

const ApplicationInfoCard = observer(() => {
  const { t } = useTranslation();
  
  return (
    <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
      {store.hasDocument ? <DocumentFound t={t} /> : <DocumentNotFound t={t} />}
    </Paper>
  );
});

export default ApplicationInfoCard;