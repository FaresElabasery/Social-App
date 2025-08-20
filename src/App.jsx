import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes/ProtectedRoutes";
import { AuthContextProvider } from "./Context/AuthContext/AuthContext";
import About from './Pages/About/About';
import Home from './Pages/Home/Home';
import Layout from "./Pages/Layout/Layout";
import Login from './Pages/login/login';
import NotFound from './Pages/NotFound/NotFound';
import PostDetails from './Pages/PostDetails/PostDetails';
import Posts from './Pages/Posts/Posts';
import Profile from './Pages/Profile/Profile';
import Register from './Pages/Register/Register';
import { ToastContainer } from "react-toastify";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {
  const routes = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [{
      index: true,
      element: <Home />
    }, {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/profile",
      element: <ProtectedRoutes><Profile /></ProtectedRoutes>
    },
    {
      path: "/about",
      element: <ProtectedRoutes><About /></ProtectedRoutes>
    },
    {
      path: "/posts",
      element: <ProtectedRoutes><Posts /></ProtectedRoutes>
    },
    {
      path: "/postDetails/:id",
      element: <ProtectedRoutes><PostDetails /></ProtectedRoutes>,
    },
    {
      path: "*",
      element: <NotFound />
    }]
  }])

  // create a client
  const client = new QueryClient()
  return (
    <AuthContextProvider>
    <QueryClientProvider client={client}>
      <ToastContainer />
      <RouterProvider router={routes} />
    </QueryClientProvider>
    </AuthContextProvider>
  )
}

export default App
