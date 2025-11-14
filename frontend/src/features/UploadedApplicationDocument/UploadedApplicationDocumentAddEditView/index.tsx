import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import UploadedApplicationDocumentAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface UploadedApplicationDocumentProps {
  id: string | null;
}

const UploadedApplicationDocumentAddEditView: FC<UploadedApplicationDocumentProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <UploadedApplicationDocumentAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing UploadedApplicationDocument */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </UploadedApplicationDocumentAddEditBaseView>
  );
})

export default withForm(UploadedApplicationDocumentAddEditView, store, "/user/UploadedApplicationDocument");