import { useCallback, useEffect, useMemo, useState } from "react";
import { Books } from "./pages/Books";
import { Users } from "./pages/Users";
import { Borrowed } from "./pages/Borrowed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Sun,
  Moon,
  SquareLibrary,
  ArrowLeft,
  BookOpen,
  ClipboardClock,
  User,
} from "lucide-react";
import { Button } from "./components/Button";
import {
  Link,
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
const queryClient = new QueryClient();

function DarkModeSwitch() {
  // const [dark, setdark] = useState("light");
  const [dark, setdark] = useState("dark");
  useEffect(() => {
    document.body.classList.toggle("dark", dark === "dark");
  }, [dark]);
  const toggle = () => {
    setdark(dark === "light" ? "dark" : "light");
  };
  return (
    <Button onClick={toggle} className="ml-auto rounded-md border p-2">
      {dark === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

function Header() {
  return (
    <div className="mb-4 flex h-16 w-full items-center p-4 shadow">
      {/* <p className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-2xl font-extrabold tracking-widest text-transparent"> */}
      <p className="flex items-center gap-2 text-2xl font-extrabold tracking-widest">
        <SquareLibrary />
        LIBRARY
      </p>
      <DarkModeSwitch />
    </div>
  );
}

function Sidebar() {
  const sidebarBtn = (icon, name, path) => {
    return (
      <Link to={path}>
        <Button className="flex gap-4">
          {icon}
          {expanded && name}
        </Button>
      </Link>
    );
  };
  const [expanded, setexpanded] = useState(true);
  return (
    <div className="flex h-screen flex-col gap-4 bg-sidebar p-4">
      <Button onClick={() => setexpanded(!expanded)} className="mb-16 ml-auto">
        <ArrowLeft
          className={`${expanded ? "" : "rotate-180"} transition-transform`}
        />
      </Button>
      <div className="flex flex-col gap-4">
        {sidebarBtn(<ClipboardClock />, "Borrowed", "borrowed")}
        {sidebarBtn(<BookOpen />, "Books", "books")}
        {sidebarBtn(<User />, "Users", "users")}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-1 flex-col p-4">
            <Header />

            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route Component={Books} path="/books"></Route>
                <Route Component={Users} path="/users"></Route>
                <Route Component={Borrowed} path="/borrowed"></Route>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
