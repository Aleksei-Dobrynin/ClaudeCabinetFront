import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import DocumentStatusHistoryAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface DocumentStatusHistoryProps {
  id: string | null;
}

const DocumentStatusHistoryAddEditView: FC<DocumentStatusHistoryProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <DocumentStatusHistoryAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing DocumentStatusHistory */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </DocumentStatusHistoryAddEditBaseView>
  );
})

export default withForm(DocumentStatusHistoryAddEditView, store, "/user/DocumentStatusHistory");