import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import UserLoginHistoryAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface UserLoginHistoryProps {
  id: string | null;
}

const UserLoginHistoryAddEditView: FC<UserLoginHistoryProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <UserLoginHistoryAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing UserLoginHistory */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </UserLoginHistoryAddEditBaseView>
  );
})

export default withForm(UserLoginHistoryAddEditView, store, "/user/UserLoginHistory");