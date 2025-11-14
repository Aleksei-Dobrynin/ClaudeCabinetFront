import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationPayerAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationPayerProps {
  id: string | null;
}

const ApplicationPayerAddEditView: FC<ApplicationPayerProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationPayerAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationPayer */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationPayerAddEditBaseView>
  );
})

export default withForm(ApplicationPayerAddEditView, store, "/user/ApplicationPayer");