import { Warning } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import LogoImg from "../../assets/Images/logo_large_brand.png";
import { UserContext } from "../../hooks/UserContext";
import { api } from "../../services/api";
import ReactLoading from "react-loading";
import { InputText } from "../../components/InputText";
export function Login() {
  let navigate = useNavigate();

  const [isLogin, setLoging] = useState(false);
  const { isAuth, setAuth, checkUserAuth } = useContext(UserContext);

  useEffect(() => {
    if (isAuth != (200 | 201)) {
      checkUserAuth();
      if (isAuth == (200 || 201)) {
        //if its authenticated
        navigate("/");
      }
    }
  }, [isAuth]);

  async function handleLogin() {
    setLoging(true);
    if (cpf == "" || password == "") {
      setErrorMessage({
        message: "Campos de login não podem estar vazios.",
        statusCode: 401,
      });
      setLoging(false);
      return null;
    }

    await api
      .post(
        "/auth/login",
        {
          username: cpf,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setErrorMessage({
          message: "Login realizado com sucesso!",
          statusCode: 200,
        });
        setAuth(res.status);
        navigate("/");
        setLoging(false);
        /* RelaÇão a sidebar e ao menu -  qual item esta selecionado e se a barra deve abrir ou nao*/
        sessionStorage.setItem("sidebarMenuOpenIndex", "0");
        sessionStorage.setItem("hasSubSideBar", "false");

        navigate("/");
      })
      .catch((e) => {
        setLoging(false);
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

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
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

          <InputText input={cpf} setInput={setCpf} typeData="cpf" label="CPF" className="mt-4" />

          <InputText input={password} setInput={setPassword} typeData="password" label="Senha" className="mt-4" />
          <div className="flex">
          <Button
              onClick={() => {
                navigate("/cadastro");
              }}
              text="Criar conta"
              className="bg-brand-100  rounded-md w-full mt-4 h-10"
            />
            <Button
              onClick={() => {
                handleLogin();
              }}
              text="login"
              className="bg-brand-100  rounded-md w-full mt-4 h-10 ml-2"
            />
            
          </div>

          {!isLogin ? (
            <div className="text-brand-100 mt-4 flex items-center ">
              {errorMessage.message != "" ? (
                <div className="flex items-center">
                  <Warning className="mr-4" />
                  {errorMessage.message}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex justify-center">
              {" "}
              <ReactLoading type="bubbles" color="#303655" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
