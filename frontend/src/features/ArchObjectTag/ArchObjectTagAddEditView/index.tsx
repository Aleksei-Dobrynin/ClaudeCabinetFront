import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ArchObjectTagAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ArchObjectTagProps {
  id: string | null;
}

const ArchObjectTagAddEditView: FC<ArchObjectTagProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ArchObjectTagAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ArchObjectTag */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ArchObjectTagAddEditBaseView>
  );
})

export default withForm(ArchObjectTagAddEditView, store, "/user/ArchObjectTag");