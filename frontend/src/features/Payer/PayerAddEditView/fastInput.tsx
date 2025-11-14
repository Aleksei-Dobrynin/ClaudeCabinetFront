import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../PayerListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type PayerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<PayerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadPayers();
    }
  }, [props.mainId]);

  const columns = [
    {
      field: 'okpo',
      width: null,
      headerName: translate("label:PayerListView.okpo"),
    },
    {
      field: 'postal_code',
      width: null,
      headerName: translate("label:PayerListView.postal_code"),
    },
    {
      field: 'ugns',
      width: null,
      headerName: translate("label:PayerListView.ugns"),
    },
    {
      field: 'reg_number',
      width: null,
      headerName: translate("label:PayerListView.reg_number"),
    },
    {
      field: 'type_organization_idNavName',
      width: null,
      headerName: translate("label:PayerListView.type_organization_id"),
    },
    {
      field: 'last_name',
      width: null,
      headerName: translate("label:PayerListView.last_name"),
    },
    {
      field: 'first_name',
      width: null,
      headerName: translate("label:PayerListView.first_name"),
    },
    {
      field: 'second_name',
      width: null,
      headerName: translate("label:PayerListView.second_name"),
    },
    {
      field: 'created_at',
      width: null,
      headerName: translate("label:PayerListView.created_at"),
    },
    {
      field: 'updated_at',
      width: null,
      headerName: translate("label:PayerListView.updated_at"),
    },
    {
      field: 'created_by',
      width: null,
      headerName: translate("label:PayerListView.created_by"),
    },
    {
      field: 'updated_by',
      width: null,
      headerName: translate("label:PayerListView.updated_by"),
    },
    {
      field: 'full_name',
      width: null,
      headerName: translate("label:PayerListView.full_name"),
    },
    {
      field: 'address',
      width: null,
      headerName: translate("label:PayerListView.address"),
    },
    {
      field: 'director',
      width: null,
      headerName: translate("label:PayerListView.director"),
    },
    {
      field: 'pin',
      width: null,
      headerName: translate("label:PayerListView.pin"),
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="Payer_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:PayerAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_PayerContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid key={id} id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid key={id} id={id} item xs={col.width} sx={{ m: 1 }}>
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
                  id="id_PayerContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_PayerContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid key={id} item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid key={id} item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_PayerContactEditButton"
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
                          id="id_PayerContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deletePayer(entity.id)}
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
                  data-testid="id_f_Payer_okpo"
                  id='id_f_Payer_okpo'
                  label={translate('label:PayerAddEditView.okpo')}
                  helperText={store.errors.okpo}
                  error={!!store.errors.okpo}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.postalCode}
                  onChange={(event) => store.handleChange(event)}
                  name="postalCode"
                  data-testid="id_f_Payer_postalCode"
                  id='id_f_Payer_postalCode'
                  label={translate('label:PayerAddEditView.postalCode')}
                  helperText={store.errors.postalCode}
                  error={!!store.errors.postalCode}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.ugns}
                  onChange={(event) => store.handleChange(event)}
                  name="ugns"
                  data-testid="id_f_Payer_ugns"
                  id='id_f_Payer_ugns'
                  label={translate('label:PayerAddEditView.ugns')}
                  helperText={store.errors.ugns}
                  error={!!store.errors.ugns}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.regNumber}
                  onChange={(event) => store.handleChange(event)}
                  name="regNumber"
                  data-testid="id_f_Payer_regNumber"
                  id='id_f_Payer_regNumber'
                  label={translate('label:PayerAddEditView.regNumber')}
                  helperText={store.errors.regNumber}
                  error={!!store.errors.regNumber}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <LookUp
                  value={store.typeOrganizationId}
                  onChange={(event) => store.handleChange(event)}
                  name="typeOrganizationId"
                  data={store.organizationTypes}
                  id='id_f_Payer_typeOrganizationId'
                  label={translate('label:PayerAddEditView.typeOrganizationId')}
                  helperText={store.errors.typeOrganizationId}
                  error={!!store.errors.typeOrganizationId}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.lastName}
                  onChange={(event) => store.handleChange(event)}
                  name="lastName"
                  data-testid="id_f_Payer_lastName"
                  id='id_f_Payer_lastName'
                  label={translate('label:PayerAddEditView.lastName')}
                  helperText={store.errors.lastName}
                  error={!!store.errors.lastName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.firstName}
                  onChange={(event) => store.handleChange(event)}
                  name="firstName"
                  data-testid="id_f_Payer_firstName"
                  id='id_f_Payer_firstName'
                  label={translate('label:PayerAddEditView.firstName')}
                  helperText={store.errors.firstName}
                  error={!!store.errors.firstName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.secondName}
                  onChange={(event) => store.handleChange(event)}
                  name="secondName"
                  data-testid="id_f_Payer_secondName"
                  id='id_f_Payer_secondName'
                  label={translate('label:PayerAddEditView.secondName')}
                  helperText={store.errors.secondName}
                  error={!!store.errors.secondName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.fullName}
                  onChange={(event) => store.handleChange(event)}
                  name="fullName"
                  data-testid="id_f_Payer_fullName"
                  id='id_f_Payer_fullName'
                  label={translate('label:PayerAddEditView.fullName')}
                  helperText={store.errors.fullName}
                  error={!!store.errors.fullName}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.address}
                  onChange={(event) => store.handleChange(event)}
                  name="address"
                  data-testid="id_f_Payer_address"
                  id='id_f_Payer_address'
                  label={translate('label:PayerAddEditView.address')}
                  helperText={store.errors.address}
                  error={!!store.errors.address}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.director}
                  onChange={(event) => store.handleChange(event)}
                  name="director"
                  data-testid="id_f_Payer_director"
                  id='id_f_Payer_director'
                  label={translate('label:PayerAddEditView.director')}
                  helperText={store.errors.director}
                  error={!!store.errors.director}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomTextField
                  value={store.pin}
                  onChange={(event) => store.handleChange(event)}
                  name="pin"
                  data-testid="id_f_Payer_pin"
                  id='id_f_Payer_pin'
                  label={translate('label:PayerAddEditView.pin')}
                  helperText={store.errors.pin}
                  error={!!store.errors.pin}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_PayerSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadPayers();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_PayerCancelButton"
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
                id="id_PayerAddButton"
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