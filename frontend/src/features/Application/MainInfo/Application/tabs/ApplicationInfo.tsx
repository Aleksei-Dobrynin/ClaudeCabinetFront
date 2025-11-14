import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore, useUIStore, useErrorStore } from '../../stores/StoreContext';
import {
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  IconButton,
  Button,
  Chip,
  Divider,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  useTheme,
  Tooltip,
  Card,
  CardContent,
  InputAdornment,
  Select,
  MenuItem,
  Autocomplete
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Tag as TagIcon,
  Work as WorkIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  BadgeOutlined as BadgeIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { Customer } from 'constants/Customer';

interface ArchObject {
  id: number;
  districtId: number;
  applicationId: number;
  address: string;
  address_street: string | null;
  address_building: string | null;
  address_flat: string | null;
  name: string;
  identifier: string;
  description: string;
  xCoord: number | null;
  yCoord: number | null;
  tags: number[];
}

export interface CustomerData {
  id: number;
  pin: string;
  okpo: string | null;
  isPhysical: boolean;
  postalCode: string;
  ugns: string | null;
  regNumber: string | null;
  organizationTypeId: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  name: string;
  address: string;
  director: string;
  nomer: string | null;
  phone1: string | null;
  phone2: string | null;
  email: string | null;
  email_2: string | null;
  identity_document_type_code: string | null;
  isForeign: boolean;
  foreignCountry: number;
  allowNotification: boolean | null;
  payment_account: string | null;
  bank: string | null;
  bik: string | null;
  passport_series: string | null;
  passport_issued_date: string | null;
  passport_whom_issued: string | null;
}

interface District {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const EditableField = memo<{
  label: string;
  value: string | number | null | undefined;
  field: string;
  multiline?: boolean;
  type?: string;
  required?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  isEditing: boolean;
  onStartEdit: (field: string) => void;
  onCancelEdit: () => void;
  onSave: (field: string, value: any) => void;
  theme: any;
  t: any;
}>(({
  label,
  value,
  field,
  multiline = false,
  type = 'text',
  required = false,
  icon,
  disabled = false,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  theme,
  t
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value || '');
    }
  }, [value, isEditing]);

  const handleSave = useCallback(async () => {
    await onSave(field, localValue);
  }, [field, localValue, onSave]);

  const handleCancel = useCallback(() => {
    setLocalValue(value || '');
    onCancelEdit();
  }, [value, onCancelEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [multiline, handleSave, handleCancel]);

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
      </Typography>
      {isEditing ? (
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            fullWidth
            size="small"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline={multiline}
            rows={multiline ? 3 : 1}
            type={type}
            autoFocus
            InputProps={{
              startAdornment: icon ? (
                <InputAdornment position="start">{icon}</InputAdornment>
              ) : undefined,
            }}
          />
          <IconButton
            size="small"
            onClick={handleSave}
            color="primary"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {value || <span style={{ color: theme.palette.text.disabled }}>{t('label:ApplicationAddEdit.applicationInfo.notSpecified')}</span>}
          </Typography>
          {!disabled && (
            <IconButton size="small" onClick={() => onStartEdit(field)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
});

EditableField.displayName = 'EditableField';

const ObjectEditForm = memo<{
  object: ArchObject;
  index: number;
  disabled: boolean;
  isEditing: boolean;
  districts: District[];
  tags: Tag[];
  onStartEdit: (field: string) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, field: keyof ArchObject, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  t: any;
}>(({
  object,
  index,
  disabled,
  isEditing,
  districts,
  tags,
  onStartEdit,
  onDelete,
  onUpdate,
  onSave,
  onCancel,
  t
}) => {
  const [localObject, setLocalObject] = useState<ArchObject>(object);

  useEffect(() => {
    if (!isEditing) {
      setLocalObject(object);
    }
  }, [object, isEditing]);

  const handleFieldChange = useCallback((field: keyof ArchObject, value: any) => {
    setLocalObject(prev => ({ ...prev, [field]: value }));
    onUpdate(index, field, value);
  }, [index, onUpdate]);

  if (!isEditing) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box flex={1}>
            <Typography variant="subtitle2" gutterBottom>
              {t('label:ApplicationAddEdit.applicationInfo.objectNumber', { number: index + 1 })}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('label:ApplicationAddEdit.applicationInfo.district')}:</Typography>
                <Typography variant="body2">
                  {districts.find(d => d.id === object.districtId)?.name || t('label:ApplicationAddEdit.applicationInfo.notSpecified')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('label:ApplicationAddEdit.applicationInfo.street')}:</Typography>
                <Typography variant="body2">
                  {object.address_street || t('label:ApplicationAddEdit.applicationInfo.notSpecified')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">{t('label:ApplicationAddEdit.applicationInfo.building')}:</Typography>
                <Typography variant="body2">
                  {object.address_building || t('label:ApplicationAddEdit.applicationInfo.notSpecified')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">{t('label:ApplicationAddEdit.applicationInfo.apartment')}:</Typography>
                <Typography variant="body2">
                  {object.address_flat || t('label:ApplicationAddEdit.applicationInfo.notSpecified')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('label:ApplicationAddEdit.applicationInfo.tags')}:</Typography>
                <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.5}>
                  {object.tags.length > 0 ? (
                    object.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ) : null;
                    })
                  ) : (
                    <Typography variant="body2" color="text.disabled">{t('label:ApplicationAddEdit.applicationInfo.notSpecified')}</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <IconButton size="small" disabled={disabled} onClick={() => onStartEdit(`object_${index}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" disabled={disabled || index === 0} onClick={() => onDelete(index)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
      <Typography variant="subtitle2" gutterBottom>
        {t('label:ApplicationAddEdit.applicationInfo.editingObject', { number: index + 1 })}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {t('label:ApplicationAddEdit.applicationInfo.district')} *
            </Typography>
            <Select
              value={localObject.districtId}
              onChange={(e) => handleFieldChange('districtId', Number(e.target.value))}
            >
              {districts.map(district => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={t('label:ApplicationAddEdit.applicationInfo.street')}
            value={localObject.address_street || ''}
            onChange={(e) => handleFieldChange('address_street', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={t('label:ApplicationAddEdit.applicationInfo.building')}
            value={localObject.address_building || ''}
            onChange={(e) => handleFieldChange('address_building', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={t('label:ApplicationAddEdit.applicationInfo.apartment')}
            value={localObject.address_flat || ''}
            onChange={(e) => handleFieldChange('address_flat', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {t('label:ApplicationAddEdit.applicationInfo.objectTags')}
            </Typography>
            <Autocomplete
              multiple
              value={tags.filter(tag => localObject.tags.includes(tag.id))}
              onChange={(event, newValue) => {
                handleFieldChange('tags', newValue.map(tag => tag.id));
              }}
              options={tags}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder={t('label:ApplicationAddEdit.applicationInfo.selectTags')} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip size="small" label={option.name} {...getTagProps({ index })} />
                ))
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              size="small"
              variant="contained"
              onClick={onSave}
              startIcon={<SaveIcon />}
            >
              {t('label:ApplicationAddEdit.common.save')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={onCancel}
            >
              {t('label:ApplicationAddEdit.common.cancel')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
});

ObjectEditForm.displayName = 'ObjectEditForm';

export const ApplicationInfo: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();

  const { application, customer } = applicationStore;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingObjectIndex, setEditingObjectIndex] = useState<number | null>(null);

  const canEdit = application?.status_code === "return_with_error";

  const [workDescription, setWorkDescription] = useState(application?.work_description || '');
  const [objects, setObjects] = useState<ArchObject[]>(application?.arch_objects || []);
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  useEffect(() => {
    if (customer) {
      setCustomerData(customer);
    }
  }, [customer]);

  const handleStartEdit = useCallback((field: string) => {
    console.log('Starting edit:', field);
    setEditingField(field);
    if (field.startsWith('object_')) {
      const index = parseInt(field.split('label:ApplicationAddEdit._')[1]);
      setEditingObjectIndex(index);
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
    setEditingObjectIndex(null);
    setWorkDescription(application?.work_description || '');
    setObjects(application?.arch_objects || []);
    if (application?.customer) {
      setCustomerData(application.customer);
    }
  }, [application]);

  const handleSaveField = useCallback(async (field: string, value: any) => {
    try {
      if (field === 'workDescription') {
        setWorkDescription(value);
        await applicationStore.updateApplication({ work_description: value });
      } else if (field.startsWith('customer.')) {
        const customerField = field.split('label:ApplicationAddEdit..')[1];
        const updatedCustomer = { ...customerData!, [customerField]: value };
        setCustomerData(updatedCustomer);
        await applicationStore.updateCustomer(updatedCustomer);
      } else if (field === 'archObjects') {
        await applicationStore.updateApplication({ arch_objects: value });
      }

      setTimeout(() => {
        setEditingField(null);
        setEditingObjectIndex(null);
      }, 0);

      uiStore.showSnackbar(t('label:ApplicationAddEdit.applicationInfo.changesSaved'), 'success');
    } catch (error) {
      uiStore.showSnackbar(t('label:ApplicationAddEdit.applicationInfo.saveError'), 'error');
      console.error('Save error:', error);
    }
  }, [customerData, applicationStore, uiStore, t]);

  const saveObjects = useCallback(async () => {
    await handleSaveField('archObjects', objects);
  }, [objects, handleSaveField]);

  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const addObject = useCallback(() => {
    const newObject: ArchObject = {
      id: getRandomInt(1, 100000) * -1, 
      districtId: 1,
      applicationId: application!.id,
      address: '',
      address_street: null,
      address_building: null,
      address_flat: null,
      name: '',
      identifier: '',
      description: '',
      xCoord: null,
      yCoord: null,
      tags: []
    };
    setObjects([...objects, newObject]);
    setEditingObjectIndex(objects.length);
    setEditingField(`object_${objects.length}`);
  }, [objects, application]);

  const updateObject = useCallback((index: number, field: keyof ArchObject, value: any) => {
    const updatedObjects = [...objects];
    updatedObjects[index] = { ...updatedObjects[index], [field]: value };
    setObjects(updatedObjects);
  }, [objects]);

  const deleteObject = useCallback((index: number) => {
    if (window.confirm(t('label:ApplicationAddEdit.applicationInfo.deleteObjectConfirm'))) {
      const updatedObjects = objects.filter((_, i) => i !== index);
      setObjects(updatedObjects);
      handleSaveField('archObjects', updatedObjects);
    }
  }, [objects, handleSaveField, t]);

  if (!application || !customerData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>{t('label:ApplicationAddEdit.applicationInfo.loadingData')}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon color="primary" />
          {t('label:ApplicationAddEdit.applicationInfo.serviceInfo')}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              {t('label:ApplicationAddEdit.applicationInfo.service')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {application.r_service_name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <EditableField
              label={t('label:ApplicationAddEdit.applicationInfo.workType')}
              value={workDescription}
              disabled={!canEdit}
              field="workDescription"
              multiline
              required
              isEditing={editingField === 'workDescription'}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSave={handleSaveField}
              theme={theme}
              t={t}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeIcon color="primary" />
            {t('label:ApplicationAddEdit.applicationInfo.objects')}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            disabled={!canEdit}
            onClick={addObject}
          >
            {t('label:ApplicationAddEdit.applicationInfo.addObject')}
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {objects.length === 0 ? (
          <Alert severity="info">
            {t('label:ApplicationAddEdit.applicationInfo.noObjects')}
          </Alert>
        ) : (
          objects.map((object, index) => (
            <ObjectEditForm
              key={object.id}
              object={object}
              index={index}
              disabled={!canEdit}
              isEditing={editingField === `object_${index}`}
              districts={applicationStore.districts}
              tags={applicationStore.tags}
              onStartEdit={handleStartEdit}
              onDelete={deleteObject}
              onUpdate={updateObject}
              onSave={saveObjects}
              onCancel={handleCancelEdit}
              t={t}
            />
          ))
        )}
      </Paper>

      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {customerData.isPhysical ? <PersonIcon color="primary" /> : <BusinessIcon color="primary" />}
          {t('label:ApplicationAddEdit.applicationInfo.customerData')} ({customerData.isPhysical ? t('label:ApplicationAddEdit.applicationInfo.individual') : t('label:ApplicationAddEdit.applicationInfo.legal')})
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <EditableField
              label={t('label:ApplicationAddEdit.applicationInfo.inn')}
              value={customerData.pin}
              field="customer.pin"
              required
              disabled
              icon={<CardIcon fontSize="small" />}
              isEditing={editingField === 'customer.pin'}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSave={handleSaveField}
              theme={theme}
              t={t}
            />
          </Grid>

          {customerData.isPhysical ? (
            <>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.lastName')}
                  value={customerData.lastName}
                  disabled={!canEdit}
                  field="customer.lastName"
                  required
                  icon={<PersonIcon fontSize="small" />}
                  isEditing={editingField === 'customer.lastName'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.firstName')}
                  value={customerData.firstName}
                  disabled={!canEdit}
                  field="customer.firstName"
                  required
                  icon={<PersonIcon fontSize="small" />}
                  isEditing={editingField === 'customer.firstName'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.secondName')}
                  value={customerData.secondName}
                  disabled={!canEdit}
                  field="customer.secondName"
                  required
                  icon={<PersonIcon fontSize="small" />}
                  isEditing={editingField === 'customer.secondName'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.phone')}
                  value={customerData.phone1}
                  disabled={!canEdit}
                  field="customer.phone1"
                  type="tel"
                  icon={<PhoneIcon fontSize="small" />}
                  isEditing={editingField === 'customer.phone1'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.additionalPhone')}
                  value={customerData.phone2}
                  disabled={!canEdit}
                  field="customer.phone2"
                  type="tel"
                  icon={<PhoneIcon fontSize="small" />}
                  isEditing={editingField === 'customer.phone2'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.email')}
                  value={customerData.email}
                  disabled={!canEdit}
                  field="customer.email"
                  type="email"
                  icon={<EmailIcon fontSize="small" />}
                  isEditing={editingField === 'customer.email'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.postalCode')}
                  value={customerData.postalCode}
                  disabled={!canEdit}
                  field="customer.postalCode"
                  isEditing={editingField === 'customer.postalCode'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.address')}
                  value={customerData.address}
                  disabled={!canEdit}
                  field="customer.address"
                  icon={<LocationIcon fontSize="small" />}
                  isEditing={editingField === 'customer.address'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.passportSeries')}
                  value={customerData.passport_series}
                  disabled={!canEdit}
                  field="customer.passport_series"
                  icon={<BadgeIcon fontSize="small" />}
                  isEditing={editingField === 'customer.passport_series'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.passportIssuer')}
                  value={customerData.passport_whom_issued}
                  disabled={!canEdit}
                  field="customer.passport_whom_issued"
                  isEditing={editingField === 'customer.passport_whom_issued'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={8}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.companyName')}
                  value={customerData.name}
                  disabled={!canEdit}
                  field="customer.name"
                  required
                  icon={<BusinessIcon fontSize="small" />}
                  isEditing={editingField === 'customer.name'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.directorName')}
                  value={customerData.director}
                  disabled={!canEdit}
                  field="customer.director"
                  required
                  icon={<PersonIcon fontSize="small" />}
                  isEditing={editingField === 'customer.director'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.okpo')}
                  value={customerData.okpo}
                  disabled={!canEdit}
                  field="customer.okpo"
                  isEditing={editingField === 'customer.okpo'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.phone')}
                  value={customerData.phone1}
                  disabled={!canEdit}
                  field="customer.phone1"
                  type="tel"
                  required
                  icon={<PhoneIcon fontSize="small" />}
                  isEditing={editingField === 'customer.phone1'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.additionalPhone')}
                  value={customerData.phone2}
                  disabled={!canEdit}
                  field="customer.phone2"
                  type="tel"
                  icon={<PhoneIcon fontSize="small" />}
                  isEditing={editingField === 'customer.phone2'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.email')}
                  value={customerData.email}
                  disabled={!canEdit}
                  field="customer.email"
                  type="email"
                  required
                  icon={<EmailIcon fontSize="small" />}
                  isEditing={editingField === 'customer.email'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.postalCode')}
                  value={customerData.postalCode}
                  disabled={!canEdit}
                  field="customer.postalCode"
                  isEditing={editingField === 'customer.postalCode'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.address')}
                  value={customerData.address}
                  disabled={!canEdit}
                  field="customer.address"
                  required
                  icon={<LocationIcon fontSize="small" />}
                  isEditing={editingField === 'customer.address'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.paymentAccount')}
                  value={customerData.payment_account}
                  disabled={!canEdit}
                  field="customer.payment_account"
                  isEditing={editingField === 'customer.payment_account'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.bank')}
                  value={customerData.bank}
                  disabled={!canEdit}
                  field="customer.bank"
                  icon={<BankIcon fontSize="small" />}
                  isEditing={editingField === 'customer.bank'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <EditableField
                  label={t('label:ApplicationAddEdit.applicationInfo.bik')}
                  value={customerData.bik}
                  disabled={!canEdit}
                  field="customer.bik"
                  isEditing={editingField === 'customer.bik'}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSave={handleSaveField}
                  theme={theme}
                  t={t}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
});

export default ApplicationInfo;