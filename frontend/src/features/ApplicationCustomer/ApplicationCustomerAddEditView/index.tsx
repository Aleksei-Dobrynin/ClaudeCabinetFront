import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationCustomerAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationCustomerProps {
  id: string | null;
}

const ApplicationCustomerAddEditView: FC<ApplicationCustomerProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationCustomerAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationCustomer */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationCustomerAddEditBaseView>
  );
})

export default withForm(ApplicationCustomerAddEditView, store, "/user/ApplicationCustomer");