import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Grid,
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import store from "./store"
import { observer } from "mobx-react"
import LookUp from 'components/LookUp';
import CustomTextField from "components/TextField";
import CustomCheckbox from "components/Checkbox";
import DateTimeField from "components/DateTimeField";

type ArchObjectTagTableProps = {
  children ?: React.ReactNode;
  isPopup ?: boolean;
};

const BaseArchObjectTagView: FC<ArchObjectTagTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ArchObjectTagForm" id="ArchObjectTagForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ArchObjectTag_TitleName">
                  {translate('label:ArchObjectTagAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.rTagId}
                      onChange={(event) => store.handleChange(event)}
                      name="rTagId"
                      data-testid="id_f_ArchObjectTag_rTagId"
                      id='id_f_ArchObjectTag_rTagId'
                      label={translate('label:ArchObjectTagAddEditView.rTagId')}
                      helperText={store.errors.rTagId}
                      error={!!store.errors.rTagId}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {props.children}
      </Grid>
    </Container>
  );
})

export default BaseArchObjectTagView;
