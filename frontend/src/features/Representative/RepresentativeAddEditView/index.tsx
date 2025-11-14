import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import RepresentativeAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface RepresentativeProps {
  id: string | null;
}

const RepresentativeAddEditView: FC<RepresentativeProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <RepresentativeAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing Representative */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </RepresentativeAddEditBaseView>
  );
})

export default withForm(RepresentativeAddEditView, store, "/user/Representative");