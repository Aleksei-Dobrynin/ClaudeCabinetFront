import React, { FC, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import CustomerAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";
import CustomButton from "components/Button";

interface CustomerProps {
  id: number;
  applicationId: number;
  statusCode: string;
  children?: React.ReactNode;
  onPrevClick: () => void;
  onNextClick: (id: number) => void;
}

const CustomerAddEditView: FC<CustomerProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  useEffect(() => {
    // store.handleChange({ target: { value: props.applicationId, name: "12" } })
    store.doLoad()
    return () => store.clearStore()
  }, [])

  useEffect(() => {
    if(props.id !== 0 && props.id){
      store.loadCustomer(props.id)
      store.loadCustomerRequisites(props.id)
    }
  }, [props.id])

  return (
    <>
      <CustomerAddEditBaseView statusCode={props.statusCode}>
        {/* Show many-to-many relationship tabs only when editing existing Customer */}
        {/* {Number(id) > 0 && (
          <Grid item xs={12} spacing={0}>
            <MtmTabs />
          </Grid>
        )} */}
      </CustomerAddEditBaseView>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <CustomButton
          onClick={() => {
            props.onPrevClick()
          }}
          sx={{ mr: 1 }}
          variant="contained"
        >
          {t('common:back')}
        </CustomButton>
        <Box sx={{ flex: '1 1 auto' }} />
        <CustomButton
          variant="contained"
          onClick={() => {
            store.onSaveClick((id: number) => {
              props.onNextClick(id)
            })
          }}
          sx={{ mr: 1 }}>
          {t('common:next')}
        </CustomButton>
      </Box>
    </>
  );
})

export default CustomerAddEditView