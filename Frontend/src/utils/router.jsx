import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { Auth } from '../pages/Auth'
import { Dashboard } from '../pages/Dashboard'
import { Board } from '../pages/Board'

export const router = createBrowserRouter([{
    path: '/',
    element: <App />,
    children: [
        {
            path: 'auth',
            element: <Auth />
        },
        {
            index: true,
            element: <Dashboard />
        },
        {
            path: '/:boardId',
            element: <Board />
        }
    ]
}])