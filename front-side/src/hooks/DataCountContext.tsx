import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

interface DataCountProviderProps {
  children: ReactNode;
}

//Initial value
const initialCaseCount = [0, 0, 0, 0]; /*{
  open: 0,
  expired: 0,
  waiting: 0,
  done: 0,
}*/
const initialReportCount = [0, 0, 0, 0]; /*{
  open: 0,
  analyzing: 0,
  review: 0,
  revised: 0,
}*/
const initialAnalystCount = [0, 0, 0]; /*{
  away: 0,
  working: 0,
  available: 0,
}*/
const initialRequestCount = 0; /*{
  open: 0,
}*/
const initialDepartureCount = [0, 0, 0]; /*{
  scheduled: 0,
  sche_waiting: 0,
  running: 0,
  running_waiting: 0,
}*/

/*/Types
type caseType = {
  open: number,
  expired: number,
  waiting: number,
  done: number,
}
type reportType = {
  open: number,
  analyzing: number,
  review: number,
  revised: number,
}
type AnalystType = {
  away: number,
  working: number,
  available: number,
}
type requestType = {
  open: number,
}
type departureType = {
  scheduled: number,
  sche_waiting: number,
  running: number,
  running_waiting: number,
}
*/
//DataCount parat retornar no contexto
type dataCountType = {
  caseCount: number[];
  reportCount: number[];
  analystCount: number[];
  requestCount: number;
  departureCount: number[];

  resetCaseCount: () => void;
  resetReportCount: () => void;
  resetAnalystCount: () => void;
  resetRequestCount: () => void;
  resetDepartureCount: () => void;
};

//Initial DataCount
const initialDataCount = {
  caseCount: initialCaseCount,
  reportCount: initialReportCount,
  analystCount: initialAnalystCount,
  requestCount: initialRequestCount,
  departureCount: initialDepartureCount,

  resetCaseCount: () => { },
  resetReportCount: () => { },
  resetAnalystCount: () => { },
  resetRequestCount: () => { },
  resetDepartureCount: () => { },
};

export const DataCountContext = createContext<dataCountType>(initialDataCount);

export const DataCountProvider = ({ children }: DataCountProviderProps) => {
  const [caseCount, setCaseCount] = useState(initialCaseCount);
  const [reportCount, setReportCount] = useState(initialReportCount);
  const [analystCount, setAnalystCount] = useState(initialAnalystCount);
  const [requestCount, setRequestCount] = useState(initialRequestCount);
  const [departureCount, setDepartureCount] = useState(initialDepartureCount);

  async function resetCaseCount() {
    //Isso vai retornar um array de 4 elementos -> 0-OPEN / 1-WAITING / 2-EXPIRED / 3-DONE

    try {
      const case_ = await api.get<number[]>("cases", {
        withCredentials: true,
        params: {
          countOnly: true,
        },
      });
      setCaseCount(case_.data);
    } catch (e) {
      return e;
    }
  }
  async function resetReportCount() {
    try {
      const report_ = await api.get<number[]>("reports", {
        withCredentials: true,
        params: {
          countOnly: true,
        },
      });
      setReportCount(report_.data);
    } catch (e) {
      return e;
    }
  }
  async function resetAnalystCount() {
    try {
      const analysts = await api.get<number[]>("analysts", {
        withCredentials: true,
        params: {
          countOnly: true,
        },
      });

      setAnalystCount(analysts.data);
    } catch (e) {
      return e;
    }
  }
  async function resetRequestCount() {
    try {
      const request = await api.get<number>("requests", {
        withCredentials: true,
        params: {
          countOnly: true,
        },
      });
      setRequestCount(request.data);
    } catch (e) {
      return e;
    }
  }
  async function resetDepartureCount() {
    try {
      const departure = await api.get<number[]>("departures", {
        withCredentials: true,
        params: {
          countOnly: true,
        },
      });
      setDepartureCount(departure.data);
    } catch (e) {
      return e;
    }
  }

  return (
    <DataCountContext.Provider
      value={{
        caseCount,
        reportCount,
        analystCount,
        requestCount,
        departureCount,
        resetCaseCount,
        resetReportCount,
        resetAnalystCount,
        resetRequestCount,
        resetDepartureCount,
      }}
    >
      {children}
    </DataCountContext.Provider>
  );
};
