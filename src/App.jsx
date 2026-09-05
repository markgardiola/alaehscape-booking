import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// User pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Booking from "./pages/Booking";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserLayout from "./components/UserLayout";
import Profile from "./pages/Profile";
import Destinations from "./pages/Destinations";
import SanJuanLaiya from "./pages/destinations/SanJuanLaiya";
import Calatagan from "./pages/destinations/Calatagan";
import Mabini from "./pages/destinations/Mabini";
import Lian from "./pages/destinations/Lian";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import BeachResortListings from "./pages/admin/BeachResortListings";
import ManageBooking from "./pages/admin/ManageBooking";
import Dashboard from "./pages/admin/Dashboard";
import AdminSignIn from "./pages/AdminSignIn";
import Feedbacks from "./pages/admin/Feedbacks";
import ResortDetails from "./pages/admin/ResortDetails";
import EditResort from "./pages/admin/EditResort";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import AddResort from "./pages/admin/AddResort";
import ViewDetails from "./pages/ViewDetails";
import Payment from "./pages/Payment";
import BookingDetails from "./pages/admin/BookingDetails";
import MyBooking from "./pages/MyBooking";
import ViewMyBooking from "./pages/ViewMyBooking";
import Lobo from "./pages/destinations/Lobo";
import Nasugbu from "./pages/destinations/Nasugbu";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="signIn" element={<SignIn />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="adminSignIn" element={<AdminSignIn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="myBooking" element={<MyBooking />} />
            <Route
              path="viewMyBooking/:bookingId"
              element={<ViewMyBooking />}
            />
            <Route path="about" element={<About />} />
            <Route path="viewDetails/:id" element={<ViewDetails />} />
            <Route path="booking/:resortId" element={<Booking />} />
            <Route path="payment" element={<Payment />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/calatagan" element={<Calatagan />} />
            <Route path="destinations/lobo" element={<Lobo />} />
            <Route path="destinations/nasugbu" element={<Nasugbu />} />
            <Route path="destinations/mabini" element={<Mabini />} />
            <Route path="destinations/lian" element={<Lian />} />
            <Route
              path="destinations/san-juan-laiya"
              element={<SanJuanLaiya />}
            />
          </Route>
          <Route
            path="adminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="resorts" element={<BeachResortListings />} />
            <Route path="resorts/add" element={<AddResort />} />
            <Route path="resorts/:id" element={<ResortDetails />} />
            <Route path="resorts/:id/edit" element={<EditResort />} />
            <Route path="bookings" element={<ManageBooking />} />
            <Route
              path="bookingDetails/:bookingId"
              element={<BookingDetails />}
            />
            {<Route path="feedbacks" element={<Feedbacks />} />}
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
};

export default App;
