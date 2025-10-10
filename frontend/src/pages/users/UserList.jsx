//
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

//
import data from "../../data/dummyData";
import Sidebar from "../../components/layout/Sidebar";
import useUserStore from "../../store/useUserStore";
import DeleteUserPopUp from "../team/DeleteUserPopUp";

//
import {
  OctagonMinus,
  TrendingUp,
  Pickaxe,
  Loader,
  TriangleAlert,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Calendar,
  CircleCheckBig,
  ChartBarIncreasing,
  MapPin,
  Map,
  User,
  Hourglass,
  OctagonAlert,
  CalendarDays,
  SquarePen,
  ClipboardCheck,
  Cog,
  Hammer,
  Phone,
  Mail,
} from "lucide-react";

const TeamList = () => {

  //
  const navigate = useNavigate();

  //
  const { user, users, isLoading, fetchUsers } = useUserStore();

  //
  const [view, setView] = useState("cards");
  const [statusFilter, setStatusFilter] = useState("todos os status");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [today, setToday] = useState(new Date());
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  //
  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount(4);

  // delete user


  // initials
  const getToken = localStorage.getItem("token");
  let initials = "";
  let userName = "";
  if (getToken) {
    try {
      const decoded = jwtDecode(getToken);
      const name = decoded.name || "";
      userName = name;
      if (typeof name === "string" && name.trim().length > 0) {
        const parts = name.trim().split(" ");
        const firstLetter = parts[0].charAt(0).toLocaleUpperCase();
        const lastLetter = parts[parts.length - 1]
          .charAt(0)
          .toLocaleUpperCase();
        initials = firstLetter + lastLetter;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // search and filter
  const filteredUsers = (users || [])
    .filter((user) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        user.name?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.tasksDescription?.toLowerCase().includes(searchLower) ||
        user.cnh?.toLowerCase().includes(searchLower) ||
        user.cpf?.toLowerCase().includes(searchLower) ||
        user.rg?.toLowerCase().includes(searchLower) ||
        user.address?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "todos os status" ||
        user.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .slice(0, visibleCount);

  // fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 1000);
    // cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>
      {/* main-content-starts */}
      <main className="flex-1 p-6 lg:p-12 space-y-6">
        {/* welcome-starts */}
        <div className="flex sm:flex-row justify-between items-center sm:items-center mb-10 border-b border-gray-300 pb-10">
          <div>
            <p className="text-sm">
              Seja bem vindo,{" "}
              <span className=" text-sm font-bold">{userName}</span>!
            </p>
            <div className="flex">
              <div className="flex">
                <p className="text-xs">
                  {today.getHours().toString().padStart(2, "0")} :
                </p>
                <p className="text-xs">
                  {today.getMinutes().toString().padStart(2, "0")} :
                </p>
                <p className="text-xs">
                  {today.getSeconds().toString().padStart(2, "0")}
                </p>
              </div>
              <p className="text-xs"> - {today.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-1 justify-end w-full">
            <div className="w-18 h-18 bg-white border border-gray-300 rounded-full flex items-center justify-center">
              {initials ? (
                <span className="text-blue-500 text-2xl font-bold">
                  {initials}
                </span>
              ) : (
                <span className="text-gray-500 text-2xl font-bold">
                  <User />
                </span>
              )}
            </div>
          </div>
        </div>
        {/* welcome-ends */}

        {/* header-starts */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* headline-starts */}
          <div className="flex flex-1 w-full">
            <div className="w-full">
              <h1 className="text-3xl font-bold">Equipe</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          {/* headline-ends */}
        </div>
        {/* header-ends */}

        {/* active-team-member-starts */}
        <div className="mt-10">
          {/* team-oversight-section-starts */}
          <div className="w-full">
            {/* team-oversight-title-starts */}
            <div>
              <h2 className="text-lg font-bold">Todos os colaboradores</h2>
            </div>
            {/* team-oversight-title-ends */}

            {/* search-filter-starts */}
            <div className="mb-2">
              <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Buscar por nome, cpf, cargo, endereço, fone..."
                  className="border border-gray-300 rounded-md px-4 py-2 w-full md:flex-1 text-sm text-gray-600 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-48 text-sm text-gray-600 focus:outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="todos os status">todos os status</option>
                  <option value="ativo">ativo</option>
                  <option value="inativo">inativo</option>
                  <option value="suspenso">suspenso</option>
                  <option value="demitido">demitido</option>
                </select>
              </div>
            </div>
            {/* search-filter-ends */}

            {/* team-oversight-content-starts */}
            <div className="bg-white border rounded-md border-gray-300 shadow-md p-4 mb-6 w-full">
              {view === "cards" && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md bg-red-50 p-2 mb-2">
                        <TriangleAlert className="text-red-300" size={22} />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Carregando usuários, aguarde...
                      </p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md bg-red-50 p-2 mb-2">
                        <TriangleAlert className="text-red-300" size={22} />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Não há usuários registrados no banco de dados...
                      </p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md bg-red-50 p-2 mb-2">
                        <TriangleAlert className="text-red-300" size={22} />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Nenhuma tarefa corresponde aos filtros aplicados.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className="grid grid-cols-1 lg:grid-cols-1 gap-4"
                        >
                          <div className="border border-gray-300 rounded-md p-6 hover:shadow-md">
                            {/* title-and-description-starts */}
                            <div className="mb-2">
                              <h2 className="text-lg font-bold">{user.name}</h2>
                            </div>
                            {/* title-and-description-ends */}
                            {/* task-card-info-starts */}
                            <div>
                              {/* task-card-local-starts */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <User size={16} />
                                </div>
                                <div className="flex ">
                                  <p className="text-sm font-medium">
                                    Função:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {user.role}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-local-ends */}
                              {/* task-card-address-starts */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <Hammer size={16} />
                                </div>
                                <div className="flex overflow-hidden">
                                  <p className="text-sm font-medium whitespace-nowrap">
                                    Tarefas atribuídas:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2 truncate">
                                    {user.tasksDescription}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-address-ends */}
                              {/* task-card-status-starts */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <Hourglass size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    Status:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {user.status}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-status-ends */}
                              {/*  */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <Phone size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">Fone: </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {user.phone}
                                  </p>
                                </div>
                              </div>
                              {/*  */}
                              {/*  */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <Mail size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    E-mail:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              {/*  */}

                              {/*  */}
                              <div className="flex justify-end items-center mt-5 sm:mt-0">
                                <button
                                  className="border border-gray-300 rounded-md p-3 text-sm font-medium text-black cursor-pointer mr-2 hover:bg-gray-100 s:w-1/6"
                                  onClick={() => {
                                    console.log(user)
                                    setSelectedUser(user);
                                    setIsDeleteOpen(true);
                                  }}
                                >
                                  excluir
                                </button>
                                <button
                                  className="border border-gray-300 rounded-md p-3 bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white cursor-pointer s:w-1/6"
                                  onClick={() => {
                                    navigate("/user/profile/${userId}");
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  ver detalhes
                                </button>
                              </div>
                              {/*  */}

                            </div>
                            {/* title-and-description-starts */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {/* team-oversight-content-ends */}

            {/* load-more-starts */}
            {visibleCount < users.length ? (
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={loadMore}
              >
                <p className="font-medium text-sm">ver mais</p>
                <ChevronDown className="h-5 w-5" />
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={loadLess}
              >
                <p className="font-medium text-sm">ver menos</p>
                <ChevronUp className="h-5 w-5" />
              </div>
            )}
            {/* load-more-ends */}
          </div>
          {/* team-oversight-section-ends */}
        </div>
        {/* active-team-member-ends */}

        {/* quick-actios-section-starts */}
        <div className="mt-10">
          <div>
            <h2 className="text-lg font-bold">Ações Rápidas</h2>
          </div>
          <div className="flex flex-col bg-white p-6 border border-gray-300 rounded-md shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Criar Tarefa */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/user/create");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ClipboardCheck size={24} className="mb-2" />
                <button className="text-sm font-medium">criar usuário</button>
              </div>
              {/* Criar Tarefa */}

              {/* Configurações */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/settings");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Cog size={24} className="mb-2" />
                <button className="text-sm font-medium">configurações</button>
              </div>
              {/* Configurações */}

              {/* Relatórios */}

              {/* Prioridades */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/reports");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ChartBarIncreasing size={24} className="mb-2" />
                <button className="text-sm font-medium">relatórios</button>
              </div>
              {/* Prioridades */}
            </div>
          </div>
        </div>
        {/* quick-actios-section-starts */}
      </main>
      <DeleteUserPopUp
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default TeamList;