import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import AuthTypeAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface AuthTypeProps {
  id: string | null;
}

const AuthTypeAddEditView: FC<AuthTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <AuthTypeAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing AuthType */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </AuthTypeAddEditBaseView>
  );
})

export default withForm(AuthTypeAddEditView, store, "/user/AuthType");