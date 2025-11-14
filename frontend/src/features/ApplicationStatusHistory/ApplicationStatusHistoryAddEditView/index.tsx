import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationStatusHistoryAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationStatusHistoryProps {
  id: string | null;
}

const ApplicationStatusHistoryAddEditView: FC<ApplicationStatusHistoryProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationStatusHistoryAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationStatusHistory */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationStatusHistoryAddEditBaseView>
  );
})

export default withForm(ApplicationStatusHistoryAddEditView, store, "/user/ApplicationStatusHistory");