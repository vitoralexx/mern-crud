//
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

//
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import useTaskStore from "../../store/useTaskStore";
import useUserStore from "../../store/useUserStore";

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
  User,
  Hourglass,
  OctagonAlert,
  CalendarDays,
  ClipboardCheck,
  Cog,
  Map,
  Hammer,
  UserCheck,
  UserX,
  UserMinus,
  UserLock,
  ClipboardPlus,
} from "lucide-react";

//
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const AdminDashboard = () => {

  //
  const currentDay = new Date();
  const navigate = useNavigate();
  const loadMore = () => setVisibleCount((prev) => prev + 4);
  const loadLess = () => setVisibleCount(4);

  //
  const { taskId } = useParams();
  const {
    stats,
    tasks,
    fetchTask,
    fetchTasks,
    fetchTaskStats,
    isLoading,
    error,
  } = useTaskStore();

  //
  const { userId } = useParams();
  const {
    users,
    counts,
    percentages,
    userStats,
    fetchUserStats,
    formattedUserStats,
  } = useUserStore();

  //
  const [view, setView] = useState("cards");
  const [visibleCount, setVisibleCount] = useState(4);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos os status");
  const [priorityFilter, setPriorityFilter] = useState("todas as prioridades");
  const [today, setToday] = useState(new Date());

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

  // get unsername initials
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

  // single task
  useEffect(() => {
    if (taskId) {
      fetchTask(taskId);
    }
  }, [taskId, fetchTask]);

  // all tasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // task stats
  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  // users stats
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 1000);
    // cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const taskCardStats = stats
    ? [
        {
          id: 4,
          label: "Aguardando início",
          count: stats.aguardando_início,
          percent: `${stats.percentages.aguardando_início || 0}%`,
        },
        {
          id: 1,
          label: "Pendentes",
          count: stats.pendente,
          percent: `${stats.percentages.pendente || 0}%`,
        },
        {
          id: 2,
          label: "Em Execução",
          count: stats.em_execução,
          percent: `${stats.percentages.em_execução || 0}%`,
        },
        {
          id: 3,
          label: "Concluídas",
          count: stats.finalizada,
          percent: `${stats.percentages.finalizada || 0}%`,
        },
      ]
    : [];

  const teamCardStats = userStats
    ? [
        {
          id: 1,
          label: "Ativos",
          count: userStats.formattedUserStats.ativo,
          percent: `${userStats.formattedUserStats.percentages.ativo || 0}%`,
        },
        {
          id: 2,
          label: "Inativos",
          count: userStats.formattedUserStats.inativo,
          percent: `${userStats.formattedUserStats.percentages.inativo || 0}%`,
        },
        {
          id: 3,
          label: "Suspensos",
          count: userStats.formattedUserStats.suspenso,
          percent: `${userStats.formattedUserStats.percentages.suspenso || 0}%`,
        },
        {
          id: 4,
          label: "Demitidos",
          count: userStats.formattedUserStats.demitido,
          percent: `${userStats.formattedUserStats.percentages.demitido || 0}%`,
        },
      ]
    : [];

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>
      {/* main-content-starts */}
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
                <span className="text-blue-500 text-2xl font-bold">
                  {initials}
                </span>
              ) : (
                <span className="text-red-500 text-2xl font-bold">
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
              <h1 className="text-3xl font-bold">Painel de controle</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          {/* headline-ends */}
        </div>
        {/* header-ends */}

        {/* stats-cards-starts */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 mt-10 sm-0">
          {/* tasks-card-starts */}
          <div className="flex flex-col flex-wrap w-full">
            {/* title-starts */}
            <div>
              <h2 className="text-lg font-bold">Status das tarefas</h2>
            </div>
            {/* title-ends */}
            {/*  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-300 rounded-md p-4 bg-white shadow-md gap-4">
              {taskCardStats.map((stat) => (
                <div key={stat.id}>
                  <div className="border border-gray-300 rounded-md p-4 hover:shadow-md">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-3xl font-bold">{stat.count}</p>
                      {stat.label == "Aguardando início" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-orange-50">
                          <Hourglass className="text-orange-300" size={20} />
                        </div>
                      ) : stat.label == "Pendentes" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-red-50">
                          <TriangleAlert className="text-red-300" size={20} />
                        </div>
                      ) : stat.label == "Em Execução" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-blue-50">
                          <Hammer className="text-blue-300" size={20} />
                        </div>
                      ) : stat.label === "Concluídas" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-green-50">
                          <CircleCheckBig
                            className="text-green-300"
                            size={20}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center">
                      <p>{stat.percent}</p>
                      <TrendingUp className="text-green-500 ml-1" size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* */}
          </div>
          {/* tasks-card-ends */}

          {/* team-card-starts */}
          <div className="flex flex-col flex-wrap w-full">
            {/* title-starts */}
            <div>
              <h2 className="text-lg font-bold">Status da equipe</h2>
            </div>
            {/* title-ends */}
            {/*  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 border border-gray-300 rounded-md p-4 bg-white shadow-md gap-4">
              {teamCardStats.map((users) => (
                <div key={users._id}>
                  <div className="border border-gray-300 rounded-md p-4 hover:shadow-md">
                    <p className="text-sm text-gray-500">{users.label}</p>
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-3xl font-bold">{users.count}</p>

                      {users.label === "Ativos" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-blue-50">
                          <UserCheck className="text-blue-300" size={22} />
                        </div>
                      ) : users.label === "Inativos" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-red-50">
                          <UserMinus className="text-red-300" size={22} />
                        </div>
                      ) : users.label === "Suspensos" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-red-50">
                          <UserLock className="text-orange-300" size={22} />
                        </div>
                      ) : users.label === "Demitidos" ? (
                        <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                          <UserX className="text-gray-300" size={22} />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center">
                      <p>{users.percent}</p>
                      <TrendingUp className="text-green-500 ml-1" size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* */}
          </div>
          {/* team-card-ends */}
        </div>

        {/* charts-section-starts */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {/* weekly-tasks-starts */}
          <div className="w-full h-full mt-10">
            <div>
              <h2 className="text-lg font-bold">Atividade semanal</h2>
            </div>
            <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-md w-full min-h-[400px] md:min-h-[600px] shadow-md">
              <ResponsiveContainer
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                width="100%"
                height={300}
              >
                <BarChart data={dummyDashWeeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Bar dataKey="concluido" fill="#22c55e" />
                  <Bar dataKey="pendente" fill="#facc15" />
                  <Bar dataKey="em_progresso" fill="#1e90ff" />
                </BarChart>
              </ResponsiveContainer>
              <ul className="flex-col items-center text-sm">
                {DashWeeklyStatus.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-center mt-2 mb-2 ml-2 gap-1 text-sm"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: d.color }}
                    ></span>
                    {d.name}: {d.value}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* weekly-tasks-ends */}

          {/* tasks-distribution-starts */}
          <div className="w-full mt-10">
            <div>
              <h2 className="text-lg font-bold">Distribuição de tarefas</h2>
            </div>
            <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-md w-full min-h-[400px] md:min-h-[600px] shadow-md">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-col items-center mb-2 text-sm">
                {pieData.map((d, i) => (
                  <li key={i} className="flex items-center mt-2 ml-2 gap-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: d.color }}
                    ></span>
                    {d.name}: {d.value}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* tasks-distribution-ends */}
        </div>
        {/* charts-section-ends */}

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
                  <option value="pendente">pendente</option>
                  <option value="parada">parada</option>
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
                    <p className="text-center text-gray-500 text-sm p-4">
                      Carregando tarefas...
                    </p>
                  ) : tasks.length === 0 ? (
                    <div>
                      <div className="border border-gray-300 rounded-md bg-red-50 p-2 mb-2">
                        <TriangleAlert className="text-red-300" size={22} />
                      </div>

                      <p className="text-sm text-gray-500">
                        Não há tarefas registradas no banco de dados...
                      </p>
                    </div>
                  ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-gray-300 rounded-md bg-red-50 p-2 mb-2">
                        <TriangleAlert className="text-red-300" size={22} />
                      </div>
                      <p className="text-sm text-gray-500">
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
                                <div className="flex overflow-hidden">
                                  <p className="text-sm font-medium">Local: </p>
                                  <p className="text-sm text-gray-500 ml-2 truncate">
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
                                <div className="flex overflow-hidden">
                                  <p className="text-sm font-medium">
                                    Endereço:{" "}
                                  </p>
                                  <p className="text-sm text-gray-500 ml-2 truncate">
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
                              <div className="flex justify-end items-center mt-4 sm:mt-0">
                                <button
                                  className="border border-gray-300 rounded-md p-3 text-sm font-medium text-black cursor-pointer mr-2 hover:bg-gray-100 s:w-1/6"
                                  onClick={() => taskDeleteHandler(task._id)}
                                >
                                  excluir
                                </button>
                                <button
                                  className="border border-gray-300 rounded-md p-3 bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white cursor-pointer s:w-1/6"
                                  onClick={() => navigate("/taskdetails")}
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
          <div>
            <h2 className="text-lg font-bold">Ações Rápidas</h2>
          </div>
          <div className="flex flex-col bg-white p-6 border border-gray-300 rounded-md shadow-md">
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
                <button className="text-sm font-medium">criar Tarefa</button>
              </div>
              {/* Criar Tarefa */}

              {/* Criar Tarefa */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/user/create");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <User size={24} className="mb-2" />
                <button className="text-sm font-medium">criar usuário</button>
              </div>
              {/* Criar Tarefa */}

              {/* criar-evento-starts */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/agenda/create");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <CalendarDays size={24} className="mb-2" />
                <button className="text-sm font-medium">criar evento</button>
              </div>
              {/* criar-evento-ends */}

              {/* Configurações */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/settings")
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Cog size={24} className="mb-2" />
                <button className="text-sm font-medium">configurações</button>
              </div>
              {/* Configurações */}

              {/* priorities-starts */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/reports");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <ClipboardPlus size={24} className="mb-2" />
                <button className="text-sm font-medium">relatórios</button>
              </div>
              {/* priorities-ends */}

              {/* all-users-starts */}
              <div
                className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-md hover:shadow-md cursor-pointer w-full h-full"
                onClick={() => {
                  navigate("/user/list");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Users size={24} className="mb-2" />
                <button className="text-sm font-medium">equipe</button>
              </div>
              {/* all-users-ends */}

            </div>
          </div>
        </div>
        {/* quick-actios-section-starts */}
      </main>
      {/* main-content-ends */}
    </div>
  );
};

export default AdminDashboard;