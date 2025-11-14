import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../ApplicationCustomerListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type ApplicationCustomerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<ApplicationCustomerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadApplicationCustomers();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'director',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.director"),
                },
                {
                    field: 'okpo',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.okpo"),
                },
                {
                    field: 'payment_account',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.payment_account"),
                },
                {
                    field: 'postal_code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.postal_code"),
                },
                {
                    field: 'ugns',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.ugns"),
                },
                {
                    field: 'bank',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.bank"),
                },
                {
                    field: 'bik',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.bik"),
                },
                {
                    field: 'registration_number',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.registration_number"),
                },
                {
                    field: 'identity_document_type_id',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.identity_document_type_id"),
                },
                {
                    field: 'organization_type_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.organization_type_id"),
                },
                {
                    field: 'pin',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.pin"),
                },
                {
                    field: 'application_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.application_id"),
                },
                {
                    field: 'is_organization',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.is_organization"),
                },
                {
                    field: 'full_name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.full_name"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.updated_by"),
                },
                {
                    field: 'address',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_customerListView.address"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="ApplicationCustomer_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:ApplicationCustomerAddEditView.entityTitle")}</h3>
          </Box>
          <Divider />
          <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
            {columns.map((col) => {
              const id = "id_c_title_EmployeeContact_" + col.field;
              if (col.width == null) {
                return (
                  <Grid id={id} item xs sx={{ m: 1 }}>
                    <strong> {col.headerName}</strong>
                  </Grid>
                );
              } else
                return (
                  <Grid id={id} item xs={null} sx={{ m: 1 }}>
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
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={style}
                  spacing={1}
                  id="id_EmployeeContact_row"
                >
                  {columns.map((col) => {
                    const id = "id_EmployeeContact_" + col.field + "_value";
                    if (col.width == null) {
                      return (
                        <Grid item xs id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                    } else
                      return (
                        <Grid item xs={col.width} id={id} sx={{ m: 1 }}>
                          {entity[col.field]}
                        </Grid>
                      );
                  })}
                  <Grid item display={"flex"} justifyContent={"center"} xs={1}>
                    {storeList.isEdit === false && (
                      <>
                        <IconButton
                          id="id_EmployeeContactEditButton"
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
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteApplicationCustomer(entity.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </>
            );
          })}

          {storeList.isEdit ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.director}
                      onChange={(event) => store.handleChange(event)}
                      name="director"
                      data-testid="id_f_ApplicationCustomer_director"
                      id='id_f_ApplicationCustomer_director'
                      label={translate('label:ApplicationCustomerAddEditView.director')}
                      helperText={store.errors.director}
                      error={!!store.errors.director}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.okpo}
                      onChange={(event) => store.handleChange(event)}
                      name="okpo"
                      data-testid="id_f_ApplicationCustomer_okpo"
                      id='id_f_ApplicationCustomer_okpo'
                      label={translate('label:ApplicationCustomerAddEditView.okpo')}
                      helperText={store.errors.okpo}
                      error={!!store.errors.okpo}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.paymentAccount}
                      onChange={(event) => store.handleChange(event)}
                      name="paymentAccount"
                      data-testid="id_f_ApplicationCustomer_paymentAccount"
                      id='id_f_ApplicationCustomer_paymentAccount'
                      label={translate('label:ApplicationCustomerAddEditView.paymentAccount')}
                      helperText={store.errors.paymentAccount}
                      error={!!store.errors.paymentAccount}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      data-testid="id_f_ApplicationCustomer_postalCode"
                      id='id_f_ApplicationCustomer_postalCode'
                      label={translate('label:ApplicationCustomerAddEditView.postalCode')}
                      helperText={store.errors.postalCode}
                      error={!!store.errors.postalCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ugns}
                      onChange={(event) => store.handleChange(event)}
                      name="ugns"
                      data-testid="id_f_ApplicationCustomer_ugns"
                      id='id_f_ApplicationCustomer_ugns'
                      label={translate('label:ApplicationCustomerAddEditView.ugns')}
                      helperText={store.errors.ugns}
                      error={!!store.errors.ugns}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bank}
                      onChange={(event) => store.handleChange(event)}
                      name="bank"
                      data-testid="id_f_ApplicationCustomer_bank"
                      id='id_f_ApplicationCustomer_bank'
                      label={translate('label:ApplicationCustomerAddEditView.bank')}
                      helperText={store.errors.bank}
                      error={!!store.errors.bank}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.bik}
                      onChange={(event) => store.handleChange(event)}
                      name="bik"
                      data-testid="id_f_ApplicationCustomer_bik"
                      id='id_f_ApplicationCustomer_bik'
                      label={translate('label:ApplicationCustomerAddEditView.bik')}
                      helperText={store.errors.bik}
                      error={!!store.errors.bik}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.registrationNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="registrationNumber"
                      data-testid="id_f_ApplicationCustomer_registrationNumber"
                      id='id_f_ApplicationCustomer_registrationNumber'
                      label={translate('label:ApplicationCustomerAddEditView.registrationNumber')}
                      helperText={store.errors.registrationNumber}
                      error={!!store.errors.registrationNumber}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.identityDocumentTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="identityDocumentTypeId"
                      data-testid="id_f_ApplicationCustomer_identityDocumentTypeId"
                      id='id_f_ApplicationCustomer_identityDocumentTypeId'
                      label={translate('label:ApplicationCustomerAddEditView.identityDocumentTypeId')}
                      helperText={store.errors.identityDocumentTypeId}
                      error={!!store.errors.identityDocumentTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.organizationTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="organizationTypeId"
                      data={store.organizationTypes}
                      id='id_f_ApplicationCustomer_organizationTypeId'
                      label={translate('label:ApplicationCustomerAddEditView.organizationTypeId')}
                      helperText={store.errors.organizationTypeId}
                      error={!!store.errors.organizationTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_ApplicationCustomer_pin"
                      id='id_f_ApplicationCustomer_pin'
                      label={translate('label:ApplicationCustomerAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomCheckbox
                      value={store.isOrganization}
                      onChange={(event) => store.handleChange(event)}
                      name="isOrganization"
                      label={translate('label:ApplicationCustomerAddEditView.isOrganization')}
                      id='id_f_ApplicationCustomer_isOrganization'
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.fullName}
                      onChange={(event) => store.handleChange(event)}
                      name="fullName"
                      data-testid="id_f_ApplicationCustomer_fullName"
                      id='id_f_ApplicationCustomer_fullName'
                      label={translate('label:ApplicationCustomerAddEditView.fullName')}
                      helperText={store.errors.fullName}
                      error={!!store.errors.fullName}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_ApplicationCustomer_address"
                      id='id_f_ApplicationCustomer_address'
                      label={translate('label:ApplicationCustomerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationCustomerSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadApplicationCustomers();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationCustomerCancelButton"
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
                id="id_ApplicationCustomerAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  store.doLoad(0);
                  // store.project_id = props.mainId;
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
