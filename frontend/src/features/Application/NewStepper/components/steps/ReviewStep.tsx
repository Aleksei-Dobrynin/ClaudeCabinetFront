// components/steps/ReviewStep.tsx
import MainStore from "MainStore";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { runInAction, makeObservable, observable } from "mobx";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Business,
  Home,
  Description,
  CheckCircle,
  Warning,
  Edit,
  Email,
  Phone,
  LocationOn,
  Assignment,
  FolderOpen,
  Security,
  Gavel,
  Engineering,
  Verified,
  Badge,
  InsertDriveFile,
  AccountCircle
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';
import Ckeditor from "components/ckeditor/ckeditor";
import dayjs from "dayjs";

const ReviewStep: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const { participantsStore, objectStore, documentsStore } = rootStore;
  const [digitalSignatureDialog, setDigitalSignatureDialog] = React.useState(false);
  const [consentSign, setConsentSign] = React.useState(false);
  const [isSigningInProgress, setIsSigningInProgress] = React.useState(false);
  const langRaw = i18n.language.split('-')[0];
  const currentLang = langRaw === 'ky' ? 'kg' : langRaw;

  // Функция для получения локализованного названия услуги
  const getLocalizedServiceName = (service: any) => {
    const currentLanguage = i18n.language;
    
    // Если текущий язык кыргызский, используем name_kg
    if (currentLanguage === 'ky-KG') {
      return service.name_kg || service.name; // Fallback на name если name_kg отсутствует
    }
    
    // Для всех остальных языков используем name
    return service.name;
  };

  // Получаем локализованное название текущей услуги
  const getLocalizedSelectedServiceName = () => {
    const selectedService = objectStore.services.find(s => s.id === objectStore.selectedServiceId);
    if (!selectedService) return '';
    return getLocalizedServiceName(selectedService);
  };

  const handleDigitalSignature = () => {
    setDigitalSignatureDialog(true);
    rootStore.loadTemplateDogovor();
  };

  const handleConsentSign = () => {
    setConsentSign(true);
    rootStore.loadPersonalDataAgreementText();
  };

  const handleCloseDigitalSignature = () => {
    setDigitalSignatureDialog(false);
  };

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
          rootStore.isDigitallySigned = true;
        })
      },
      () => MainStore.onCloseDigitalSign(),
    );
  };

  const handleSignSingleDocument = (fileId: number | undefined) => {
    if (!fileId) return;

    MainStore.openDigitalSign(
      [fileId],
      rootStore.applicationId,
      async () => {
        MainStore.onCloseDigitalSign();
        runInAction(() => {
          const doc = documentsStore.uploadedDocuments.find(d => d.file_id === fileId);
          if (doc) {
            doc.is_signed = true;
          }
        });
        await documentsStore.loadUploadedDocuments();
        rootStore.showSnackbar(t('label:steps.review.documentSigned'), "success");
      },
      () => {
        MainStore.onCloseDigitalSign();
      },
    );
  };

  const handleSubmitApplication = () => {
    if (!rootStore.isDigitallySigned) {
      rootStore.showSnackbar(t('label:steps.review.signRequiredFirst'), "warning");
      return;
    }

    rootStore.sendToBga();
  };

  const isDataComplete = () => {
    return (
      participantsStore.selectedRole &&
      participantsStore.customerData.pin &&
      participantsStore.customerData.name &&
      participantsStore.customerData.email &&
      participantsStore.customerData.phone1 &&
      objectStore.selectedServiceId &&
      objectStore.workType &&
      objectStore.objects.length > 0 &&
      documentsStore.isAllRequiredUploaded
    );
  };

  const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <TableRow>
      <TableCell sx={{ borderBottom: 'none', py: 1, width: '40%' }}>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ borderBottom: 'none', py: 1 }}>
        <Typography variant="body2" fontWeight="medium">{value || t('label:steps.review.notSpecified')}</Typography>
      </TableCell>
    </TableRow>
  );

  const renderDocumentItem = (doc: any) => {
    const isUploaded = doc.app_doc_id !== 0;
    const isSigned = doc.is_signed === true;

    return (
      <ListItem key={doc.id} sx={{ pl: 0 }}>
        <ListItemIcon>
          {isUploaded ? (
            <CheckCircle color={isSigned ? "success" : "primary"} fontSize="small" />
          ) : (
            <Warning color="error" fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={doc.doc_name}
          secondary={
            isUploaded && doc.file_name ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {doc.file_name}
                </Typography>
                {doc.created_at && (
                  <Typography variant="caption" color="text.secondary">
                    • {new Date(doc.created_at).toLocaleDateString('ru')}
                  </Typography>
                )}
                {isSigned && (
                  <Chip
                    label={t('label:steps.review.signed')}
                    size="small"
                    color="success"
                    icon={<Verified />}
                  />
                )}
              </Box>
            ) : (
              <Typography variant="caption" color="error">
                {t('label:steps.review.notUploaded')}
              </Typography>
            )
          }
        />
        {isUploaded && !isSigned && doc.file_id && (
          <ListItemSecondaryAction>
            <Button
              onClick={() => handleSignSingleDocument(doc.file_id)}
              size="small"
              variant="outlined"
              color="primary"
            >
                {t('label:steps.review.signDocument')}
            </Button>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {t('label:steps.review.title')}
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <AlertTitle>{t('label:steps.review.lastStep')}</AlertTitle>
        {t('label:steps.review.lastStepDescription')}
      </Alert>

      {!isDataComplete() && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <AlertTitle>{t('label:steps.review.attention')}</AlertTitle>
          {t('label:steps.review.attentionDescription')}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Assignment />
                  </Avatar>
                  <Typography variant="h6">{t('label:steps.review.serviceInfo')}</Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => rootStore.setCurrentStep(0)}
                >
                  {t('common:edit')}
                </Button>
              </Box>
              <Table size="small">
                <TableBody>
                  <InfoRow
                    label={t('label:steps.review.service')}
                    value={getLocalizedSelectedServiceName()}
                    icon={<Assignment />}
                  />
                  <InfoRow
                    label={t('label:steps.review.workType')}
                    value={objectStore.workType}
                    icon={<Engineering />}
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {participantsStore.customerData.isPhysical ? <Person /> : <Business />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {participantsStore.selectedRole === 'customer' ? t('label:steps.review.customer') : t('label:steps.review.customerData')}
                    </Typography>
                    <Chip
                      label={participantsStore.customerData.isPhysical ? t('label:steps.review.individual') : t('label:steps.review.legal')}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => rootStore.setCurrentStep(1)}
                >
                  {t('common:edit')}
                </Button>
              </Box>

              <Table size="small">
                <TableBody>
                  <InfoRow
                    label={t('label:steps.review.pin')}
                    value={participantsStore.customerData.pin}
                    icon={<Badge />}
                  />
                  <InfoRow
                    label={participantsStore.customerData.isPhysical ? t('label:steps.review.fullName') : t('label:steps.review.organizationName')}
                    value={participantsStore.customerData.name}
                    icon={<AccountCircle />}
                  />
                  {!participantsStore.customerData.isPhysical && (
                    <InfoRow
                      label={t('label:steps.review.director')}
                      value={participantsStore.customerData.director}
                      icon={<Person />}
                    />
                  )}
                  {(participantsStore.customerData.isPhysical && participantsStore.customerData.passport_series) &&
                    <>
                      <InfoRow
                        label={t('label:steps.review.passport_series')}
                        value={participantsStore.customerData.passport_series}
                        icon={<AccountCircle />}
                      />
                      <InfoRow
                        label={t('label:steps.review.passport_whom_issued')}
                        value={participantsStore.customerData.passport_whom_issued}
                        icon={<AccountCircle />}
                      />

                      <InfoRow
                        label={t('label:steps.review.passport_issued_date')}
                        value={participantsStore.customerData.passport_issued_date ? dayjs(participantsStore.customerData.passport_issued_date).format('YYYY-MM-DD') : ""}
                        icon={<AccountCircle />}
                      />
                    </>
                  }
                  <InfoRow
                    label="Телефон"
                    value={participantsStore.customerData.phone1}
                    icon={<Phone />}
                  />
                  <InfoRow
                    label={t('label:steps.review.email')}
                    value={participantsStore.customerData.email}
                    icon={<Email />}
                  />
                  <InfoRow
                    label={t('label:steps.review.address')}
                    value={participantsStore.customerData.address}
                    icon={<LocationOn />}
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Home />
                  </Avatar>
                  <Typography variant="h6">
                    {t('label:steps.review.objects', { count: objectStore.objects.length })}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => rootStore.setCurrentStep(0)}
                >
                  {t('common:edit')}
                </Button>
              </Box>

              {objectStore.objects.map((object, index) => (
                <Box key={object.id} mb={index < objectStore.objects.length - 1 ? 2 : 0}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('label:steps.review.objectNumber', { number: index + 1 })}
                  </Typography>
                  <Table size="small">
                    <TableBody>
                      <InfoRow
                        label={t('label:steps.review.district')}
                        value={objectStore.getDistrictName(object.districtId)}
                        icon={<LocationOn />}
                      />
                      <InfoRow
                        label={t('label:steps.review.address')}
                        value={objectStore.getObjectAddress(object)}
                        icon={<Home />}
                      />
                      <InfoRow
                        label={t('label:steps.review.tags')}
                        value={
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {object.tags?.map(tagId => {
                              const tag = objectStore.availableTags.find(t => t.id === tagId);
                              return tag ? (
                                <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                              ) : null;
                            })}
                          </Box>
                        }
                      />
                    </TableBody>
                  </Table>
                  {index < objectStore.objects.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Description color="primary" />
                <Typography variant="h6">{t('label:steps.review.uploadedDocuments')}</Typography>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => rootStore.setCurrentStep(2)}
                >
                  {t('common:edit')}
                </Button>
              </Box>

              {documentsStore.uploadedDocuments.length > 0 ? (
                <Box>
                  {documentsStore.mandatoryDocuments.length > 0 && (
                    <Box mb={3}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" color={documentsStore.isAllRequiredUploaded ? "success.main" : "error.main"}>
                          {t('label:steps.review.mandatoryDocuments')}
                        </Typography>
                        <Chip
                          label={`${documentsStore.mandatoryDocuments.filter(d => d.app_doc_id !== 0).length}/${documentsStore.mandatoryDocuments.length}`}
                          size="small"
                          color={documentsStore.isAllRequiredUploaded ? "success" : "error"}
                        />
                      </Box>
                      <List dense>
                        {documentsStore.mandatoryDocuments.map(doc => renderDocumentItem(doc))}
                      </List>
                    </Box>
                  )}

                  {documentsStore.optionalDocuments.length > 0 && (
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="subtitle1" color="primary">
                          {t('label:steps.review.optionalDocuments')}
                        </Typography>
                        <Chip
                          label={`${documentsStore.optionalDocuments.filter(d => d.app_doc_id !== 0).length}/${documentsStore.optionalDocuments.length}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <List dense>
                        {documentsStore.optionalDocuments.filter(d => d.app_doc_id !== 0).map(doc => renderDocumentItem(doc))}
                      </List>
                    </Box>
                  )}
                </Box>
              ) : (
                <Alert severity="warning">
                  {t('label:steps.review.noDocuments')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2} sx={{
            bgcolor: rootStore.isDigitallySigned ? 'success.50' : 'grey.50',
            border: 1,
            borderColor: rootStore.isDigitallySigned ? 'success.main' : 'grey.300'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ bgcolor: rootStore.isDigitallySigned ? 'success.main' : 'grey.400' }}>
                  <Security />
                </Avatar>
                <Typography variant="h6">
                  {t('label:steps.review.digitalSignature')}
                </Typography>
                {rootStore.isDigitallySigned && (
                  <Chip
                    label={t('label:steps.review.signed')}
                    color="success"
                    icon={<CheckCircle />}
                    size="small"
                  />
                )}
              </Box>

              {rootStore.isDigitallySigned ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {t('label:steps.review.documentsSignedSuccess')}
                    </Typography>
                  </Alert>
                  <Table size="small">
                    <TableBody>
                      <InfoRow
                        label={t('label:steps.review.signDate')}
                        value={rootStore.digitalSignatureDate?.toLocaleString('ru')}
                        icon={<CheckCircle />}
                      />
                      <InfoRow
                        label={t('label:steps.review.status')}
                        value={<Chip label={t('label:steps.review.valid')} color="success" size="small" />}
                        icon={<Security />}
                      />
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Alert severity="warning">
                  <Typography variant="body2">
                    {t('label:steps.review.signRequiredForSubmission')}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: rootStore.isReadyToSubmit ? 'success.50' : 'warning.50',
              border: 1,
              borderColor: rootStore.isReadyToSubmit ? 'success.main' : 'warning.main'
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              {rootStore.isReadyToSubmit ? (
                <CheckCircle color="success" sx={{ fontSize: 32 }} />
              ) : (
                <Warning color="warning" sx={{ fontSize: 32 }} />
              )}
              <Typography variant="h6" color={rootStore.isReadyToSubmit ? 'success.dark' : 'warning.dark'}>
                {rootStore.isReadyToSubmit ? t('label:steps.review.readyToSubmit') : t('label:steps.review.notReadyToSubmit')}
              </Typography>
            </Box>

            {rootStore.isReadyToSubmit ? (
              <Typography variant="body2" color="success.dark">
                {t('label:steps.review.readyToSubmitDescription')}
              </Typography>
            ) : (
              <Box>
                <Typography variant="body2" color="warning.dark" sx={{ mb: 2 }}>
                  {t('label:steps.review.notReadyToSubmitDescription')}
                </Typography>
                <List dense>
                  {!participantsStore.customerData.pin && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon><Warning color="warning" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={t('label:steps.review.requirements.pin')} />
                    </ListItem>
                  )}
                  {!participantsStore.customerData.name && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon><Warning color="warning" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={t('label:steps.review.requirements.name')} />
                    </ListItem>
                  )}
                  {!objectStore.selectedServiceId && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon><Warning color="warning" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={t('label:steps.review.requirements.service')} />
                    </ListItem>
                  )}
                  {!documentsStore.isAllRequiredUploaded && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon><Warning color="warning" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={t('label:steps.review.requirements.documents')} />
                    </ListItem>
                  )}
                  {!rootStore.isDigitallySigned && isDataComplete() && (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemIcon><Warning color="warning" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={t('label:steps.review.requirements.signature')} />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            {!rootStore.isDigitallySigned &&
              <Button
                variant="contained"
                size="large"
                disabled={!isDataComplete()}
                startIcon={<Security />}
                onClick={handleDigitalSignature}
                sx={{ minWidth: 200 }}
              >
                {t('label:steps.review.signWithEDS')}
              </Button>
            }
            {rootStore.isDigitallySigned &&
              <Button
                variant="contained"
                size="large"
                startIcon={<Security />}
                onClick={() => {
                  setDigitalSignatureDialog(true);
                }}
                sx={{ minWidth: 200 }}
              >
                {t('label:steps.review.viewDocument')}
              </Button>
            }

            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircle />}
              onClick={handleSubmitApplication}
              disabled={!rootStore.isReadyToSubmit}
              sx={{ minWidth: 200 }}
              color="success"
            >
              {t('label:steps.review.submitApplication')}
            </Button>
          </Box>

          {!isDataComplete() && (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
              {t('label:steps.review.fillAllRequiredFields')}
            </Typography>
          )}

          {isDataComplete() && !rootStore.isDigitallySigned && (
            <Typography variant="body2" color="warning.main" textAlign="center" sx={{ mt: 2 }}>
              {t('label:steps.review.signToSubmit')}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Dialog open={digitalSignatureDialog} onClose={handleCloseDigitalSignature} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <Security color="primary" />
            {t('label:steps.review.application')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Ckeditor
            onChange={() => { }}
            value={rootStore.dogovorTemplate}
            withoutPlaceholder
            disabled={true}
            name="dogovorTemplate"
            id="dogovorTemplate"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDigitalSignature}>
            {rootStore.isDigitallySigned ? t('common:close') : t('common:cancel')}
          </Button>
          {!rootStore.isDigitallySigned && (
            <Button
              onClick={handleSignDocuments}
              variant="contained"
              autoFocus
              disabled={isSigningInProgress}
              startIcon={isSigningInProgress ? <CircularProgress size={16} /> : <Security />}
            >
              {t('common:sign.Sign')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
            disabled={true}
            name="personalDataAgreementText"
            id="personalDataAgreementText"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsentSign}>
            {rootStore.isDigitallySigned ? t('common:close') : t('common:cancel')}
          </Button>
          {!rootStore.isDigitallySigned && (
            <Button
              onClick={handleSignDocuments}
              variant="contained"
              autoFocus
              disabled={isSigningInProgress}
              startIcon={isSigningInProgress ? <CircularProgress size={16} /> : <Security />}
            >
              {t('common:sign.Sign')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default ReviewStep;