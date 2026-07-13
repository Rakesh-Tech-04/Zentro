import { Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { UserContextProvider } from './utils/UserContext.jsx'
function App() {

  return (
    <UserContextProvider>
      <Outlet />
      <ToastContainer position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      // transition={Bounce}
      />
    </UserContextProvider>
  )
}

export default App
