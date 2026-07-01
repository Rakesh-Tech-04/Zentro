import { Outlet } from "react-router-dom"

import { UserContextProvider } from './utils/UserContext.jsx'
function App() {

  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  )
}

export default App
