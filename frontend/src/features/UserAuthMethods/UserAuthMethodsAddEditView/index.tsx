import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import UserAuthMethodsAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface UserAuthMethodsProps {
  id: string | null;
}

const UserAuthMethodsAddEditView: FC<UserAuthMethodsProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <UserAuthMethodsAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing UserAuthMethods */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </UserAuthMethodsAddEditBaseView>
  );
})

export default withForm(UserAuthMethodsAddEditView, store, "/user/UserAuthMethods");