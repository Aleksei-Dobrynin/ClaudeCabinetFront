import React, { FC, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import ClearIcon from "@mui/icons-material/Clear";
import DateTimeField from "components/DateTimeField";
import AutocompleteCustom from "components/Autocomplete";
import ArchObjectPopupForm from "features/ArchObject/ArchObjectAddEditView/popupForm2";
import CustomButton from "components/Button";
import { ArchObject } from "constants/ArchObject";
import { APPLICATION_CABINET_STATUSES } from "constants/constant";
import { MapContainer, Marker, Polygon, Popup, TileLayer, LayersControl } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import MaskedAutocomplete from "../../../components/MaskedAutocomplete";
import GisSearch from "./2gisSearch";
import AddIcon from "@mui/icons-material/Add";
import MtmLookup from "../../../components/mtmLookup";

type ApplicationTableProps = {
  children?: React.ReactNode;
};

const { BaseLayer } = LayersControl;

const BaseApplicationView: FC<ApplicationTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const mapRef = useRef(null);

  const updateWmsParams = (e) => {
    store.setCoords(e.latlng.lat, e.latlng.lng);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <form data-testid="ApplicationForm" id="ApplicationForm" autoComplete="off">
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="Application_TitleName">
                  {translate("Общие сведения")}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <AutocompleteCustom
                      value={store.rServiceId}
                      onChange={(event) => store.handleChange(event)}
                      name="rServiceId"
                      fieldNameDisplay={(Service) => `${Service.name} (${Service.day_count} р.дн.)` || ""}
                      disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data={store.services}
                      data-testid="id_f_Application_rServiceId"
                      id="id_f_Application_rServiceId"
                      label={translate("label:ApplicationAddEditView.rServiceId")}
                      helperText={store.errors.rServiceId}
                      error={!!store.errors.rServiceId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.workDescription}
                      onChange={(event) => store.handleChange(event)}
                      name="workDescription"
                      disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data-testid="id_f_Application_workDescription"
                      id='id_f_Application_workDescription'
                      label={translate('label:ApplicationAddEditView.workDescription')}
                      helperText={store.errors.workDescription}
                      multiline
                      rows={2}
                      error={!!store.errors.workDescription}
                    />
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Box sx={{ mb: 1 }}>Адрес объекта:</Box>
                    <Grid container spacing={2}>
                      <Grid item md={12} xs={12}>
                        <Grid container spacing={3}>
                          <Grid item md={6}>
                            <MapContainer
                              ref={(ref) => {
                                // if (ref && mapRef.current !== ref) {
                                //   mapRef.current = ref;
                                //   ref.on("click", updateWmsParams);
                                // }
                              }}
                              center={[42.87, 74.60] as LatLngExpression}
                              zoom={11}
                              style={{ height: "450px", width: "100%" }}>
                              <LayersControl position="topright">
                                <BaseLayer checked name="Схема">
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                </BaseLayer>
                                <BaseLayer name="Спутник">
                                  <TileLayer
                                    maxZoom={24}
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                    attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
                                  />
                                </BaseLayer>
                              </LayersControl>
                              {store.archObjects.map((obj, i) => {
                                if (obj.xCoord && obj.yCoord) {
                                  return <Marker key={obj.id} position={[obj.xCoord, obj.yCoord]}>
                                    <Popup>
                                      <div>
                                        <strong>Адрес:</strong> {obj.address}
                                      </div>
                                    </Popup>
                                  </Marker>
                                }
                              })}
                              {/* {store.archObjects.map((obj, i) => obj.geometry?.length > 0 &&
                                <Polygon positions={obj.geometry} color="blue">
                                  <Popup>
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                      <table style={{ width: "auto", borderCollapse: "collapse" }}>
                                        <thead>
                                          <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Адрес</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Код ЕНИ</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {obj.addressInfo?.map((item, index) => (
                                            <tr key={index}>
                                              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.address}</td>
                                              <td
                                                style={{ border: "1px solid #ddd", padding: "8px" }}>{item?.propcode}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </Popup>
                                </Polygon>)} */}


                              {store.archObjects.map((obj, i) => {
                                if (
                                  typeof obj.xCoord !== "number" ||
                                  typeof obj.yCoord !== "number" ||
                                  isNaN(obj.xCoord) ||
                                  isNaN(obj.yCoord) ||
                                  obj.xCoord === 0 ||
                                  obj.yCoord === 0
                                ) {
                                  return null;
                                }
                                return (
                                  <Marker position={[obj.xCoord, obj.yCoord]}>
                                    <Popup>
                                      <div>
                                        <strong>Адрес:</strong> {obj.address}
                                      </div>
                                    </Popup>
                                  </Marker>)
                              })}
                            </MapContainer>
                            <Box>
                              {(() => {
                                let obj = store.archObjects[store.archObjects.length - 1];
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
                                        {translate("common:openIn2GIS")}
                                      </a>}
                                    {/*{obj?.identifier == null && obj?.identifier?.length !== 0 &&*/}
                                    {/*  <a*/}
                                    {/*    style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}*/}
                                    {/*    target="_blank"*/}
                                    {/*    href={`/user/DarekView?eni=${obj?.identifier}`}>*/}
                                    {/*    {translate("common:openInDarekOnEni")}*/}
                                    {/*  </a>}*/}
                                    {/*{obj?.xcoordinate !== 0 && obj?.ycoordinate !== 0 &&*/}
                                    {/*  <a*/}
                                    {/*    style={{ textDecoration: "underline", color: "#5555b5", marginLeft: 10, fontWeight: 500 }}*/}
                                    {/*    target="_blank"*/}
                                    {/*    href={`/user/DarekView?coordinate=${obj?.xcoordinate},${obj?.ycoordinate}`}>*/}
                                    {/*    {translate("common:openInDarekOnLatLng")}*/}
                                    {/*  </a>}*/}
                                  </>
                                );
                              })()}
                            </Box>
                          </Grid>
                          <Grid item md={6}>
                            <Box display={"flex"}>
                              <Grid container spacing={2}>
                                {store.archObjects.map((obj, i) => <Grid item md={6} xs={12} sx={{ mb: 1 }}>
                                  <Paper elevation={1} sx={{ p: 2 }}>

                                    <Grid container spacing={1}>
                                      <Grid item md={12} xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                        <div style={{ maxHeight: 30, minHeight: 30 }}>Адрес {i + 1}
                                        </div>
                                        {i === 0 ? <></> : <Tooltip title={"Удалить"}>
                                          <IconButton sx={{ maxHeight: 30 }} size="small" onClick={() => store.deleteAddress(i)}>
                                            <ClearIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>}
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <MaskedAutocomplete
                                          data={obj.DarekSearchList ?? []}
                                          value={obj.identifier}
                                          label={translate("label:ArchObjectAddEditView.identifier")}
                                          name="darek_eni"
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                          onChange={(newValue: any) => {
                                            obj.identifier = newValue?.propcode;
                                            store.changed = true;
                                            if (newValue?.address) {
                                              store.handleChangearchObjects({
                                                target: {
                                                  value: newValue?.address,
                                                  name: "address"
                                                }
                                              }, i);
                                            }
                                            store.handleChangearchObjects({
                                              target: {
                                                value: [],
                                                name: "DarekSearchList"
                                              }
                                            }, i);
                                            store.searchFromDarek(newValue?.propcode ?? "", i);
                                          }}
                                          freeSolo={true}
                                          fieldNameDisplay={(option) => option?.propcode}
                                          onInputChange={(event, value) => {
                                            // store.identifier = '';
                                            store.changed = true;
                                            const propCode = value?.replaceAll("-", "");
                                            if (value.length > 12 && obj.identifier !== value && propCode !== obj.identifier) {
                                              obj.identifier = value;
                                              store.getSearchListFromDarek(value, i);
                                            }
                                          }}
                                          mask="0-00-00-0000-0000-00-000"
                                        />
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                          <Grid item xs={12} sm={12}>
                                            <GisSearch
                                              id="id_f_ArchObject_address"
                                              index={i}
                                              disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                              label={translate("label:ArchObjectAddEditView.address")}
                                              autocomplete={true}
                                            />
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <LookUp
                                          value={obj.districtId}
                                          // disabled={store.is_application_read_only}
                                          onChange={(event) => store.handleChangearchObjects(event, i)}
                                          name="districtId"
                                          data={store.districts}
                                          id="id_f_districtId"
                                          label={translate("label:ArchObjectAddEditView.districtId")}
                                          helperText={store.errors.errordistrictId}
                                          error={!!store.errors.errordistrictId}
                                        />
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <CustomTextField
                                          value={obj.name}
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                          onChange={(event) => store.handleChangearchObjects(event, i)}
                                          name="name"
                                          data-testid="id_f_ArchObject_name"
                                          id="id_f_ArchObject_name"
                                          label={translate("label:ArchObjectAddEditView.name")}
                                          helperText={store.errors.name}
                                          error={!!store.errors.name}
                                        />
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <CustomTextField
                                          value={obj.description}
                                          onChange={(event) => store.handleChangearchObjects(event, i)}
                                          name="description"
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                          data-testid="id_f_ArchObject_description"
                                          id="id_f_ArchObject_description"
                                          label={translate("label:ArchObjectAddEditView.description")}
                                          helperText={store.errors.description}
                                          error={!!store.errors.description}
                                        />
                                      </Grid>
                                      <Grid item md={12} xs={12}>
                                        <MtmLookup
                                          value={obj.tags}
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                          onChange={(name, value) => store.changeTags(value, i)}
                                          name="tags"
                                          data={store.allTags}
                                          label={translate("Тэги")}
                                        />
                                      </Grid>
                                      <Grid item md={6} xs={12}>
                                        <CustomTextField
                                          value={obj.xCoord}
                                          onChange={(event) => store.handleChangeCoords(event, i)}
                                          name="xCoord"
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                                          data-testid="id_f_ArchObject_xCoord"
                                          id="id_f_ArchObject_xCoord"
                                          label={translate("label:ArchObjectAddEditView.xCoord")}
                                          helperText={store.errors.xCoord}
                                          type="number"
                                          error={!!store.errors.xCoord}
                                        />
                                      </Grid>
                                      <Grid item md={6} xs={12}>
                                        <CustomTextField
                                          value={obj.yCoord}
                                          onChange={(event) => store.handleChangeCoords(event, i)}
                                          name="yCoord"
                                          disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                                          data-testid="id_f_ArchObject_yCoord"
                                          id="id_f_ArchObject_yCoord"
                                          type="number"
                                          label={translate("label:ArchObjectAddEditView.yCoord")}
                                          helperText={store.errors.yCoord}
                                          error={!!store.errors.yCoord}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                </Grid>)}
                              </Grid>
                              <Box sx={{ ml: 1, mt: 10 }}>
                                <Tooltip title={"Новый адрес"}>
                                  <IconButton
                                    disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}

                                    onClick={() => store.newAddressClicked()}>
                                    <AddIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/*<Grid item md={12} xs={12}>*/}
                      {/*  <Grid container spacing={2}>*/}
                      {/*    <ArchObjectPopupForm*/}
                      {/*      onBtnCancelClick={() => {*/}
                      {/*        store.onAddEditArchObject(false);*/}
                      {/*      }}*/}
                      {/*      data={store.editedArchObject}*/}
                      {/*      onSaveClick={(data: ArchObject) => {*/}
                      {/*        store.onAddEditArchObject(false);*/}
                      {/*        store.setArchObjectData(data);*/}
                      {/*      }}*/}
                      {/*      openPanel={store.openPanelArchObject}*/}
                      {/*    />*/}

                      {/*    {store.archObjects.map((obj, i) => <Grid item md={6} xs={12} sx={{ mb: 1 }}>*/}
                      {/*      <Paper elevation={1} sx={{ p: 2 }}>*/}

                      {/*        <Grid container spacing={1}>*/}
                      {/*          <Grid item md={12} xs={12} display={"flex"} justifyContent={"space-between"}*/}
                      {/*                alignItems={"center"}>*/}
                      {/*            <div style={{ maxHeight: 30, minHeight: 30 }}>Адрес {i + 1}*/}
                      {/*            </div>*/}
                      {/*            <div style={{ display: "flex", alignItems: "center" }}>*/}
                      {/*              {i === 0 ? <></> : <Tooltip title={"Удалить"}>*/}
                      {/*                <IconButton*/}
                      {/*                  disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}*/}
                      {/*                  sx={{ maxHeight: 30 }} size="small" onClick={() => store.deleteAddress(i)}>*/}
                      {/*                  <ClearIcon fontSize="small" />*/}
                      {/*                </IconButton>*/}
                      {/*              </Tooltip>}*/}
                      {/*            </div>*/}
                      {/*          </Grid>*/}
                      {/*          <Grid item md={12} xs={12}>*/}

                      {/*            <Typography sx={{ fontSize: "16px", fontWeight: "bold", mt: 1, mb: 1 }}>*/}
                      {/*              {obj.name} {obj.address}*/}
                      {/*            </Typography>*/}
                      {/*            <Box sx={{ mt: 2, mb: 2 }}>*/}
                      {/*              {store.tags.filter(x => obj.tags.includes(x.id))?.map(tag => (*/}
                      {/*                <Chip sx={{ mr: 1, mb: 1 }} size="small" label={tag.name} />))}*/}
                      {/*            </Box>*/}

                      {/*            <CustomButton*/}
                      {/*              disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}*/}
                      {/*              variant="contained" onClick={() => store.onAddEditArchObject(true, obj)}>*/}
                      {/*              Редактировать адрес*/}
                      {/*            </CustomButton>*/}
                      {/*          </Grid>*/}
                      {/*        </Grid>*/}
                      {/*      </Paper>*/}
                      {/*    </Grid>)}*/}
                      {/*    <Grid item md={6} xs={12} sx={{ mb: 1 }}>*/}
                      {/*      <CustomButton*/}
                      {/*        disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}*/}
                      {/*        variant="contained" onClick={() => store.onAddEditArchObject(true, null)}>*/}
                      {/*        Добавить адрес*/}
                      {/*      </CustomButton>*/}
                      {/*    </Grid>*/}
                      {/*  </Grid>*/}
                      {/*</Grid>*/}
                    </Grid>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.comment}
                      onChange={(event) => store.handleChange(event)}
                      name="comment"
                      disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                      data-testid="id_f_Application_comment"
                      id="id_f_Application_comment"
                      label={translate("label:ApplicationAddEditView.comment")}
                      helperText={store.errors.comment}
                      error={!!store.errors.comment}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
});

export default BaseApplicationView;
