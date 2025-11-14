import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import PayerContactAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface PayerContactProps {
  id: string | null;
}

const PayerContactAddEditView: FC<PayerContactProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <PayerContactAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing PayerContact */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </PayerContactAddEditBaseView>
  );
})

export default withForm(PayerContactAddEditView, store, "/user/PayerContact");