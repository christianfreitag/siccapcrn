import { Routes, Route, BrowserRouter } from "react-router-dom";

import { UserContextProvider } from "../../hooks/UserContext";
import { Layout } from "../Layout";

import { Dashboard } from "../Dashboard/Dashboard";
import { Login } from "../Login";
import { PrivateRoute } from "./PrivateRouter";
import { Cases } from "../Cases/CasesList";
import { NotFound } from "../NotFound/NotFound";
import { Analysts } from "../Analysts/AnalystList";
import { Reports_ } from "../Reports_/Reports_";
import { Requests } from "../Requests/Request";
import { Departures } from "../Departures/Departures";
import { DataCountProvider } from "../../hooks/DataCountContext";
import { Case } from "../Cases/Case";
import { AnalystData } from "../Analysts/AnalystData";
import { ReportData } from "../Reports_/ReportData";

import { RequestData } from "../Requests/RequestData";
import { Calendar } from "../Departures/Calendar/Calendar";
import { Register } from "../Register/Register";

function Routers() {
  return (
    <div>
      <UserContextProvider>
        <DataCountProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/*" element={<NotFound />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/casos" element={<Cases />} />
                  <Route path="/casos=:id"  element={<Case />} />
                  <Route path="/analistas" element={<Analysts />} />
                  <Route path="/analistas=:id" element={<AnalystData />} />
                  <Route path="/relatorios" element={<Reports_ />} />
                  <Route path="/relatorios=:id" element={<ReportData />} />
                  <Route path="/solicitacoes" element={<Requests />} />
                  <Route path="/solicitacoes=:id" element={<RequestData />} />
                  <Route
                    path="/calendario-afastamentos"
                    element={<Calendar />}
                  />
                  <Route
                    path="/calendario-afastamentos=:id"
                    element={<Calendar />}
                  />

                  {/*Todas rotas que precisam de login*/}
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </DataCountProvider>
      </UserContextProvider>
    </div>
  );
}

export default Routers;
