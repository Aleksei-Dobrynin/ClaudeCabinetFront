import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationPayerRequisiteAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ApplicationPayerRequisiteProps {
  id: string | null;
}

const ApplicationPayerRequisiteAddEditView: FC<ApplicationPayerRequisiteProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ApplicationPayerRequisiteAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ApplicationPayerRequisite */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ApplicationPayerRequisiteAddEditBaseView>
  );
})

export default withForm(ApplicationPayerRequisiteAddEditView, store, "/user/ApplicationPayerRequisite");