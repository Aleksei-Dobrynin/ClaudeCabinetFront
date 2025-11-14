import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import OrganizationTypeAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface OrganizationTypeProps {
  id: string | null;
}

const OrganizationTypeAddEditView: FC<OrganizationTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <OrganizationTypeAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing OrganizationType */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </OrganizationTypeAddEditBaseView>
  );
})

export default withForm(OrganizationTypeAddEditView, store, "/user/OrganizationType");