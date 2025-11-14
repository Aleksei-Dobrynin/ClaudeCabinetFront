import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationPaidInvoiceAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationPaidInvoiceProps {
  id: string | null;
}

const ApplicationPaidInvoiceAddEditView: FC<ApplicationPaidInvoiceProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationPaidInvoiceAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationPaidInvoice */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationPaidInvoiceAddEditBaseView>
  );
})

export default withForm(ApplicationPaidInvoiceAddEditView, store, "/user/ApplicationPaidInvoice");