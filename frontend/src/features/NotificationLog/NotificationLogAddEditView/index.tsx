import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import NotificationLogAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface NotificationLogProps {
  id: string | null;
}

const NotificationLogAddEditView: FC<NotificationLogProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <NotificationLogAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing NotificationLog */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </NotificationLogAddEditBaseView>
  );
})

export default withForm(NotificationLogAddEditView, store, "/user/NotificationLog");