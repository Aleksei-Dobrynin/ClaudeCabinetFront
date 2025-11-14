import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import UserAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface UserProps {
  id: string | null;
}

const UserAddEditView: FC<UserProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <UserAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing User */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </UserAddEditBaseView>
  );
})

export default withForm(UserAddEditView, store, "/user/User");