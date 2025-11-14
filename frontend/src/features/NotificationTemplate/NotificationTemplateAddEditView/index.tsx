import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import NotificationTemplateAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface NotificationTemplateProps {
  id: string | null;
}

const NotificationTemplateAddEditView: FC<NotificationTemplateProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <NotificationTemplateAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing NotificationTemplate */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </NotificationTemplateAddEditBaseView>
  );
})

export default withForm(NotificationTemplateAddEditView, store, "/user/NotificationTemplate");