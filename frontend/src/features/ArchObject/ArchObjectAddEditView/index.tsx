import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ArchObjectAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface ArchObjectProps {
  id: string | null;
}

const ArchObjectAddEditView: FC<ArchObjectProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ArchObjectAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ArchObject */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ArchObjectAddEditBaseView>
  );
})

// export default withForm(ArchObjectAddEditView, store, "/user/ArchObject");