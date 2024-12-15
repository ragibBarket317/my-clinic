import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPatientModal from "./components/AddPatientModal.jsx";
import AdminInvite from "./components/AdminInvite.jsx";
import SocketContexts from "./components/SocketContext.jsx";
import UserContext from "./components/UserContext.jsx";
import "./customToastifyStyles.css";
import "./i18n";
import "./index.css";
import AppointmentPage from "./pages/AppointmentPage.jsx";
import DocumentPage from "./pages/DocumentPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ManageMembersPage from "./pages/ManageMembersPage.jsx";
import MessagePage from "./pages/MessagePage.jsx";
import MissedAppoinment from "./pages/MissedAppoinment.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import PatientDasboard from "./pages/PatientDasboard.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResetPage from "./pages/ResetPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import PrivateRouters from "./routes/PrivateRouters.jsx";
const router = createBrowserRouter([
  {
    element: (
      <UserContext>
        <PrivateRouters />
      </UserContext>
    ),

    children: [
      {
        path: "/",
        element: <OverviewPage />,
      },
      {
        path: "/overview",
        element: <OverviewPage />,
      },
      {
        path: "/appointment",
        element: <AppointmentPage />,
      },
      {
        path: "/missedAppointment",
        element: <MissedAppoinment />,
      },
      {
        path: "/patients",
        element: <PatientsPage />,
      },
      {
        path: "/documents",
        element: <DocumentPage />,
      },
      {
        path: "/messages",
        element: <MessagePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/patientDashboard/:id",
        element: <PatientDasboard />,
      },
      {
        path: "/manageMembers",
        element: <ManageMembersPage />,
      },
      {
        path: "/invite",
        element: <AdminInvite />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <UserContext>
        <LoginPage />
      </UserContext>
    ),
  },
  {
    path: "/register",
    element: (
      <UserContext>
        <RegisterPage />
      </UserContext>
    ),
  },
  {
    path: "/addpatient",
    element: <AddPatientModal />,
  },
  {
    path: "/reset",
    element: (
      <UserContext>
        <ResetPage />
      </UserContext>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <UserContext>
        <ResetPasswordPage />
      </UserContext>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <SocketContexts>
      <ToastContainer autoClose={2000} />
      <div className="mx-auto w-full max-w-[2200px]">
        <RouterProvider router={router} />
      </div>
    </SocketContexts>
  </>
);
