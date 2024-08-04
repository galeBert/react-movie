import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../lib/use-toast";
import useSWRMutation from "swr/mutation";
import { addToWatchList } from "../lib/actions";
import { useSWRConfig } from "swr";
export default function Root() {
  const url = "https://api.themoviedb.org/3/account/21022737/watchlist";

  const { toast } = useToast();
  const [offline, setOffline] = useState(false);
  const { mutate } = useSWRConfig();
  const { trigger } = useSWRMutation(url, addToWatchList);

  useEffect(() => {
    const url =
      "https://api.themoviedb.org/3/account/21022737/watchlist/movies";

    window.addEventListener("online", async () => {
      const offlineList = localStorage.getItem("offline-action-remove-watched");
      const translatedOfflineData: { id: string; watched: boolean }[] =
        offlineList ? JSON.parse(offlineList) : [];
      translatedOfflineData.map(async (mov) => {
        await trigger({
          media_id: mov.id,
          media_type: "movie",
          watchlist: mov.watched,
        });
      });
      mutate(url);
      setOffline(false);
      toast({
        title: "Online",
        description: "Welcome Back!",
      });
      localStorage.removeItem("offline-action-remove-watched");
    });
    window.addEventListener("offline", () => setOffline(true));
    return () => {
      window.removeEventListener("online", () => {
        setOffline(false);
        toast({
          title: "Online",
          description: "Welcome Back!",
        });
      });
      window.removeEventListener("offline", () => setOffline(true));
    };
  }, []);

  return (
    <main className={`overflow-x-hidden font-mono`}>
      <nav className="fixed px-2 bg-black/90 justify-between items-center flex text-white top-0 z-10 left-0 w-full">
        <div className="container ml-auto w-full px-4 py-3 flex items-center justify-between">
          <div className="flex space-x-3">
            <Link to="/" className="text-3xl">
              IMDb
            </Link>
            <div className="flex space-x-2 items-center">
              <h3>Series</h3>
              <h3>Movies</h3>
              <h3>Genres</h3>
              <Link to="/watched">Watched</Link>
            </div>
          </div>
          <div className="relative h-10">{/* <SearchBar /> */}</div>
        </div>
      </nav>
      <div className="w-full min-h-screen">
        {offline ? (
          <div className="px-2">
            <Alert className="mt-20 mr-4 bg-orange-400 border-orange-500 fill-white text-white">
              <AlertTriangleIcon className="h-4 w-4 text-white  stroke-white" />
              <AlertTitle>Offline Mode</AlertTitle>
              <AlertDescription>
                You are now using offline mode, check your internet conection.
              </AlertDescription>
            </Alert>
          </div>
        ) : null}

        <Outlet />
      </div>
      <Toaster />
    </main>
  );
}
