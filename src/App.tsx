import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import "./index.css";
import Home from "./routes/home";
import WatchedMovie from "./routes/watched";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/watched", element: <WatchedMovie /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
