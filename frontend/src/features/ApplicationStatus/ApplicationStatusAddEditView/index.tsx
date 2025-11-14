import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationStatusAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationStatusProps {
  id: string | null;
}

const ApplicationStatusAddEditView: FC<ApplicationStatusProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationStatusAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationStatus */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationStatusAddEditBaseView>
  );
})

export default withForm(ApplicationStatusAddEditView, store, "/user/ApplicationStatus");