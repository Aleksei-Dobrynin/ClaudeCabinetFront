import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../ApplicationPayerListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type ApplicationPayerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<ApplicationPayerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadApplicationPayers();
    }
  }, [props.mainId]);

  const columns = [
    {
      field: 'okpo',
      width: null,
      headerName: translate("label:ApplicationPayerListView.okpo"),
    },
    {
      field: 'postal_code',
      width: null,
      headerName: translate("label:ApplicationPayerListView.postal_code"),
    },
    {
      field: 'ugns',
      width: null,
      headerName: translate("label:ApplicationPayerListView.ugns"),
    },
    {
      field: 'reg_number',
      width: null,
      headerName: translate("label:ApplicationPayerListView.reg_number"),
    },
    {
      field: 'last_name',
      width: null,
      headerName: translate("label:ApplicationPayerListView.last_name"),
    },
    {
      field: 'first_name',
      width: null,
      headerName: translate("label:ApplicationPayerListView.first_name"),
    },
    {
      field: 'second_name',
      width: null,
      headerName: translate("label:ApplicationPayerListView.second_name"),
    },
    {
      field: 'application_idNavName',
      width: null,
      headerName: translate("label:ApplicationPayerListView.application_id"),
    },
    {
      field: 'type_organization_idNavName',
      width: null,
      headerName: translate("label:ApplicationPayerListView.type_organization_id"),
    },
    {
      field: 'created_at',
      width: null,
      headerName: translate("label:ApplicationPayerListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null,
      headerName: translate("label:ApplicationPayerListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null,
      headerName: translate("label:ApplicationPayerListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null,
      headerName: translate("label:ApplicationPayerListView.updated_by"),
    },
    {
      field: 'full_name',
      width: null,
      headerName: translate("label:ApplicationPayerListView.full_name"),
    },
    {
      field: 'address',
      width: null,
      headerName: translate("label:ApplicationPayerListView.address"),
    },
    {
      field: 'director',
      width: null,
      headerName: translate("label:ApplicationPayerListView.director"),
    },
    {
      field: 'pin',
      width: null,
      headerName: translate("label:ApplicationPayerListView.pin"),
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="ApplicationPayer_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:ApplicationPayerAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_ApplicationPayer_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }} key={col.field}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }} key={col.field}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
            })}
            <Grid item xs={1}></Grid>
          </Grid>
          <Divider />

          {storeList.data.map((entity) => {
            const style = { backgroundColor: entity.id === store.id && "#F0F0F0" };
            return (
              <div key={entity.id}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_ApplicationPayer_row"
                >
                  {columns.map((col) => {
                    const id = "id_ApplicationPayer_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }} key={col.field}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }} key={col.field}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_ApplicationPayerEditButton"
                          name="edit_button"
                          style={{ margin: 0, marginRight: 5, padding: 0 }}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_ApplicationPayerDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteApplicationPayer(entity.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </div>
            );
          })}

          {storeList.isEdit ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.okpo}
                  onChange={(event) => store.handleChange(event)}
                  name="okpo"
                  data-testid="id_f_ApplicationPayer_okpo"
                  id='id_f_ApplicationPayer_okpo'
                  label={translate('label:ApplicationPayerAddEditView.okpo')}
                  helperText={store.errors.okpo}
                  error={!!store.errors.okpo}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.postalCode}
                  onChange={(event) => store.handleChange(event)}
                  name="postalCode"
                  data-testid="id_f_ApplicationPayer_postalCode"
                  id='id_f_ApplicationPayer_postalCode'
                  label={translate('label:ApplicationPayerAddEditView.postalCode')}
                  helperText={store.errors.postalCode}
                  error={!!store.errors.postalCode}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.ugns}
                  onChange={(event) => store.handleChange(event)}
                  name="ugns"
                  data-testid="id_f_ApplicationPayer_ugns"
                  id='id_f_ApplicationPayer_ugns'
                  label={translate('label:ApplicationPayerAddEditView.ugns')}
                  helperText={store.errors.ugns}
                  error={!!store.errors.ugns}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.regNumber}
                  onChange={(event) => store.handleChange(event)}
                  name="regNumber"
                  data-testid="id_f_ApplicationPayer_regNumber"
                  id='id_f_ApplicationPayer_regNumber'
                  label={translate('label:ApplicationPayerAddEditView.regNumber')}
                  helperText={store.errors.regNumber}
                  error={!!store.errors.regNumber}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.lastName}
                  onChange={(event) => store.handleChange(event)}
                  name="lastName"
                  data-testid="id_f_ApplicationPayer_lastName"
                  id='id_f_ApplicationPayer_lastName'
                  label={translate('label:ApplicationPayerAddEditView.lastName')}
                  helperText={store.errors.lastName}
                  error={!!store.errors.lastName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.firstName}
                  onChange={(event) => store.handleChange(event)}
                  name="firstName"
                  data-testid="id_f_ApplicationPayer_firstName"
                  id='id_f_ApplicationPayer_firstName'
                  label={translate('label:ApplicationPayerAddEditView.firstName')}
                  helperText={store.errors.firstName}
                  error={!!store.errors.firstName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.secondName}
                  onChange={(event) => store.handleChange(event)}
                  name="secondName"
                  data-testid="id_f_ApplicationPayer_secondName"
                  id='id_f_ApplicationPayer_secondName'
                  label={translate('label:ApplicationPayerAddEditView.secondName')}
                  helperText={store.errors.secondName}
                  error={!!store.errors.secondName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.typeOrganizationId}
                  onChange={(event) => store.handleChange(event)}
                  name="typeOrganizationId"
                  data={store.organizationTypes}
                  id='id_f_ApplicationPayer_typeOrganizationId'
                  label={translate('label:ApplicationPayerAddEditView.typeOrganizationId')}
                  helperText={store.errors.typeOrganizationId}
                  error={!!store.errors.typeOrganizationId}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.fullName}
                  onChange={(event) => store.handleChange(event)}
                  name="fullName"
                  data-testid="id_f_ApplicationPayer_fullName"
                  id='id_f_ApplicationPayer_fullName'
                  label={translate('label:ApplicationPayerAddEditView.fullName')}
                  helperText={store.errors.fullName}
                  error={!!store.errors.fullName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.address}
                  onChange={(event) => store.handleChange(event)}
                  name="address"
                  data-testid="id_f_ApplicationPayer_address"
                  id='id_f_ApplicationPayer_address'
                  label={translate('label:ApplicationPayerAddEditView.address')}
                  helperText={store.errors.address}
                  error={!!store.errors.address}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.director}
                  onChange={(event) => store.handleChange(event)}
                  name="director"
                  data-testid="id_f_ApplicationPayer_director"
                  id='id_f_ApplicationPayer_director'
                  label={translate('label:ApplicationPayerAddEditView.director')}
                  helperText={store.errors.director}
                  error={!!store.errors.director}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.pin}
                  onChange={(event) => store.handleChange(event)}
                  name="pin"
                  data-testid="id_f_ApplicationPayer_pin"
                  id='id_f_ApplicationPayer_pin'
                  label={translate('label:ApplicationPayerAddEditView.pin')}
                  helperText={store.errors.pin}
                  error={!!store.errors.pin}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationPayerSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadApplicationPayers();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationPayerCancelButton"
                  onClick={() => {
                    storeList.setFastInputIsEdit(false);
                    store.clearStore();
                  }}
                >
                  {translate("common:cancel")}
                </CustomButton>
              </Grid>
            </Grid>
          ) : (
            <Grid item display={"flex"} justifyContent={"flex-end"} sx={{ mt: 2 }}>
              <CustomButton
                variant="contained"
                size="small"
                id="id_ApplicationPayerAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                }}
              >
                {translate("common:add")}
              </CustomButton>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
});

export default FastInputView;