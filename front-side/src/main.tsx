import React from "react";
import {createRoot} from "react-dom/client";
import "./global.css";
import { Layout } from "./pages/Layout";
import Routers from "./pages/Routes/Routers";
import "./main.css";
//@ts-ignore
createRoot(document.getElementById("root")).render(

    <Routers />
     

 

);
