import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Organization } from "constants/User";


import MainStore from 'MainStore';


interface OrganizationSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (org: Organization) => void;
}

const OrganizationSelectDialog: React.FC<OrganizationSelectDialogProps> = ({
  open, onClose, onSelect
}) => {

  const { t } = useTranslation();
  const translate = t;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{translate("organization.selectOrganisation")}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translate("organization.id")}</TableCell>
                <TableCell>{translate("organization.name")}</TableCell>
                <TableCell>{translate("organization.pin")}</TableCell>
                <TableCell>{translate("organization.action")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MainStore.myCompanies.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>{org.id}</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>{org.pin}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => onSelect(org)}>
                      {translate("Choose")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={onClose}>{translate("close")}</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationSelectDialog;