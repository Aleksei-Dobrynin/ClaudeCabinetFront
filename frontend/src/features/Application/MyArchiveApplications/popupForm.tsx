import { FC, useEffect } from 'react';
import store from "./storePopup"
import { observer } from "mobx-react"
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Typography, 
  Chip, 
  Box, 
  Divider,
  Paper,
  Card,
  CardContent,
  Avatar,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { 
  CalendarToday, 
  Person, 
  LocationOn, 
  Business, 
  Assignment,
  AccountCircle,
  Home,
  Payment,
  Description,
  Numbers,
  Badge,
  Phone
} from '@mui/icons-material';

type PopupFormProps = {
  openPanel: boolean;
  id: number;
  onBtnCloseClick: () => void;
}

const ApplicationPopupForm: FC<PopupFormProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.openPanel) {
      store.doLoad(props.id)
    } else {
      store.clearStore()
    }
  }, [props.openPanel])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'review': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'completed': return '#2196f3';
      default: return '#757575';
    }
  };

  const InfoCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="primary" fontWeight="600">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
        {icon}
        <Typography variant="subtitle2" color="textSecondary" fontWeight="500">
          {label}
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ pl: icon ? 3 : 0, color: 'text.primary', fontWeight: 400 }}>
        {value}
      </Typography>
    </Box>
  );

  const data = store.data;

  if (!data) {
    return (
      <Dialog open={props.openPanel} onClose={props.onBtnCloseClick} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Assignment color="primary" />
            <Typography variant="h5">
              {translate('label:ApplicationAddEditView.entityTitle')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography variant="h6" color="textSecondary">
              Загрузка данных...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <CustomButton
            variant="contained"
            id="id_ApplicationCloseButton"
            name={'ApplicationAddEditView.close'}
            onClick={() => props.onBtnCloseClick()}
            sx={{ minWidth: 120 }}
          >
            {translate("common:close")}
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={props.openPanel} 
      onClose={props.onBtnCloseClick} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#f8f9fa', color: 'text.primary', pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Assignment fontSize="large" color="primary" />
            <Box>
              <Typography variant="h5" fontWeight="600">
                Заявка №{data.number}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {data.service_name}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={data.status_name} 
            sx={{ 
              bgcolor: data.status_color || getStatusColor(data.status_code),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: '#f8f9fa', p: 3 }}>
        <Grid container spacing={3}>
          {/* Основная информация */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Основная информация" icon={<Assignment />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Дата регистрации" 
                    value={formatDate(data.registration_date)}
                    icon={<CalendarToday fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Срок выполнения" 
                    value={formatDate(data.deadline)}
                    icon={<CalendarToday fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Описание работ" 
                    value={data.work_description || 'Не указано'}
                    icon={<Description fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Payment fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="textSecondary" fontWeight="500">
                      Статус оплаты
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={data.is_paid ? 'Оплачено' : 'Не оплачено'} 
                      color={data.is_paid ? 'success' : 'error'}
                      variant="filled"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Информация о заказчике" icon={<Person />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoItem 
                    label="ФИО заказчика" 
                    value={data.customer_name}
                    icon={<AccountCircle fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="ПИН заказчика" 
                    value={data.customer_pin}
                    icon={<Badge fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Адрес заказчика" 
                    value={data.customer_address}
                    icon={<LocationOn fontSize="small" color="action" />}
                  />
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Информация об объекте" icon={<Home />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Адрес объекта" 
                    value={data.arch_object_address}
                    icon={<LocationOn fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Район" 
                    value={data.arch_object_district}
                    icon={<LocationOn fontSize="small" color="action" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Тип объекта" 
                    value={data.object_tag_name}
                    icon={<Business fontSize="small" color="action" />}
                  />
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Дополнительная информация" icon={<Business />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoItem 
                    label="Создано сотрудником" 
                    value={data.created_by_name}
                    icon={<AccountCircle fontSize="small" color="action" />}
                  />
                </Grid>
                {data.incoming_numbers && (
                  <Grid item xs={12}>
                    <InfoItem 
                      label="Входящий номер" 
                      value={data.incoming_numbers}
                      icon={<Numbers fontSize="small" color="action" />}
                    />
                  </Grid>
                )}
                {data.outgoing_numbers && (
                  <Grid item xs={12}>
                    <InfoItem 
                      label="Исходящий номер" 
                      value={data.outgoing_numbers}
                      icon={<Numbers fontSize="small" color="action" />}
                    />
                  </Grid>
                )}
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#f8f9fa', p: 3, borderTop: '1px solid #e0e0e0' }}>
        <CustomButton
          variant="contained"
          id="id_ApplicationCloseButton"
          name={'ApplicationAddEditView.close'}
          onClick={() => props.onBtnCloseClick()}
          sx={{ 
            minWidth: 120,
            height: 44,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {translate("common:close")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
})

export default ApplicationPopupForm;