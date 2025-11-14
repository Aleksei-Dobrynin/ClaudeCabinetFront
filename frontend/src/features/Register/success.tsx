import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';
import companyRegistrationStore from "./store";

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const GradientHeader = styled(Box)`
  background: linear-gradient(135deg, #6692d5 0%, #3685cb 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
`;

const IconWrapper = styled(Box)`
  margin: 0 auto 16px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoCard = styled(Card)<{ $bordercolor?: string }>`
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid ${props => props.$bordercolor || '#3685cb'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButton = styled(Button)`
  border-radius: 30px;
  padding: 12px 30px;
  font-weight: 600;
  text-transform: none;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(54, 133, 203, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 15px rgba(54, 133, 203, 0.4);
    transform: translateY(-2px);
  }
`;

interface RegistrationSuccessProps {
  regType?: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
                                                                   regType
                                                                 }) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <StyledCard>
        <GradientHeader>
          <IconWrapper>
            <CheckCircleOutlineIcon sx={{ fontSize: 50, color: '#fff' }} />
          </IconWrapper>
          <Typography variant="h4" component="h1" fontWeight="700" gutterBottom>
            {translate('label:registration.successTitle')}
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: '80%', mx: 'auto', opacity: 0.9 }}>
            {regType === 'company'
              ? translate('label:registration.companySuccessMessage')
              : translate('label:registration.personSuccessMessage')}
          </Typography>
        </GradientHeader>

        <CardContent sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InfoCard $bordercolor="#4caf50">
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ color: '#4caf50', fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {translate('label:registration.checkYourEmail')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {translate('label:registration.emailCheckMessage')}
                    </Typography>
                  </Box>
                </CardContent>
              </InfoCard>
            </Grid>

            <Grid item xs={12} sm={12}>
              <InfoCard $bordercolor="#ff9800">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LockIcon sx={{ color: '#ff9800', mr: 1 }} />
                    <Typography variant="h6">
                      {translate('label:registration.accessCredentials')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {translate('label:registration.credentialsMessage')}
                  </Typography>
                </CardContent>
              </InfoCard>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <InfoCard $bordercolor="#9c27b0">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <VerifiedUserIcon sx={{ color: '#9c27b0', mr: 1 }} />
                    <Typography variant="h6">
                      {translate('label:registration.verificationStatus')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {translate('label:registration.verificationMessage')}
                  </Typography>
                </CardContent>
              </InfoCard>
            </Grid> */}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {translate('label:registration.nextStepQuestion')}
                </Typography>
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ mt: 2 }}
                >
                  {translate('label:registration.goToLogin')}
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default RegistrationSuccess;