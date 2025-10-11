//
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

//
import axios from "axios";
import useTaskStore from "../../store/useTaskStore";
import Sidebar from "../../components/layout/Sidebar";
import toast from "react-hot-toast";

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
  MapPin,
  Map,
  User,
  Hourglass,
  OctagonAlert,
  CalendarDays,
  SquarePen,
  ClipboardCheck,
  Cog,
} from "lucide-react";

const TasksList = () => {

  //
  const navigate = useNavigate();

  //
  const { tasks, fetchTasks, isLoading, error } = useTaskStore();

  //
  const [view, setView] = useState("cards");
  const [visibleCount, setVisibleCount] = useState(4);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos os status");
  const [priorityFilter, setPriorityFilter] = useState("todas as prioridades");
  const [today, setToday] = useState(new Date());

  //
  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount(4);

  // delete task
  const taskDeleteHandler = async (taskId) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      await axios.delete(`${backendUrl}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTasks();
      toast.success("Tarefa deletada com sucesso!");
      console.log("Task deleted successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

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
  const filteredTasks = (tasks || [])
    .filter((task) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.place?.toLowerCase().includes(searchLower) ||
        task.address?.toLowerCase().includes(searchLower) ||
        task.responsible?.toLowerCase().includes(searchLower);
      const matchesStatus =
        statusFilter === "todos os status" ||
        task.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority =
        priorityFilter === "todas as prioridades" ||
        task.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .slice(0, visibleCount);

  //
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

      <main className="flex-1 lg:p-12 space-y-6 p-6">

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
                <span className="text-gray-500 text-2xl font-bold">
                  {initials}
                </span>
              ) : (
                <span className="text-red-500 text-2xl font-bold">!</span>
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
              <h1 className="text-3xl font-bold">Lista de tarefas</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          {/* headline-ends */}
        </div>
        {/* header-ends */}

        {/* all-tasks-starts */}
        <div className="mt-10">
          {/* */}
          <div className="w-full">
            {/* */}
            <div>
              <h2 className="text-lg font-bold">Todas as tarefas</h2>
            </div>
            {/* */}
            {/* search-filter-starts */}
            <div className="mb-2">
              <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="buscar por nome, cargo, localização, tarefa, status, prioridades"
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
                  <option value="aguardando início">aguardando início</option>
                  <option value="em execução">em execução</option>
                  <option value="finalizada">finalizada</option>
                  <option value="pausada">pausada</option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-48 text-sm text-gray-600 focus:outline-none"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="todas as prioridades">
                    todas as prioridades
                  </option>
                  <option value="alta">alta</option>
                  <option value="média">média</option>
                  <option value="baixa">baixa</option>
                </select>
              </div>
            </div>
            {/* search-filter-ends */}
            {/* */}
            <div className="bg-white border rounded-md border-gray-300 shadow-md p-4 mb-6 w-full">
              {view === "cards" && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md p-2 mb-2 bg-gray-50">
                        <TriangleAlert size={22} className="text-gray-500" />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Carregando tarefas, aguarde...
                      </p>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md p-2 mb-2 bg-gray-50">
                        <TriangleAlert size={22} className="text-gray-500" />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Não há tarefas cadastradas no banco de dados.
                      </p>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md p-2 mb-2 bg-gray-50">
                        <TriangleAlert size={22} className="text-gray-500" />
                      </div>
                      <p className="text-center text-sm text-gray-500">
                        Nenhuma tarefa corresponde aos filtros aplicados.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredTasks.map((task) => (
                        <div
                          key={task._id}
                          className="grid grid-cols-1 lg:grid-cols-1 gap-4"
                        >
                          <div className="border border-gray-300 rounded-md p-6 hover:shadow-md">
                            {/* title-and-description-starts */}
                            <div>
                              <h2 className="text-lg font-bold">
                                {task.title}
                              </h2>
                            </div>
                            <div>
                              <div className="mt-2 mb-2">
                                <p className="text-sm text-justify text-gray-500">
                                  {task.description}
                                </p>
                              </div>
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
                                    Colaborador:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {task.responsible}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-local-ends */}
                              {/* task-card-local-starts */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <MapPin size={16} />
                                </div>
                                <div className="flex ">
                                  <p className="text-sm font-medium">Local: </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {task.place}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-local-ends */}
                              {/* task-card-address-starts */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <Map size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    Endereço:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {task.address}
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
                                    {task.status}
                                  </p>
                                </div>
                              </div>
                              {/* task-card-status-ends */}
                              {/*  */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <OctagonAlert size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    Prioridade:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {task.priority}
                                  </p>
                                </div>
                              </div>
                              {/*  */}
                              {/*  */}
                              <div className="flex justify-left items-center mb-1">
                                <div className="mr-1">
                                  <CalendarDays size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    Data de início:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {new Date(
                                      task.startDate
                                    ).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                              {/*  */}
                              {/*  */}
                              <div className="flex justify-left items-center">
                                <div className="mr-1">
                                  <CalendarDays size={16} />
                                </div>
                                <div className="flex">
                                  <p className="text-sm font-medium">
                                    Prazo de entrega:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2">
                                    {new Date(
                                      task.startDate
                                    ).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                              {/*  */}

                              {/*  */}
                              <div className="flex justify-end items-center mt-5 sm:mt-0">
                                <button
                                  className="border border-gray-300 rounded-md p-3 text-sm font-medium text-black cursor-pointer mr-2 hover:bg-gray-100 s:w-1/6"
                                  onClick={() => {
                                    console.log(task);
                                    setSelectedUser(task);
                                    setIsDeleteOpen(true);
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                >
                                  excluir
                                </button>
                                <button
                                  className="border border-gray-300 rounded-md p-3 bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white cursor-pointer s:w-1/6"
                                  onClick={() => {
                                    navigate("/task");
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
                            {/* */}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            {/* */}
            {/* load-more-starts */}
            {visibleCount < tasks.length ? (
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
          {/*  */}
        </div>
        {/* all-tasks-ends */}

        {/* quick-actios-section-starts */}
        <div className="mt-10">
          <div className="mb-1">
            <h2 className="text-lg font-semibold">Ações Rápidas</h2>
          </div>
          <div className="flex flex-col bg-white p-4 border border-gray-300 rounded-md shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Criar Tarefa */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/task/create");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ClipboardCheck size={24} className="mb-2" />
                <button className="text-sm font-medium">criar tarefa</button>
              </div>
              {/* Criar Tarefa */}

              {/* Configurações */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => navigate("/reports")}
              >
                <Cog size={24} className="mb-2" />
                <button className="text-sm font-medium">relatórios</button>
              </div>
              {/* Configurações */}
              {/* Relatórios */}

              {/* Prioridades */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => navigate("/reports")}
              >
                <TriangleAlert size={24} className="mb-2" />
                <button className="text-sm font-medium">Lorem Ipsum</button>
              </div>
              {/* Prioridades */}
            </div>
          </div>
        </div>
        {/* quick-actios-section-starts */}
      </main>
    </div>
  );
};

export default TasksList;
