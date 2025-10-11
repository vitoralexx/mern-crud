//
import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

//
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import xoxo from "../../assets/xoxo.png";
import Logout from "../../pages/auth/Logout";

// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Detect screen size to set isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => {
    scrollTo(0, 0);
    setIsOpen(false);
  };

  const menuItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/dashboard/admin" },
    { icon: <ClipboardCheck />, label: "Tasks", path: "/tasks/list" },
    { icon: <Users />, label: "Users", path: "/users/list" },
    { icon: <LogOut />, label: "Sair", onClick: () => setIsLogoutOpen(true) },
  ];

  const renderNavItems = (onClick) =>
    menuItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <div
          key={`${item.label}-${item.path || "custom"}`}
          className="flex items-center cursor-pointer"
          onClick={() => {
            if (item.onClick) {
              item.onClick(); // open modal
            } else if (item.path) {
              navigate(item.path);
            }
            if (onClick) onClick();
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 pr-3">
            {item.icon}
          </div>
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center gap-2 px-6 py-2 border-gray-300 rounded-md font-medium border ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {item.label}
            </div>
          </div>
        </div>
      );
    });

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-72 bg-white border-r border-gray-300 flex flex-col self-stretch min-h-screen h-full">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/admindashboard")}
          >
            <div className="flex-1 flex items-center pt-10 pb-10">
              <div className="flex-1 flex justify-center items-center">
                <img src={xoxo} alt="xoxo logo" className="w-50 h-auto" />
              </div>
            </div>
          </div>
          <nav className="flex flex-col pl-6 space-y-2">{renderNavItems()}</nav>
        </aside>
      )}

      {/* Mobile Toggle Button */}
      {isMobile && !isOpen && (
        <button onClick={toggleSidebar} className="z-50 p-2 text-gray-800">
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Sidebar */}
      {isMobile && isOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 shadow-lg">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-800"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mt-4 mb-4">
            <img src={xoxo} alt="xoxo logo" className="w-48 h-auto" />
          </div>

          <nav className="flex flex-col space-y-4">
            {renderNavItems(closeSidebar)}
          </nav>
        </div>
      )}

      {/* Modal trigger */}
      <Logout isOpen={isLogoutOpen} setIsOpen={setIsLogoutOpen} />
    </>
  );
};

export default Sidebar;
