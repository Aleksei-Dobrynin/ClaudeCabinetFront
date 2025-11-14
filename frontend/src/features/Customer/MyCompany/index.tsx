import React, { FC, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import CustomerAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";
import CustomButton from "components/Button";
import MainStore from "MainStore";

interface CustomerProps {
}

const CustomerAddEditView: FC<CustomerProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.doLoad()
    return () => store.clearStore()
  }, [])

  return (
    <>
      <CustomerAddEditBaseView>

        {store.id > 0 && <MtmTabs />}

        <Box display="flex" justifyContent={"flex-end"} p={2}>
          <Box m={2}>
            <CustomButton
              variant="contained"
              disabled={MainStore.isCommonCabinet}
              id="id_CustomerSaveButton"
              name={'CustomerAddEditView.save'}
              onClick={() => {
                store.onSaveClick()
              }}
            >
              {translate("common:save")}
            </CustomButton>
          </Box>
        </Box>
        {/* <CustomButton
          variant="contained"
          id="id_CustomerCancelButton"
          name={'CustomerAddEditView.cancel'}
          onClick={() => props.onBtnCancelClick()}
        >
          {translate("common:cancel")}
        </CustomButton> */}
      </CustomerAddEditBaseView>

      {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <CustomButton
          onClick={() => {
            // props.onPrevClick()
          }}
          sx={{ mr: 1 }}
          variant="contained"
        >
          Назад
        </CustomButton>
        <Box sx={{ flex: '1 1 auto' }} />
        <CustomButton
          variant="contained"
          onClick={() => {
            // store.onSaveClick((id: number) => {
            //   props.onNextClick(id)
            // })
          }}
          sx={{ mr: 1 }}>
          Далее
        </CustomButton>
      </Box> */}
    </>
  );
})

export default CustomerAddEditView