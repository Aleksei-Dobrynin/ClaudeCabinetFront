import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import RepresentativeContactAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface RepresentativeContactProps {
  id: string | null;
}

const RepresentativeContactAddEditView: FC<RepresentativeContactProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <RepresentativeContactAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing RepresentativeContact */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </RepresentativeContactAddEditBaseView>
  );
})

export default withForm(RepresentativeContactAddEditView, store, "/user/RepresentativeContact");