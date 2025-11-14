import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../CustomerListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type CustomerProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  mainId: number;
};

const FastInputView: FC<CustomerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.mainId !== 0 && storeList.mainId !== props.mainId) {
      storeList.mainId = props.mainId;
      storeList.loadCustomers();
    }
  }, [props.mainId]);

  const columns = [
    {
                    field: 'pin',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.pin"),
                },
                {
                    field: 'okpo',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.okpo"),
                },
                {
                    field: 'postal_code',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.postal_code"),
                },
                {
                    field: 'ugns',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.ugns"),
                },
                {
                    field: 'reg_number',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.reg_number"),
                },
                {
                    field: 'organization_type_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.organization_type_id"),
                },
                {
                    field: 'created_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.created_at"),
                },
                {
                    field: 'updated_at',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.updated_at"),
                },
                {
                    field: 'created_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.created_by"),
                },
                {
                    field: 'updated_by',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.updated_by"),
                },
                {
                    field: 'name',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.name"),
                },
                {
                    field: 'address',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.address"),
                },
                {
                    field: 'director',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.director"),
                },
                {
                    field: 'nomer',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:customerListView.nomer"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="Customer_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:CustomerAddEditView.entityTitle")}</h3>
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
                            // store.doLoad(entity.id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteCustomer(entity.id)}
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
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      name="pin"
                      data-testid="id_f_Customer_pin"
                      id='id_f_Customer_pin'
                      label={translate('label:CustomerAddEditView.pin')}
                      helperText={store.errors.pin}
                      error={!!store.errors.pin}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.okpo}
                      onChange={(event) => store.handleChange(event)}
                      name="okpo"
                      data-testid="id_f_Customer_okpo"
                      id='id_f_Customer_okpo'
                      label={translate('label:CustomerAddEditView.okpo')}
                      helperText={store.errors.okpo}
                      error={!!store.errors.okpo}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.postalCode}
                      onChange={(event) => store.handleChange(event)}
                      name="postalCode"
                      data-testid="id_f_Customer_postalCode"
                      id='id_f_Customer_postalCode'
                      label={translate('label:CustomerAddEditView.postalCode')}
                      helperText={store.errors.postalCode}
                      error={!!store.errors.postalCode}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.ugns}
                      onChange={(event) => store.handleChange(event)}
                      name="ugns"
                      data-testid="id_f_Customer_ugns"
                      id='id_f_Customer_ugns'
                      label={translate('label:CustomerAddEditView.ugns')}
                      helperText={store.errors.ugns}
                      error={!!store.errors.ugns}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.regNumber}
                      onChange={(event) => store.handleChange(event)}
                      name="regNumber"
                      data-testid="id_f_Customer_regNumber"
                      id='id_f_Customer_regNumber'
                      label={translate('label:CustomerAddEditView.regNumber')}
                      helperText={store.errors.regNumber}
                      error={!!store.errors.regNumber}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.organizationTypeId}
                      onChange={(event) => store.handleChange(event)}
                      name="organizationTypeId"
                      data={store.organizationTypes}
                      id='id_f_Customer_organizationTypeId'
                      label={translate('label:CustomerAddEditView.organizationTypeId')}
                      helperText={store.errors.organizationTypeId}
                      error={!!store.errors.organizationTypeId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_Customer_name"
                      id='id_f_Customer_name'
                      label={translate('label:CustomerAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_Customer_address"
                      id='id_f_Customer_address'
                      label={translate('label:CustomerAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.director}
                      onChange={(event) => store.handleChange(event)}
                      name="director"
                      data-testid="id_f_Customer_director"
                      id='id_f_Customer_director'
                      label={translate('label:CustomerAddEditView.director')}
                      helperText={store.errors.director}
                      error={!!store.errors.director}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_CustomerSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadCustomers();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_CustomerCancelButton"
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
                id="id_CustomerAddButton"
                onClick={() => {
                  storeList.setFastInputIsEdit(true);
                  // store.doLoad(0);
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
