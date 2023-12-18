import { Warning } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import LogoImg from "../../assets/Images/logo_large_brand.png";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import ReactLoading from "react-loading";
import { InputText } from "../../components/InputText";
export function Register() {
  let navigate = useNavigate();

  const { isAuth, setAuth, checkUserAuth } = useContext(UserContext);

  async function handleRegister() {
    if (cpf == "" || password == "" || passwordC == "" || email == "" || name == "") {
      setErrorMessage({
        message: "Campos de login não podem estar vazios.",
        statusCode: 401,
      });
      return null;
    }
    if (password != passwordC) {
      setErrorMessage({
        message: "As senhas não estão correspondendo.",
        statusCode: 401,
      });
      return null;
    }

    await api
      .post(
        "/users",
        {
          cpf: cpf,
          password: password,
          email: email,
          name: name,
          user_level: 1,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setErrorMessage({
          message: "Cadastro realizado com sucesso!",
          statusCode: 200,
        });
        setAuth(res.status);
        navigate("/login",{state:{register:true}});

        /* RelaÇão a sidebar e ao menu -  qual item esta selecionado e se a barra deve abrir ou nao*/
        sessionStorage.setItem("sidebarMenuOpenIndex", "0");
        sessionStorage.setItem("hasSubSideBar", "false");

        navigate("/");
      })
      .catch((e) => {
        if (e.code == "ERR_NETWORK") {
          setErrorMessage({
            message: "Ocorreu um erro ao tentar se comunicar com o servidor.",
            statusCode: 401,
          });
        } else {
          setErrorMessage({
            message: e.response.data.message,
            statusCode: e.response.data.statusCode,
          });
        }
      });
  }
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    statusCode: 200,
  });

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-brand-100">
      <div>
        <div className="bg-gray-100 pr-10 pl-10 pb-10 rounded-md">
          <div className="flex items-center justify-center">
            <div className="flex items-center mt-4">
              <img src={LogoImg} className="h-[3rem] w-[3rem]  rounded-md p-1" />
              <div
                className={`noselect w-full  font-raleway text-2xl 
            text-brand-100   `}
              >
                SICCA
              </div>
            </div>
          </div>
          <InputText input={name} setInput={setName} typeData="text" label="Nome" className="mt-4" />
          <InputText input={cpf} setInput={setCpf} typeData="cpf" label="CPF" className="mt-4"/>

          <InputText input={email} setInput={setEmail} typeData="email" label="Email" className="mt-4" />
          <div className="flex items-center">
            <div className="flex-1 mr-2">
              <InputText input={password} setInput={setPassword} typeData="password" label="Senha" className="mt-4" />
            </div>
            <div className="flex-1">
              <InputText input={passwordC} setInput={setPasswordC} typeData="password" label="Confirmar senha" className="mt-4" />
            </div>
          </div>
          <div className="flex mt-4">
            <Button
              onClick={() => {
                handleRegister();
              }}
              text="Salvar"
              className="bg-brand-100  rounded-md w-full mt-4  h-10"
            />
          </div>

          <div className="text-brand-100 mt-4 flex items-center ">
            {errorMessage.message != "" ? (
              <div className="flex items-center">
                <Warning className="mr-4" />
                {errorMessage.message}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
