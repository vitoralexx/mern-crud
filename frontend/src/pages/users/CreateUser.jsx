//
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
//
import Sidebar from "../../components/layout/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
//
import { BellRing } from "lucide-react";

const CreateUser = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [cnh, setCnh] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);

  // add new user
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await axios.post(`${backendUrl}/api/users`, {
        name,
        email,
        confirmEmail,
        phone,
        password,
        confirmPassword,
        role,
        address,
        cpf,
        rg,
        cnh,
        expiresAt,
        category,
        files,
      });
      if (response.data.success) {
        setName("");
        setEmail("");
        setConfirmEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setAddress("");
        setCpf("");
        setRg("");
        setCnh("");
        setExpiresAt("");
        setCategory("");
        setFiles([""]);
        toast.success("Usuário criado com sucesso!");
      } else {
        toast.error(response.data.message || "Erro ao criar usuário");
      }
    } catch (error) {
      console.error("Erro ao criar usuário: ", error);
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

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
    const selectedFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const deleteAttachedFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // get date now
  const today = new Date();

  // get hour now

  return (
    <div className="md:flex min-h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>

      {/* main-content-starts */}
      <main className="flex-1 p-6 lg:p-12 space-y-6">
        <div className="flex-1 flex justify-end">
          <BellRing />
        </div>
        {/* welcome-starts */}
        <div className="flex sm:flex-row justify-between items-center sm:items-center mb-10">
          <div>
            <p className="text-sm">Seja bem vindo, {userName}!</p>
            <div className="flex ">
              <p className="text-xs">{today.toLocaleDateString()} - </p>
              <div className="flex">
                <p className="text-xs">{today.getHours()} :</p>
                <p className="text-xs">{today.getMinutes()} :</p>
                <p className="text-xs">{today.getSeconds()}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end w-full gap-2">
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
              <h1 className="text-3xl font-bold">Criar novo usuário</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
          {/* headline-ends */}
        </div>
        {/* header-ends */}

        {/* form-content-starts */}
        <div className="w-full">
          <div className="p-6 border border-gray-300 rounded-md bg-white shadow-md">
            {/* form-starts */}
            <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
              {/* name-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help pr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-max bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Nome
                  </span>
                </label>
                <input
                  type="text"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  placeholder="Digite o nome completo do colaborador(a)..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* name-ends */}

              {/* email-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Email
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o e-mail..."
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* email-ends */}

              {/* confirm-email-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Confirmar email
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o e-mail novamente..."
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </div>
              {/* confirm-email-ends */}

              {/* password-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Senha
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="A senha deve conter no minímo 8 caracteres"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* password-ends */}

              {/* confirm-password-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Confirmar senha
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Digite novamente a senha"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {/* confirm-password-ends */}

              {/* phone-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Fone
                  </span>
                </label>
                <input
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  placeholder="Digite o fone Ex.:(xx)xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></input>
              </div>
              {/* phone-ends */}

              {/* role-starts-2 */}
              <div className="flex-1">
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    Cargo:
                  </span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border rounded-md border-gray-300 w-full h-10 pl-2 text-sm text-gray-600 focus:outline-none"
                >
                  <option value="">Selecione o cargo</option>
                  <option value="admin">admin</option>
                  <option value="gestor">gestor</option>
                  <option value="fiscal">fiscal</option>
                  <option value="colaborador">colaborador</option>
                </select>
              </div>
              {/* role-ends-2 */}

              {/* address-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
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
                  placeholder="Digite o endereço completo.. Ex.: Rua João Augusto, nº 123, Campinas, São José, SC"
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {/* address-ends */}

              {/* cpf-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    CPF
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o CPF..."
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              {/* cpf-ends */}

              {/* rg-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    RG
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Digite o RG..."
                  className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </div>
              {/* rg-ends */}

              {/* cnh-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    <span className="relative group text-red-500 cursor-help mr-1">
                      *
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <p>Campo obrigatório</p>
                      </div>
                    </span>
                    CNH
                  </span>
                </label>
                <div className="grid lg:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Digite o nº da habilitação..."
                      className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                      value={cnh}
                      onChange={(e) => setCnh(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Digite a data de vencimento..."
                      className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Digite a categoria..."
                      className="border rounded-md border-gray-300 w-full h-10 pl-3 text-sm text-gray-600 focus:outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* cnh-ends */}

              {/* arquivos-em-anexo-starts */}
              <div>
                <label className="label">
                  <span className="text-md font-medium">
                    Arquivos em anexos
                  </span>
                </label>
                <div className="border rounded-md border-gray-300 min-h-[100px] pt-3 pb-6 pl-3 pr-3 text-sm text-gray-500 focus:outline-none">
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="fileInput"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileChange(e)}
                  />
                  {files.length === 0 ? (
                    "Nenhum arquivo selecionado..."
                  ) : (
                    <div className="flex-1 flex w-full">
                      <div className="mt-2 text-sm text-gray-500 w-full pl-3 pr-3">
                        <ul className="list-disc w-full">
                          {files.map((file, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between w-full mb-1"
                            >
                              {file instanceof File ? (
                                <a
                                  href={URL.createObjectURL(file)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline truncate flex-1 mr-3"
                                  title={file.name}
                                >
                                  {file.name}
                                </a>
                              ) : (
                                <span className="truncate flex-1 mr-3 text-gray-500">
                                  {String(file)}
                                </span>
                              )}
                              <button
                                type="button"
                                className="text-blue-600 hover:underline cursor-pointer flex-shrink-0"
                                onClick={() => deleteAttachedFile(idx)}
                              >
                                x
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* arquivos-em-anexo-ends */}

              {/* buttons-starts */}
              <div className="flex flex-col justify-end sm:flex-row gap-1 mt-4">
                {/* attach-file-starts */}
                <div>
                  <button
                    type="button"
                    className="text-sm font-medium p-3 w-full border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
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
                    className="text-sm font-medium p-3 w-full border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      navigate("/dashboard");
                      scrollTo(0, 0);
                    }}
                  >
                    cancelar
                  </button>
                </div>
                {/* cancel-task-ends */}

                {/* create-new-user-starts */}
                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white text-sm font-medium p-3 w-full border border-gray-300 rounded-md hover:bg-blue-600 cursor-pointer"
                    onClick={onSubmitHandler}
                  >
                    criar usuário
                  </button>
                </div>
                {/* create-new-user-ends */}
              </div>
              {/* buttons-ends */}
            </form>
            {/* form-ends */}
          </div>
        </div>
        {/* form-content-ends */}
      </main>
      {/* main-content-ends */}
    </div>
  );
};

export default CreateUser;
