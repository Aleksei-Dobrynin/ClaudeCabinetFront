import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import PayerAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface PayerProps {
  id: string | null;
}

const PayerAddEditView: FC<PayerProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <PayerAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing Payer */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </PayerAddEditBaseView>
  );
})

export default withForm(PayerAddEditView, store, "/user/Payer");