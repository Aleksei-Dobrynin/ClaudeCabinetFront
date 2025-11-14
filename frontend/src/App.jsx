import { Suspense, lazy } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { Stepper, StyledEngineProvider } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import NavigationScroll from "layouts/NavigationScroll";
import MainWrapper from "layouts/MainWrapper";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import themes from "themes";
import MainLayout from "layouts/MainLayout";

// Lazy-loaded components
const AuthForm = lazy(() => import("features/Auth/Auth"));
const RegisterForm = lazy(() => import("features/Register"));
const ServiceListView = lazy(() => import("features/Service/ServiceListView"));
const ServiceAddEditView = lazy(() => import("features/Service/ServiceAddEditView"));
const CustomerListView = lazy(() => import("features/Customer/CustomerListView"));
const CustomerAddEditView = lazy(() => import("features/Customer/CustomerAddEditView"));
const MyCompany = lazy(() => import("features/Customer/MyCompany"));
const OrganizationTypeListView = lazy(() => import('features/OrganizationType/OrganizationTypeListView'));
const OrganizationTypeAddEditView = lazy(() => import('features/OrganizationType/OrganizationTypeAddEditView'));
const RepresentativeListView = lazy(() => import('features/Representative/RepresentativeListView'));
const RepresentativeAddEditView = lazy(() => import('features/Representative/RepresentativeAddEditView'));
const RepresentativeTypeListView = lazy(() => import('features/RepresentativeType/RepresentativeTypeListView'));
const RepresentativeTypeAddEditView = lazy(() => import('features/RepresentativeType/RepresentativeTypeAddEditView'));
const DocumentStatusListView = lazy(() => import('features/DocumentStatus/DocumentStatusListView'));
const DocumentStatusAddEditView = lazy(() => import('features/DocumentStatus/DocumentStatusAddEditView'));
const ArchObjectListView = lazy(() => import('features/ArchObject/ArchObjectListView'));
const ArchObjectAddEditView = lazy(() => import('features/ArchObject/ArchObjectAddEditView'));
const ApplicationListView = lazy(() => import('features/Application/ApplicationListView'));
const MyArchiveApplications = lazy(() => import('features/Application/MyArchiveApplications'));
const HistoryTableListView = lazy(() => import('features/HistoryTable/HistoryTableListView'));
const HistoryTableView = lazy(() => import('features/HistoryTable/HistoryTableView'));
const ApplicationAddEditView = lazy(() => import('features/Application/ApplicationAddEditView'));
const StepperView = lazy(() => import('features/Application/Stepper'));
const DashboardView = lazy(() => import('features/Dashboard/DashboardContainer'));
const NewStepper = lazy(() => import('features/Application/NewStepper'));
const ApplicationEdit = lazy(() => import('features/Application/MainInfo'));
const ApplicatinoPublicView = lazy(() => import("features/Application/ApplicationPublic"));
const ApplicatinoWorkDocumentPublicView = lazy(() => import("features/ApplicationWorkDocument"));
const ApplicationDocumentDownloadView = lazy(() => import("features/ApplicationDocumentDownload"));
const ApplicationStatusListView = lazy(() => import('features/ApplicationStatus/ApplicationStatusListView'));
const ApplicationStatusAddEditView = lazy(() => import('features/ApplicationStatus/ApplicationStatusAddEditView'));
const PayerListView = lazy(() => import('features/Payer/PayerListView'));
const PayerAddEditView = lazy(() => import('features/Payer/PayerAddEditView'));
const UserListView = lazy(() => import('features/User/UserListView'));
const UserAddEditView = lazy(() => import('features/User/UserAddEditView'));
const AuthTypeListView = lazy(() => import('features/AuthType/AuthTypeListView'));
const AuthTypeAddEditView = lazy(() => import('features/AuthType/AuthTypeAddEditView'));
const LanguageListView = lazy(() => import('features/Language/LanguageListView'));
const LanguageAddEditView = lazy(() => import('features/Language/LanguageAddEditView'));
const SDocumenttemplateListView = lazy(() => import('features/SDocumenttemplate/SDocumenttemplateListView'));
const SDocumenttemplateAddEditView = lazy(() => import('features/SDocumenttemplate/SDocumenttemplateAddEditView'));
const NotificationTemplateListView = lazy(() => import('features/NotificationTemplate/NotificationTemplateListView'));
const NotificationTemplateAddEditView = lazy(() => import('features/NotificationTemplate/NotificationTemplateAddEditView'));
const ApplicationPaidInvoiceListView = lazy(() => import('features/ApplicationPaidInvoice/ApplicationPaidInvoiceListView'));
const ApplicationPaidInvoiceAddEditView = lazy(() => import('features/ApplicationPaidInvoice/ApplicationPaidInvoiceAddEditView'));
const UserProfileView = lazy(() => import('features/Account'));



// Loading fallback component
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

const router = createBrowserRouter([
  {
    element: (
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    ),
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <MainLayout />,
            path: "/user",
            children: [
              {
                path: "Service",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <ServiceListView />
                  </Suspense>
                )
              },
              {
                path: "Service/addedit",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <ServiceAddEditView />
                  </Suspense>
                )
              },
              { path: 'UserProfile', element: (<Suspense fallback={<LoadingFallback />}><UserProfileView /></Suspense>) },
              { path: 'Representative', element: (<Suspense fallback={<LoadingFallback />}><RepresentativeListView /></Suspense>) },
              { path: 'Representative/addedit', element: (<Suspense fallback={<LoadingFallback />}><RepresentativeAddEditView /></Suspense>) },
              { path: 'RepresentativeType', element: (<Suspense fallback={<LoadingFallback />}><RepresentativeTypeListView /></Suspense>) },
              { path: 'RepresentativeType/addedit', element: (<Suspense fallback={<LoadingFallback />}><RepresentativeTypeAddEditView /></Suspense>) },
              { path: 'OrganizationType', element: (<Suspense fallback={<LoadingFallback />}><OrganizationTypeListView /></Suspense>) },
              { path: 'OrganizationType/addedit', element: (<Suspense fallback={<LoadingFallback />}><OrganizationTypeAddEditView /></Suspense>) },
              { path: 'MyArchiveApplications', element: (<Suspense fallback={<LoadingFallback />}><MyArchiveApplications/></Suspense>) },
              { path: 'ApplicationNeedAction', element: (<Suspense fallback={<LoadingFallback />}><ApplicationListView filter={"need_action"}/></Suspense>) },
              { path: 'ApplicationAll', element: (<Suspense fallback={<LoadingFallback />}><ApplicationListView filter={"all"}/></Suspense>) },
              { path: 'ApplicationDrafts', element: (<Suspense fallback={<LoadingFallback />}><ApplicationListView filter={"draft"}/></Suspense>) },
              { path: 'ApplicationOnWork', element: (<Suspense fallback={<LoadingFallback />}><ApplicationListView filter={"on_work"}/></Suspense>) },
              { path: 'ApplicationDone', element: (<Suspense fallback={<LoadingFallback />}><ApplicationListView filter={"done"}/></Suspense>) },
              { path: 'HistoryTable', element: (<Suspense fallback={<LoadingFallback />}><HistoryTableListView /></Suspense>) },
              { path: 'HistoryTableApplication', element: (<Suspense fallback={<LoadingFallback />}><HistoryTableView /></Suspense>) },
              { path: 'OldStepper', element: (<Suspense fallback={<LoadingFallback />}><StepperView /></Suspense>) },
              { path: 'Stepper', element: (<Suspense fallback={<LoadingFallback />}><NewStepper /></Suspense>) },
              { path: 'Stepper2', element: (<Suspense fallback={<LoadingFallback />}><StepperView /></Suspense>) },
              { path: 'ApplicationEdit', element: (<Suspense fallback={<LoadingFallback />}><ApplicationEdit /></Suspense>) },
              { path: 'Application/addedit', element: (<Suspense fallback={<LoadingFallback />}><ApplicationAddEditView /></Suspense>) },
              { path: 'ApplicationStatus', element: (<Suspense fallback={<LoadingFallback />}><ApplicationStatusListView /></Suspense>) },
              { path: 'ApplicationStatus/addedit', element: (<Suspense fallback={<LoadingFallback />}><ApplicationStatusAddEditView /></Suspense>) },
              { path: 'Payer', element: (<Suspense fallback={<LoadingFallback />}><PayerListView /></Suspense>) },
              { path: 'Payer/addedit', element: (<Suspense fallback={<LoadingFallback />}><PayerAddEditView /></Suspense>) },
              { path: 'User', element: (<Suspense fallback={<LoadingFallback />}><UserListView /></Suspense>) },
              { path: 'User/addedit', element: (<Suspense fallback={<LoadingFallback />}><UserAddEditView /></Suspense>) },
              { path: 'AuthType', element: (<Suspense fallback={<LoadingFallback />}><AuthTypeListView /></Suspense>) },
              { path: 'AuthType/addedit', element: (<Suspense fallback={<LoadingFallback />}><AuthTypeAddEditView /></Suspense>) },
              { path: 'DocumentStatus', element: (<Suspense fallback={<LoadingFallback />}><DocumentStatusListView /></Suspense>) },
              { path: 'DocumentStatus/addedit', element: (<Suspense fallback={<LoadingFallback />}><DocumentStatusAddEditView /></Suspense>) },
              { path: 'ArchObject', element: (<Suspense fallback={<LoadingFallback />}><ArchObjectListView /></Suspense>) },
              { path: 'ArchObject/addedit', element: (<Suspense fallback={<LoadingFallback />}><ArchObjectAddEditView /></Suspense>) },
              { path: 'Language', element: (<Suspense fallback={<LoadingFallback />}><LanguageListView /></Suspense>) },
              { path: 'Language/addedit', element: (<Suspense fallback={<LoadingFallback />}><LanguageAddEditView /></Suspense>) },
              { path: 'SDocumenttemplate', element: (<Suspense fallback={<LoadingFallback />}><SDocumenttemplateListView /></Suspense>) },
              { path: 'SDocumenttemplate/addedit', element: (<Suspense fallback={<LoadingFallback />}><SDocumenttemplateAddEditView /></Suspense>) },
              { path: 'NotificationTemplate', element: (<Suspense fallback={<LoadingFallback />}><NotificationTemplateListView /></Suspense>) },
              { path: 'NotificationTemplate/addedit', element: (<Suspense fallback={<LoadingFallback />}><NotificationTemplateAddEditView /></Suspense>) },
              { path: 'Settings', element: (<Suspense fallback={<LoadingFallback />}><MyCompany /></Suspense>) },
              { path: 'ApplicationPaidInvoice', element: (<Suspense fallback={<LoadingFallback />}><ApplicationPaidInvoiceListView /></Suspense>) },
              { path: 'ApplicationPaidInvoice/addedit', element: (<Suspense fallback={<LoadingFallback />}><ApplicationPaidInvoiceAddEditView /></Suspense>) },
              {
                path: "Customer",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <CustomerListView />
                  </Suspense>
                )
              },
              {
                path: "Customer/addedit",
                element: (
                  <Suspense fallback={<LoadingFallback />}>
                    <CustomerAddEditView />
                  </Suspense>
                )
              },
              { path: '', element: (<Suspense fallback={<LoadingFallback />}><DashboardView /></Suspense>) },
            ]
          }]
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/application",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ApplicatinoPublicView />
              </Suspense>
            )
          },
          {
            path: "/document",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ApplicatinoWorkDocumentPublicView />
              </Suspense>
            )
          },
          {
            path: "/secure-document-download",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ApplicationDocumentDownloadView />
              </Suspense>
            )
          },
          {
            path: "/login",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthForm />
              </Suspense>
            )
          },
          {
            path: "/register",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <RegisterForm />
              </Suspense>
            )
          },
          {
            path: "/",
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AuthForm />
              </Suspense>
            )
          },
        ]
      },
      { path: "error-404", element: <div></div> },
      { path: "access-denied", element: <div></div> },
      { path: "*", element: <div>not founded</div> }
    ]
  }
]);

const App = () => {
  return <StyledEngineProvider injectFirst>
    <ThemeProvider theme={themes(null)}>
      <NavigationScroll>
        <RouterProvider router={router} />
      </NavigationScroll>
    </ThemeProvider>
  </StyledEngineProvider>;
};

export default App;