import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import RoomTypes from './pages/RoomTypes'
import Rooms from './pages/Rooms'
import Bookings from './pages/Bookings'
import CreateBooking from './pages/CreateBooking'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/room-types" element={<RoomTypes />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/create-booking" element={<CreateBooking />} />
      </Routes>
    </Layout>
  )
}

export default App
