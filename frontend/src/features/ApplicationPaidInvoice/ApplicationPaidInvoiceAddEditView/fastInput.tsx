import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../ApplicationPaidInvoiceListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";

type ApplicationPaidInvoiceProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
  customerId: number;
};

const FastInputView: FC<ApplicationPaidInvoiceProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.customerId !== 0 && storeList.customerId !== props.customerId) {
      storeList.customerId = props.customerId;
      storeList.loadApplicationPaidInvoices();
    }
  }, [props.customerId]);

  const columns = [
    {
                    field: 'application_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.application_id"),
                },
                {
                    field: 'customer_idNavName',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.customer_id"),
                },
                {
                    field: 'date',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.date"),
                },
                {
                    field: 'payment_identifier',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.payment_identifier"),
                },
                {
                    field: 'sum',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.sum"),
                },
                {
                    field: 'description',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.description"),
                },
                {
                    field: 'additional',
                    width: null, //or number from 1 to 12
                    headerName: translate("label:application_paid_invoiceListView.additional"),
                },
                
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="ApplicationPaidInvoice_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:ApplicationPaidInvoiceAddEditView.entityTitle")}</h3>
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
                          onClick={() => storeList.deleteApplicationPaidInvoice(entity.id)}
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
                    <LookUp
                      value={store.customerId}
                      onChange={(event) => store.handleChange(event)}
                      name="customerId"
                      data={store.customers}
                      id='id_f_ApplicationPaidInvoice_customerId'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.customerId')}
                      helperText={store.errors.customerId}
                      error={!!store.errors.customerId}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <DateTimeField
                      value={store.date}
                      onChange={(event) => store.handleChange(event)}
                      name="date"
                      id='id_f_ApplicationPaidInvoice_date'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.date')}
                      helperText={store.errors.date}
                      error={!!store.errors.date}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.paymentIdentifier}
                      onChange={(event) => store.handleChange(event)}
                      name="paymentIdentifier"
                      data-testid="id_f_ApplicationPaidInvoice_paymentIdentifier"
                      id='id_f_ApplicationPaidInvoice_paymentIdentifier'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.paymentIdentifier')}
                      helperText={store.errors.paymentIdentifier}
                      error={!!store.errors.paymentIdentifier}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.sum}
                      onChange={(event) => store.handleChange(event)}
                      name="sum"
                      data-testid="id_f_ApplicationPaidInvoice_sum"
                      id='id_f_ApplicationPaidInvoice_sum'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.sum')}
                      helperText={store.errors.sum}
                      error={!!store.errors.sum}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_ApplicationPaidInvoice_description"
                      id='id_f_ApplicationPaidInvoice_description'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.additional}
                      onChange={(event) => store.handleChange(event)}
                      name="additional"
                      data-testid="id_f_ApplicationPaidInvoice_additional"
                      id='id_f_ApplicationPaidInvoice_additional'
                      label={translate('label:ApplicationPaidInvoiceAddEditView.additional')}
                      helperText={store.errors.additional}
                      error={!!store.errors.additional}
                    />
                  </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationPaidInvoiceSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((id: number) => {
                      storeList.setFastInputIsEdit(false);
                      storeList.loadApplicationPaidInvoices();
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  id="id_ApplicationPaidInvoiceCancelButton"
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
                id="id_ApplicationPaidInvoiceAddButton"
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
