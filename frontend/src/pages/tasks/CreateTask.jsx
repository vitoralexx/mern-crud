
//
import axios from "axios";
import toast from "react-hot-toast";

//
import Sidebar from "../../components/Layout/Sidebar";

//
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const CreateTask = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [place, setPlace] = useState("");
  const [address, setAddress] = useState("");
  const [responsible, setResponsible] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await axios.post(`${backendUrl}/api/tasks`, {
        title,
        description,
        materials,
        place,
        address,
        responsible,
        status,
        priority,
        dueDate,
        startDate,
      });
      if (response.data.success) {
        setTitle("");
        setDescription("");
        setResponsible("");
        setMaterials("");
        setPlace("");
        setAddress("");
        setResponsible("");
        setStatus("");
        setPriority("");
        setDueDate("");
        setStartDate("");
        toast.success("Tarefa criada com sucesso");
      } else {
        toast.error(response.data.message || "Erro ao criar a tarefa");
      }
    } catch (error) {
      console.error("Erro ao criar tarefa: ", error);
      toast.error("Erro no servidor.");
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

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>
      {/* main-content-starts */}
      <main className="flex-1 p-6 lg:p-12 space-y-6">

        {/* welcome-starts */}
        <div className="flex sm:flex-row justify-between items-center sm:items-center mb-10">
          <div>
            <p className="text-sm">Seja bem vindo, {userName}!</p>
          </div>
          <div className="flex flex-1 justify-end w-full">
            <div className="w-18 h-18 bg-white border border-gray-300 rounded-full flex items-center justify-center">
              {initials ? (
                <span className="text-blue-500 font-medium">{initials}</span>
              ) : (
                <span className="text-red-500 font-medium">!</span>
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
              <h1 className="text-3xl font-bold">Adicionar nova tarefa</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          {/* headline-ends */}
        </div>
        {/* header-ends */}

        <div className="w-full mt-10">
          <div>
            <h2 className="text-lg font-bold">Criar tarefa</h2>
          </div>
          <div className="p-6 border border-gray-300 rounded-md bg-white shadow-md">
            {/*form-starts*/}
            <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
              {/* task-title-starts */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    <span className="relative group text-red-500 cursor-help pr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Título da tarefa
                  </span>
                </label>
                <input
                  type="text"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Ex.: Manutenção do Sistema Elétrico"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {/* task-title-ends */}

              {/* tasks-descriptions-starts */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Descrição da tarefa
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered border rounded-md border-gray-300 w-full min-h-[100px] pt-3 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Descreva a tarefa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              {/* tasks-descriptions-ends */}

              {/* Materiais */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    Descrição dos materiais
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered rounded-md border border-gray-300 w-full min-h-[100px] pt-3 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Descreva os materiais a serem usados..."
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                ></textarea>
              </div>
              {/* Materiais */}

              {/* place-descriptions-starts */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    <span className="relative group text-red-500 cursor-help pr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Local
                  </span>
                </label>
                <input
                  type="text"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Ex.: Escola Municípal João Antunes"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
              {/* place-descriptions-ends */}

              {/* address-descriptions-starts */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    <span className="relative group text-red-500 cursor-help pr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Endereço
                  </span>
                </label>
                <input
                  type="text"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Ex.: Rua Lorem Ipsum, nº 123, Campinas, São José, SC"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {/* address-descriptions-ends */}

              {/* responsible */}
              <div>
                <label className="label">
                  <span className="label-text text-md font-medium">
                    <span className="relative group text-red-500 cursor-help pr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Responsável tarefa
                  </span>
                </label>
                <input
                  type="text"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-500 focus:outline-none"
                  placeholder="Nome do colaborador..."
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                />
              </div>
              {/* responsible */}

              {/* start-and-due-date-starts */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-md font-medium">
                      <span className="relative group text-red-500 cursor-help mr-1">
                        *
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <p>Campo obrigatório</p>
                        </div>
                      </span>
                      A tarefa deve iniciar em:
                    </span>
                  </label>
                  <input
                    type="date"
                    className="select select-bordered rounded-md border border-gray-300 h-10 w-full pl-2 pr-2 text-sm text-gray-500 focus:outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-md font-medium">
                      <span className="relative group text-red-500 cursor-help mr-1">
                        *
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <p>Campo obrigatório</p>
                        </div>
                      </span>
                      A tarefa deve ser finalizada em:
                    </span>
                  </label>
                  <input
                    type="date"
                    className="select select-bordered rounded-md border border-gray-300 h-10 w-full pl-2 pr-2 text-sm text-gray-600 focus:outline-none"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              {/* start-and-due-date-ends */}

              {/* status-and-priority-starts */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* status-starts */}
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-md font-medium">
                      <span className="relative group text-red-500 cursor-help mr-1">
                        *
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <p>Campo obrigatório</p>
                        </div>
                      </span>
                      Selecione o status da tarefa:
                    </span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-md border-gray-300 w-full h-10 pl-2 text-sm text-gray-500 focus:outline-none"
                  >
                    <option value="">Selecione o status</option>
                    <option value="aguardando_início">aguardando início</option>
                    <option value="em_execução">em execução</option>
                    <option value="finalizada">finalizada</option>
                    <option value="pendente">pendente</option>
                    <option value="parada">parada</option>
                  </select>
                </div>
                {/* status-ends */}

                {/* priority-starts */}
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text text-md font-medium">
                      <span className="relative group text-red-500 cursor-help mr-1">
                        *
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <p>Campo obrigatório</p>
                        </div>
                      </span>
                      Selecione a prioridade da tarefa:
                    </span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border rounded-md border-gray-300 w-full h-10 pl-2 text-sm text-gray-600 focus:outline-none"
                  >
                    <option value="">Selecione o status</option>
                    <option value="baixa">baixa</option>
                    <option value="média">média</option>
                    <option value="alta">alta</option>
                  </select>
                </div>
                {/* priority-ends */}
              </div>
              {/* status-ends */}

              {/* attached-files-starts */}
              {/* attached-files-ends */}

              {/* buttons-starts */}
              <div className="flex justify-end flex-col sm:flex-row gap-1 mt-4">
                {/* attach-file-starts */}
                <div>
                  <button
                    type="button"
                    className="text-sm font-medium w-full border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 p-3"
                    onClick={() => fileInputRef.current.click()}
                  >
                    anexar arquivo
                  </button>
                </div>
                {/* attach-file-ends */}

                {/* cancel-task-starts */}
                <div>
                  <button
                    type="button"
                    className="text-sm font-medium w-full border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 p-3"
                    onClick={() => {
                      navigate("/dashboard");
                      scrollTo(0, 0);
                    }}
                  >
                    cancelar
                  </button>
                </div>
                {/* cancel-task-ends */}

                {/* details-starts */}
                <div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white text-sm font-medium w-full border border-gray-300 rounded-md hover:bg-blue-700 cursor-pointer p-3"
                    onClick={onSubmitHandler}
                  >
                    criar tarefa
                  </button>
                </div>
                {/* details-ends */}
              </div>
              {/* buttons-ends */}
            </form>
            {/*form-ends*/}
          </div>
        </div>
      </main>
      {/* main-content-ends */}
    </div>
  );
};

export default CreateTask;
