// components/steps/ObjectStep.tsx

import React, { useEffect, useState } from "react";
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
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Chip,
  FormHelperText,
  Autocomplete,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  ExpandMore,
  ExpandLess,
  Info,
  CheckCircle,
  LocalOffer,
  Home,
  Business,
  InfoOutlined,
  Visibility,
  VisibilityOff,
  Clear
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';
import AutocompleteCustom from 'components/Autocomplete';
import ServiceInfoPanel from '../ServiceInfoPanelV2';
import { MapContainer, Marker, Polygon, Popup, TileLayer, LayersControl } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import CustomTextField from 'components/TextField';
import CustomButton from 'components/Button';
import { runInAction } from "mobx";
import CustomCheckbox from "components/Checkbox";

const { BaseLayer } = LayersControl;

const ObjectStep: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const { objectStore } = rootStore;
  const [expandedObjects, setExpandedObjects] = React.useState<Set<number>>(new Set());
  const [showServiceInfo, setShowServiceInfo] = React.useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const query = new URLSearchParams(window.location.search);
  const id = query.get("id");

  useEffect(() => {
    const saved = localStorage.getItem("objects");
    objectStore.currentApp = Number(id);
    if (saved && Number(id) == 0) {
      try {
        try {
          const parsed = JSON.parse(saved);
          objectStore.objects = parsed.map((obj: any) => ({
            ...obj,
            id: obj.id ?? objectStore.generateTempId(),
            tunduk_district_id: Number(obj.tunduk_district_id) || 0,
            tunduk_residential_area_id: Number(obj.tunduk_residential_area_id) || 0,
            tunduk_street_id: Number(obj.tunduk_street_id) || 0,
            tunduk_address_unit_id: Number(obj.tunduk_address_unit_id) || 0,
            tunduk_building_id: Number(obj.tunduk_building_id) || 0,
            tunduk_building_num: obj.tunduk_building_num || "",
            tunduk_flat_num: obj.tunduk_flat_num || "",
            uch_number: obj.uch_number || "",
            address: obj.address || "",
            address_street: obj.address_street || "",
            address_building: obj.address_building || "",
            address_flat: obj.address_flat || "",
            xCoord: Number(obj.xCoord) || undefined,
            yCoord: Number(obj.yCoord) || undefined,
            tags: Array.isArray(obj.tags) ? obj.tags : [],
            DarekSearchList: Array.isArray(obj.DarekSearchList) ? obj.DarekSearchList : [],
          }));
        } catch (error) {
          console.error("Ошибка парсинга объектов из localStorage:", error);
          objectStore.objects = [];
        }
        if (objectStore.TundukStreets.length == 0) {
          objectStore.reloadDependentData();
        }
      } catch (error) {
        objectStore.objects = [];
      }
    }
  }, [objectStore.TundukDistricts]);

  // const getLocalizedServiceName = (service: any) => {
  const currentLanguage = i18n.language;

  // Функция для получения названия тега в зависимости от языка
  const getTagName = (tag: any) => {
    if (currentLanguage === 'ky-KG' && tag.name_kg) {
      return tag.name_kg;
    }
    return tag.name;
  };

  // Функция для получения названия услуги в зависимости от языка
  const getServiceName = (service: any) => {
    if (currentLanguage === 'ky-KG' && service.name_kg) {
      return service.name_kg;
    }
    return service.name;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  React.useEffect(() => {
    if (objectStore.objects.length > 0) {
      setExpandedObjects(new Set([objectStore.objects[0].id]));
    }
  }, [objectStore.objects]);

  const toggleObjectExpanded = (objectId: number) => {
    const newExpanded = new Set(expandedObjects);
    if (newExpanded.has(objectId)) {
      newExpanded.delete(objectId);
    } else {
      newExpanded.add(objectId);
    }
    setExpandedObjects(newExpanded);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        {t('label:steps.object.title')}
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {t('label:steps.object.serviceAndWorkType')}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <Box flex={1}>
                <AutocompleteCustom
                  value={objectStore.selectedServiceId}
                  onChange={(e) => objectStore.setSelectedService(e.target.value ? Number(e.target.value) : null)}
                  name="rServiceId"
                  fieldNameDisplay={(Service) => `${getServiceName(Service)} (${Service.day_count} ${t('label:steps.object.workingDays')})` || ""}
                  data={objectStore.services}
                  data-testid="id_f_Application_rServiceId"
                  id="id_f_Application_rServiceId"
                  label={t("label:ApplicationAddEditView.rServiceId")}
                  helperText={objectStore.errors.serviceId}
                  error={!!objectStore.errors.serviceId}
                />
              </Box>
            </Box>
          </Grid>

          {objectStore.selectedServiceId && (
            <Grid item xs={12}>
              <ServiceInfoPanel
                service={objectStore.services.find(s => s.id === objectStore.selectedServiceId)}
                onClose={() => setShowServiceInfo(false)}
                expanded={true}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('label:steps.object.workTypeLabel')}
              required
              multiline
              rows={2}
              value={objectStore.workType}
              onChange={(e) => objectStore.setWorkType(e.target.value)}
              error={!!objectStore.errors.workType}
              helperText={objectStore.errors.workType || t('label:steps.object.workTypeHelperText')}
              placeholder={t('label:steps.object.workTypePlaceholder')}
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {t('label:steps.object.objectsCount', { count: objectStore.objects.length })}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            toggleObjectExpanded(objectStore.newObjectId)
            objectStore.addObject(objectStore.newObjectId)
          }}
          size="small"
        >
          {t('label:steps.object.addObject')}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('label:steps.object.objectsHelpText')}
      </Alert>

      <Grid container spacing={2}>
        <Grid item md={6}>
          <MapContainer
            center={[42.87, 74.60] as LatLngExpression}
            zoom={11}
            style={{ height: "450px", width: "100%" }}>
            <LayersControl position="topright">
              <BaseLayer checked name={t('label:steps.object.map.scheme')}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
              </BaseLayer>
              <BaseLayer name={t('label:steps.object.map.satellite')}>
                <TileLayer
                  maxZoom={24}
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
                />
              </BaseLayer>
            </LayersControl>
            {objectStore.objects.map((obj, i) => {
              if (obj.xCoord && obj.yCoord) {
                return <Marker key={obj.id} position={[obj.xCoord, obj.yCoord]}>
                  <Popup>
                    <div>
                      <strong>{t('label:steps.object.address')}:</strong> {obj.address}
                    </div>
                  </Popup>
                </Marker>
              }
            })}
          </MapContainer>
          <Box>
            {(() => {
              let obj = objectStore.objects[objectStore.objects.length - 1];
              return (
                <>
                  {obj?.xCoord !== 0 && obj?.yCoord !== 0 &&
                    <a
                      style={{
                        textDecoration: "underline",
                        color: "#5555b5",
                        marginLeft: 10,
                        fontWeight: 500
                      }}
                      target="_blank"
                      href={`https://2gis.kg/bishkek/geo/${obj?.yCoord}%2C${obj?.xCoord}?m=${obj?.yCoord}%2C${obj?.xCoord}%2F14.6`}>
                      {t("common:openIn2GIS")}
                    </a>}
                </>
              );
            })()}
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {objectStore.objects.map((_, index) => (
                <Tab key={index} label={t('label:steps.object.objectNumber', { number: index + 1 })} />
              ))}
            </Tabs>
            <Box mt={2} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {objectStore.objects.map((object, index) => (
                index === selectedTab && (
                  <Card key={object.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ pb: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Home color="primary" />
                          <Typography variant="h6">
                            {t('label:steps.object.objectNumber', { number: index + 1 })}
                          </Typography>
                          {object.tags.length > 0 && (
                            <Box display="flex" gap={0.5}>
                              {object.tags.slice(0, 2).map(tag => {
                                const ttag = objectStore.availableTags.find(x => x.id === tag)
                                if (!ttag) return null;
                                return <Chip
                                  key={ttag.id}
                                  label={getTagName(ttag)}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              })}
                              {object.tags.length > 2 && (
                                <Chip
                                  label={`+${object.tags.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Tooltip title={t('label:steps.object.clearObjectData')}>
                            <IconButton
                              onClick={() => objectStore.clearObject(object.id!)}
                              color="warning"
                              size="small"
                            >
                              <Clear />
                            </IconButton>
                          </Tooltip>
                          {(objectStore.objects.length > 1) && (
                            <Tooltip title={t('label:steps.object.deleteObject')}>
                              <IconButton
                                onClick={() => objectStore.removeObject(object.id!)}
                                color="error"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                          <IconButton
                            onClick={() => toggleObjectExpanded(object.id!)}
                            size="small"
                          >
                            {expandedObjects.has(object.id!) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {!expandedObjects.has(object.id!) && object.address_street && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 5 }}>
                          {objectStore.getObjectAddress(object)}
                        </Typography>
                      )}
                    </CardContent>

                    <Collapse in={expandedObjects.has(object.id!)}>
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Autocomplete
                              key={object.tunduk_district_id}
                              value={objectStore.TundukDistricts.find(x => x.id == object.tunduk_district_id) || null}
                              onChange={(event, newValue) => {
                                runInAction(() => {
                                  // Используем новый метод для обработки изменения района
                                  objectStore.handleTundukDistrictChange(index, newValue?.id ?? 0);

                                  // Сбрасываем микрорайон и улицу при изменении района
                                  objectStore.updateObject(object.id!, 'tunduk_address_unit_id', 0)
                                  objectStore.updateObject(object.id!, 'tunduk_street_id', 0)
                                  const district = objectStore.districts.find(
                                    x => x.address_unit_id === object.tunduk_district_id);
                                  objectStore.updateObject(object.id!, 'district_id', district?.id ?? 0)
                                  // Сбрасываем состояние поиска улиц
                                  objectStore.handleTundukStreetChange(index, null, index);
                                  objectStore.clearTundukStreetState(index);
                                  objectStore.initTundukStreetState(index);

                                  if (newValue?.id) {
                                    // Загружаем микрорайоны для выбранного района
                                    objectStore.loadAteChildrens(newValue.id);
                                  } else {
                                    objectStore.TundukResidentialAreas = [];
                                  }
                                });
                              }}
                              getOptionLabel={(x) => x.name || ""}
                              options={objectStore.TundukDistricts}
                              id="id_f_tunduk_district_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t("label:ArchObjectAddEditView.tunduk_district_id")}
                                  helperText={objectStore.errors[object.id!]?.tunduk_district_id}
                                  error={!!objectStore.errors[object.id!]?.tunduk_district_id}
                                  size={"small"}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <Autocomplete
                              key={object.tunduk_address_unit_id}
                              value={objectStore.TundukResidentialAreas.find(x => x.id == object.tunduk_address_unit_id) || null}
                              onChange={(event, newValue) => {
                                objectStore.updateObject(object.id!, 'tunduk_address_unit_id', newValue?.id ?? 0);
                                objectStore.updateObject(object.id!, 'tunduk_street_id', 0);

                                // Сбрасываем состояние поиска улиц при изменении микрорайона
                                objectStore.handleTundukStreetChange(index, null, index);
                                objectStore.clearTundukStreetState(index);
                                objectStore.initTundukStreetState(index);
                              }}
                              getOptionLabel={(x) => x.name || ""}
                              options={objectStore.TundukResidentialAreas}
                              id="id_f_tunduk_address_unit_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t("label:ArchObjectAddEditView.tunduk_residential_area_id")}
                                  helperText={objectStore.errors[object.id!]?.tunduk_residential_area_id}
                                  error={!!objectStore.errors[object.id!]?.tunduk_residential_area_id}
                                  size={"small"}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <Autocomplete
                              key={`${object.tunduk_street_id}_${object.tunduk_district_id}_${object.tunduk_address_unit_id}`}
                              value={objectStore.getTundukStreetState(index).selectedStreet}
                              inputValue={objectStore.getTundukStreetState(index).inputValue}
                              open={objectStore.getTundukStreetState(index).isOpen}
                              onOpen={() => objectStore.handleTundukStreetOpen(index)}
                              onClose={() => objectStore.handleTundukStreetClose(index)}
                              onChange={(event, newValue) => {
                                objectStore.handleTundukStreetChangeWithDistrictUpdate(index, newValue);
                              }}
                              onInputChange={(event, newInputValue, reason) => {
                                objectStore.handleTundukStreetInputChange(index, newInputValue, reason, index);
                              }}
                              isOptionEqualToValue={(option, value) => option.id === value?.id}
                              getOptionLabel={(x) => {
                                if (!x) return '';
                                if (typeof x === 'string') return x;
                                return (x.name || "") + ' (' + x.address_unit_name + ')';
                              }}
                              renderOption={(props, option) =>
                                <Box component="li" {...props}>
                                  {(option.name || "") + ' (' + option.address_unit_name + ')'}
                                </Box>
                              }
                              options={objectStore.getTundukStreetState(index).searchResults}
                              loading={objectStore.getTundukStreetState(index).isLoading}
                              loadingText="Загрузка..."
                              noOptionsText={
                                (objectStore.getTundukStreetState(index)?.inputValue?.length ?? 0) < 2
                                  ? "Введите минимум 2 символа для поиска"
                                  : "Ничего не найдено"
                              }
                              id="id_f_tunduk_str_id"
                              renderInput={(params) => {
                                const streetState = objectStore.getTundukStreetState(index);
                                const selectedValue = streetState.selectedStreet;

                                if (selectedValue && params.inputProps.value) {
                                  params.inputProps.value = (selectedValue.name || "") + ' (' + selectedValue.address_unit_name + ')';
                                }

                                return (
                                  <TextField
                                    {...params}
                                    autoComplete="new-password"
                                    label={t("label:ArchObjectAddEditView.tunduk_street_id")}
                                    helperText={
                                      objectStore.errors[object.id!]?.tunduk_street_id ||
                                      (streetState.inputValue && streetState.inputValue.length > 0 && streetState.inputValue.length < 2
                                        ? "Минимум 2 символа"
                                        : "")
                                    }
                                    error={!!objectStore.errors[object.id!]?.tunduk_street_id}
                                    size={"small"}
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <>
                                          {streetState.isLoading ? (
                                            <CircularProgress color="inherit" size={20} />
                                          ) : null}
                                          {params.InputProps.endAdornment}
                                        </>
                                      ),
                                    }}
                                  />
                                );
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomTextField
                              label="№ здания"
                              value={object.tunduk_building_num}
                              onChange={(e) => (object.tunduk_building_num = e.target.value)}
                              id="id_f_building_number"
                              name="building_number"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomTextField
                              label="№ квартиры"
                              value={object.tunduk_flat_num}
                              onChange={(e) => (object.tunduk_flat_num = e.target.value)}
                              id="id_f_apartment_number"
                              name="apartment_number"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <CustomTextField
                              label="№ участка"
                              value={object.tunduk_uch_num}
                              onChange={(e) => (object.tunduk_uch_num = e.target.value)}
                              id="id_f_uch_number"
                              name="uch_number"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <CustomButton
                              variant="contained"
                              onClick={() => {
                                objectStore.SearchResults = [];
                                objectStore.findAddresses(index);
                                object.tunduk_building_id = null;
                                objectStore.updateObject(object.id!, 'open', true);
                              }}>
                              Найти адрес
                            </CustomButton>
                          </Grid>

                          <Grid item xs={6}>
                            <CustomButton
                              variant="contained"
                              onClick={() => {
                                objectStore.updateObject(object.id!, 'tunduk_district_id', 0);
                                objectStore.updateObject(object.id!, 'tunduk_address_unit_id', 0);
                                objectStore.updateObject(object.id!, 'tunduk_street_id', 0);
                                objectStore.updateObject(object.id!, 'districtId', 0);
                                objectStore.handleTundukStreetChange(index, null, index);
                                objectStore.clearTundukStreetState(index);
                                objectStore.initTundukStreetState(index);
                                objectStore.updateObject(object.id!, 'tunduk_building_id', 0);
                                object.tunduk_building_num = '';
                                object.tunduk_flat_num = '';
                                object.tunduk_uch_num = '';
                                objectStore.SearchResults = [];
                                objectStore.TundukResidentialAreas = [];
                                objectStore.updateObject(object.id!, 'open', false);
                                objectStore.updateObject(object.id!, 'address_street', "");
                                objectStore.updateObject(object.id!, 'is_manual', false);
                                objectStore.updateObject(object.id!, 'xCoord', null);
                                objectStore.updateObject(object.id!, 'yCoord', null);
                              }}>
                              Очистить
                            </CustomButton>
                          </Grid>
                          <Grid item xs={12}>
                            <Autocomplete
                              key={object.tunduk_building_id}
                              value={objectStore.SearchResults.find(x => x.id == object.tunduk_building_id)}
                              open={object.open}
                              onOpen={() => {
                                objectStore.updateObject(object.id!, 'open', true);
                              }}
                              onClose={() => {
                                objectStore.updateObject(object.id!, 'open', false);
                              }}
                              onChange={(event, newValue) => {
                                if (!newValue) {
                                  objectStore.updateObject(object.id!, 'address', '');
                                  return;
                                }
                                objectStore.updateObject(object.id!, 'tunduk_building_id', newValue?.id ?? 0);
                                let objectAddress = objectStore.SearchResults.find(x => x.id == newValue.id);
                                object.identifier = objectAddress?.code;
                                if (objectAddress?.address) {
                                  objectStore.updateObject(object.id!, 'address', objectAddress?.address ?? '');
                                }
                                objectStore.updateObject(object.id!, 'DarekSearchList', []);
                                objectStore.searchFromDarek(objectAddress?.code ?? "", object.id!);
                              }}
                              getOptionLabel={(x) => x.address || ""}
                              options={objectStore.SearchResults}
                              id="id_f_tunduk_building_id"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  autoComplete="new-password"
                                  label={t("label:ArchObjectAddEditView.tunduk_building_id")}
                                  helperText={objectStore.errors[object.id!]?.tunduk_building_id}
                                  error={!!objectStore.errors[object.id!]?.tunduk_building_id}
                                  size={"small"}
                                />
                              )}
                              blurOnSelect={true}
                              disableCloseOnSelect={false}
                              clearOnBlur={false}
                              handleHomeEndKeys={false}
                              PaperComponent={({ children, ...props }) => (
                                <Paper
                                  {...props}
                                  elevation={8}
                                  sx={{
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    mt: 1,
                                  }}
                                >
                                  {children}
                                </Paper>
                              )}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  {...props}
                                  sx={{
                                    padding: '12px 16px !important',
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:last-child': {
                                      borderBottom: 'none',
                                    },
                                    '&:hover': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    },
                                    '&[aria-selected="true"]': {
                                      backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                      fontWeight: 'bold',
                                    },
                                  }}
                                >
                                  {option.address}
                                </Box>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <div style={{ position: "relative" }}>
                              <TextField
                                fullWidth
                                label={t('label:steps.object.address')}
                                value={object.address_street || ''}
                                disabled={!object.is_manual}
                                onChange={(e) => {
                                  objectStore.updateObject(object.id!, "address_street", e.target.value);
                                  objectStore.setActiveObjectId(object.id!);
                                }}
                                onFocus={() => objectStore.setActiveObjectId(object.id!)}
                                error={!!objectStore.errors[object.id!]?.address_street}
                                helperText={objectStore.errors[object.id!]?.address_street}
                                required
                                size={"small"}
                              />
                              {objectStore.isListOpen && objectStore.activeObjectId === object.id && objectStore.searchResults.length > 0 && (
                                <Paper
                                  elevation={3}
                                  sx={{
                                    position: "absolute",
                                    top: "50px",
                                    left: 0,
                                    zIndex: 1000,
                                    padding: 1,
                                    borderRadius: 1,
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    width: "100%"
                                  }}
                                >
                                  <List>
                                    {objectStore.searchResults.map((result: any, index: number) => (
                                      <ListItem
                                        button
                                        key={index}
                                        onClick={() => objectStore.handleItemClick(object.id!, result)}
                                      >
                                        <ListItemText
                                          primary={result.name || t('label:steps.object.noName')}
                                          secondary={
                                            result.address_name
                                              ? `${result.address_name} ${result.adm_div?.find((d: any) => d.type === "district")?.name || ""}`
                                              : t('label:steps.object.noAddress')
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Paper>
                              )}
                            </div>
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <CustomCheckbox
                              value={object.is_manual}
                              onChange={(event) => {
                                objectStore.updateObject(object.id!, 'is_manual', event.target.value);
                              }}
                              name="id_f_is_manual"
                              label={"Ручной ввод"}
                              id="id_f_is_manual"
                            />
                          </Grid>
                          {/*<Grid item xs={12} md={6}>*/}
                          {/*  <div style={{ position: "relative" }}>*/}
                          {/*    <TextField*/}
                          {/*      fullWidth*/}
                          {/*      label={t('label:steps.object.street')}*/}
                          {/*      value={object.address_street || ''}*/}
                          {/*      onChange={(e) => {*/}
                          {/*        objectStore.updateObject(object.id!, "address_street", e.target.value);*/}
                          {/*        objectStore.setActiveObjectId(object.id!);*/}
                          {/*      }}*/}
                          {/*      onFocus={() => objectStore.setActiveObjectId(object.id!)}*/}
                          {/*      error={!!objectStore.errors[object.id!]?.address_street}*/}
                          {/*      helperText={objectStore.errors[object.id!]?.address_street}*/}
                          {/*      required*/}
                          {/*    />*/}
                          {/*    {objectStore.isListOpen && objectStore.activeObjectId === object.id && objectStore.searchResults.length > 0 && (*/}
                          {/*      <Paper*/}
                          {/*        elevation={3}*/}
                          {/*        sx={{*/}
                          {/*          position: "absolute",*/}
                          {/*          top: "50px",*/}
                          {/*          left: 0,*/}
                          {/*          zIndex: 1000,*/}
                          {/*          padding: 1,*/}
                          {/*          borderRadius: 1,*/}
                          {/*          maxHeight: "200px",*/}
                          {/*          overflowY: "auto",*/}
                          {/*          width: "100%"*/}
                          {/*        }}*/}
                          {/*      >*/}
                          {/*        <List>*/}
                          {/*          {objectStore.searchResults.map((result: any, index: number) => (*/}
                          {/*            <ListItem*/}
                          {/*              button*/}
                          {/*              key={index}*/}
                          {/*              onClick={() => objectStore.handleItemClick(object.id!, result)}*/}
                          {/*            >*/}
                          {/*              <ListItemText*/}
                          {/*                primary={result.name || t('label:steps.object.noName')}*/}
                          {/*                secondary={*/}
                          {/*                  result.address_name*/}
                          {/*                    ? `${result.address_name} ${result.adm_div?.find((d: any) => d.type === "district")?.name || ""}`*/}
                          {/*                    : t('label:steps.object.noAddress')*/}
                          {/*                }*/}
                          {/*              />*/}
                          {/*            </ListItem>*/}
                          {/*          ))}*/}
                          {/*        </List>*/}
                          {/*      </Paper>*/}
                          {/*    )}*/}
                          {/*  </div>*/}
                          {/*</Grid>*/}
                          {/*<Grid item xs={12} md={6}>*/}
                          {/*  <FormControl fullWidth error={!!objectStore.errors[object.id!]?.district}>*/}
                          {/*    <InputLabel>{t('label:steps.object.district')} *</InputLabel>*/}
                          {/*    <Select*/}
                          {/*      value={object.districtId || ''}*/}
                          {/*      onChange={(e) => objectStore.updateObject(object.id!, 'districtId', Number(e.target.value))}*/}
                          {/*      label={t('label:steps.object.district') + ' *'}*/}
                          {/*      disabled={objectStore.isLoadingDistricts}*/}
                          {/*    >*/}
                          {/*      <MenuItem value="">*/}
                          {/*        <em>{t('label:steps.object.selectDistrict')}</em>*/}
                          {/*      </MenuItem>*/}
                          {/*      {objectStore.districts.map(district => (*/}
                          {/*        <MenuItem key={district.id} value={district.id}>*/}
                          {/*          {district.name}*/}
                          {/*        </MenuItem>*/}
                          {/*      ))}*/}
                          {/*    </Select>*/}
                          {/*    {objectStore.errors[object.id!]?.district && (*/}
                          {/*      <FormHelperText>{objectStore.errors[object.id!]?.district}</FormHelperText>*/}
                          {/*    )}*/}
                          {/*  </FormControl>*/}
                          {/*</Grid>*/}

                          {/*<Grid item xs={12} md={6}>*/}
                          {/*  <TextField*/}
                          {/*    fullWidth*/}
                          {/*    label={t('label:steps.object.building')}*/}
                          {/*    value={object.address_building || ''}*/}
                          {/*    onChange={(e) => objectStore.updateObject(object.id!, 'address_building', e.target.value)}*/}
                          {/*    error={!!objectStore.errors[object.id!]?.address_building}*/}
                          {/*    helperText={objectStore.errors[object.id!]?.address_building}*/}
                          {/*    required*/}
                          {/*  />*/}
                          {/*</Grid>*/}

                          {/*<Grid item xs={12} md={6}>*/}
                          {/*  <TextField*/}
                          {/*    fullWidth*/}
                          {/*    label={t('label:steps.object.apartment')}*/}
                          {/*    value={object.address_flat || ''}*/}
                          {/*    onChange={(e) => objectStore.updateObject(object.id!, 'address_flat', e.target.value)}*/}
                          {/*    error={!!objectStore.errors[object.id!]?.address_flat}*/}
                          {/*    helperText={objectStore.errors[object.id!]?.address_flat}*/}
                          {/*  />*/}
                          {/*</Grid>*/}

                          {/*<Grid item xs={12}>*/}
                          {/*  <Autocomplete*/}
                          {/*    multiple*/}
                          {/*    options={objectStore.availableTags}*/}
                          {/*    getOptionLabel={(option) => option.name}*/}
                          {/*    value={objectStore.availableTags.filter(x => object.tags.includes(x.id))}*/}
                          {/*    onChange={(_, newValue) => objectStore.updateObjectTags(object.id!, newValue)}*/}
                          {/*    loading={objectStore.isLoadingTags}*/}
                          {/*    renderTags={(value, getTagProps) =>*/}
                          {/*      value.map((option, index) => (*/}
                          {/*        <Chip*/}
                          {/*          variant="outlined"*/}
                          {/*          label={option.name}*/}
                          {/*          {...getTagProps({ index })}*/}
                          {/*          icon={<LocalOffer />}*/}
                          {/*        />*/}
                          {/*      ))*/}
                          {/*    }*/}
                          {/*    renderInput={(params) => (*/}
                          {/*      <TextField*/}
                          {/*        {...params}*/}
                          {/*        label={t('label:steps.object.objectTags')}*/}
                          {/*        placeholder={t('label:steps.object.selectTags')}*/}
                          {/*        error={!!objectStore.errors[object.id!]?.tags}*/}
                          {/*        helperText={objectStore.errors[object.id!]?.tags || t('label:steps.object.tagsHelperText')}*/}
                          {/*        InputProps={{*/}
                          {/*          ...params.InputProps,*/}
                          {/*          startAdornment: (*/}
                          {/*            <>*/}
                          {/*              <InputAdornment position="start">*/}
                          {/*                <LocalOffer />*/}
                          {/*              </InputAdornment>*/}
                          {/*              {params.InputProps.startAdornment}*/}
                          {/*            </>*/}
                          {/*          ),*/}
                          {/*        }}*/}
                          {/*      />*/}
                          {/*    )}*/}
                          {/*  />*/}
                          {/*</Grid>*/}
                        </Grid>
                      </CardContent>
                    </Collapse>
                  </Card>
                )))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default ObjectStep;