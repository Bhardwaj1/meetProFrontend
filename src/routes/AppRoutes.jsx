import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard";
import MeetingRoom from "../pages/MeetingRoom";
import CreateMeeting from "../pages/CreateMeeting";
import JoinMeeting from "../pages/JoinMeeting";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import WaitingRoom from "../pages/WaitingRoom";
import MeetingLogs from "../pages/MeetingLogs";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-meeting" element={<CreateMeeting />} />
          <Route path="/join-meeting" element={<JoinMeeting />} />
          <Route path="/waiting-room/:meetingId" element={<WaitingRoom />} />
          <Route path="/meeting-logs/" element={<MeetingLogs />} />
        </Route>
      </Route>

      {/* Fullscreen meeting */}
      <Route path="/meeting/:id" element={<MeetingRoom />} />
    </Routes>
  );
}
