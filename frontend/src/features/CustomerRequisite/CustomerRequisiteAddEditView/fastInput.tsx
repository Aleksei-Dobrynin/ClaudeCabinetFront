import React, { FC, useEffect } from "react";
import { Card, CardContent, Divider, Paper, Grid, Container, IconButton, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import store from "./store";
import { observer } from "mobx-react";
import LookUp from "components/LookUp";
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";
import storeList from "./../CustomerRequisiteListView/store";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "components/Button";
import { CustomerRequisite } from "constants/CustomerRequisite";

type CustomerRequisiteProps = {
  data: CustomerRequisite[];
  setData: (data: CustomerRequisite[]) => void
  disabled: boolean;
};

const FastInputView: FC<CustomerRequisiteProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const columns = [
    {
      field: 'paymentAccount',
      width: null, //or number from 1 to 12
      headerName: translate("label:CustomerRequisiteListView.paymentAccount"),
    },
    {
      field: 'bank',
      width: null, //or number from 1 to 12
      headerName: translate("label:CustomerRequisiteListView.bank"),
    },
    {
      field: 'bik',
      width: null, //or number from 1 to 12
      headerName: translate("label:CustomerRequisiteListView.bik"),
    },
  ];

  return (
    <Container>
      <Card component={Paper} elevation={5}>
        <CardContent>
          <Box id="CustomerRequisite_TitleName" sx={{ m: 1 }}>
            <h3>{translate("label:CustomerRequisiteAddEditView.entityTitle")}</h3>
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

          {props.data.map((entity, i) => {
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
                          disabled={props.disabled}
                          onClick={() => {
                            storeList.setFastInputIsEdit(true);
                            store.setData(entity);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          id="id_EmployeeContactDeleteButton"
                          disabled={props.disabled}
                          name="delete_button"
                          style={{ margin: 0, padding: 0 }}
                          onClick={() => storeList.deleteCustomerRequisite(entity.id, () => {
                            const data = props.data
                            data.splice(i, 1);
                            props.setData(data)
                          })}
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

              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.paymentAccount}
                  onChange={(event) => store.handleChange(event)}
                  name="paymentAccount"
                  disabled={props.disabled}
                  data-testid="id_f_CustomerRequisite_paymentAccount"
                  id='id_f_CustomerRequisite_paymentAccount'
                  label={translate('label:CustomerRequisiteAddEditView.paymentAccount')}
                  helperText={store.errors.paymentAccount}
                  error={!!store.errors.paymentAccount}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.bank}
                  onChange={(event) => store.handleChange(event)}
                  name="bank"
                  disabled={props.disabled}
                  data-testid="id_f_CustomerRequisite_bank"
                  id='id_f_CustomerRequisite_bank'
                  label={translate('label:CustomerRequisiteAddEditView.bank')}
                  helperText={store.errors.bank}
                  error={!!store.errors.bank}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.bik}
                  onChange={(event) => store.handleChange(event)}
                  name="bik"
                  data-testid="id_f_CustomerRequisite_bik"
                  disabled={props.disabled}
                  id='id_f_CustomerRequisite_bik'
                  label={translate('label:CustomerRequisiteAddEditView.bik')}
                  helperText={store.errors.bik}
                  error={!!store.errors.bik}
                />
              </Grid>
              <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <CustomButton
                  variant="contained"
                  size="small"
                  disabled={props.disabled}
                  id="id_CustomerRequisiteSaveButton"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    store.onSaveClick((requis: CustomerRequisite) => {
                      if (requis.id == 0) {
                        requis.id = (props.data.length + 1) * -1
                        const data: CustomerRequisite[] = [
                          ...props.data, requis
                        ]
                        props.setData(data)
                      } else {
                        props.data.forEach(element => {
                          if (element.id === requis.id) {
                            element.bank = requis.bank
                            element.bik = requis.bik
                            element.paymentAccount = requis.paymentAccount
                          }
                        });
                      }
                      storeList.setFastInputIsEdit(false);
                      store.clearStore();
                    });
                  }}
                >
                  {translate("common:save")}
                </CustomButton>
                <CustomButton
                  variant="contained"
                  size="small"
                  disabled={props.disabled}
                  id="id_CustomerRequisiteCancelButton"
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
                disabled={props.disabled}
                id="id_CustomerRequisiteAddButton"
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
