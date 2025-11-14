import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import SDocumenttemplateAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface SDocumenttemplateProps {
  id: string | null;
}

const SDocumenttemplateAddEditView: FC<SDocumenttemplateProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <SDocumenttemplateAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing SDocumenttemplate */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </SDocumenttemplateAddEditBaseView>
  );
})

export default withForm(SDocumenttemplateAddEditView, store, "/user/SDocumenttemplate");