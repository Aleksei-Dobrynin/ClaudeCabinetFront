import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import RepresentativeTypeAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface RepresentativeTypeProps {
  id: string | null;
}

const RepresentativeTypeAddEditView: FC<RepresentativeTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <RepresentativeTypeAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing RepresentativeType */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </RepresentativeTypeAddEditBaseView>
  );
})

export default withForm(RepresentativeTypeAddEditView, store, "/user/RepresentativeType");