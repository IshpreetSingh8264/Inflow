import React from 'react'
import Navbar from '../components/Navbar'
const Dashboard = () => {

  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">Welcome to your dashboard!</p>
        <p className="mt-2 text-lg text-gray-600">Here you can manage your data.</p>
        <p className="mt-2 text-lg text-gray-600">You can also view your analytics and insights here.</p>
      </div>


    </div>
  )
}

export default Dashboard
