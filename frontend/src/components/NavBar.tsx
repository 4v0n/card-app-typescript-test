import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    if (savedTheme === "enabled") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark-mode", "disabled");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark-mode", "enabled");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="flex justify-center gap-5">
      <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/"}>
        All Entries
      </NavLink>
      <NavLink
        className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
        to={"/create"}
      >
        New Entry
      </NavLink>
      <button
        onClick={toggleDarkMode}
        className="m-3 p-4 text-xl bg-gray-300 hover:bg-gray-400 rounded-md font-medium text-black"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
