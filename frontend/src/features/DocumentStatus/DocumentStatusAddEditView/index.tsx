import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import DocumentStatusAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface DocumentStatusProps {
  id: string | null;
}

const DocumentStatusAddEditView: FC<DocumentStatusProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <DocumentStatusAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing DocumentStatus */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </DocumentStatusAddEditBaseView>
  );
})

export default withForm(DocumentStatusAddEditView, store, "/user/DocumentStatus");