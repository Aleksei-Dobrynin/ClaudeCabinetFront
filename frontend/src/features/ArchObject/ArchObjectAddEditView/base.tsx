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
import MtmLookup from "components/mtmLookup";

type ArchObjectTableProps = {
  children?: React.ReactNode;
  isPopup?: boolean;
};

const BaseArchObjectView: FC<ArchObjectTableProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  return (
    <Container maxWidth='xl' sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item md={props.isPopup ? 12 : 6}>
          <form data-testid="ArchObjectForm" id="ArchObjectForm" autoComplete='off'>
            <Card component={Paper} elevation={5}>
              <CardHeader title={
                <span id="ArchObject_TitleName">
                  {translate('label:ArchObjectAddEditView.entityTitle')}
                </span>
              } />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.address}
                      onChange={(event) => store.handleChange(event)}
                      name="address"
                      data-testid="id_f_ArchObject_address"
                      id='id_f_ArchObject_address'
                      label={translate('label:ArchObjectAddEditView.address')}
                      helperText={store.errors.address}
                      error={!!store.errors.address}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.name}
                      onChange={(event) => store.handleChange(event)}
                      name="name"
                      data-testid="id_f_ArchObject_name"
                      id='id_f_ArchObject_name'
                      label={translate('label:ArchObjectAddEditView.name')}
                      helperText={store.errors.name}
                      error={!!store.errors.name}
                    />
                  </Grid>

                  {/* <Grid item md={12} xs={12}>
                    <LookUp
                      value={store.districtId}
                      onChange={(event) => store.handleChange(event)}
                      name="districtId"
                      data={store.districts}
                      id='id_f_ArchObject_districtId'
                      label={translate('label:ArchObjectAddEditView.districtId')}
                      helperText={store.errors.districtId}
                      error={!!store.errors.districtId}
                    />
                  </Grid> */}
                  <Grid item md={12} xs={12}>
                    <CustomTextField
                      value={store.description}
                      onChange={(event) => store.handleChange(event)}
                      name="description"
                      data-testid="id_f_ArchObject_description"
                      id='id_f_ArchObject_description'
                      label={translate('label:ArchObjectAddEditView.description')}
                      helperText={store.errors.description}
                      error={!!store.errors.description}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <MtmLookup
                      value={store.tags}
                      onChange={(name, value) => store.changeTags(value)}
                      name="tags"
                      data={store.allTags}
                      label={translate("label:ArchObjectAddEditView.tags")}
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

export default BaseArchObjectView;