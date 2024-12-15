import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./contexts/userContext";
import { AuthContextProvider } from "./contexts/authContext";
import { ClassroomContextProvider } from "./contexts/classroomContext.jsx";
import { RoutineContextProvider } from "./contexts/routineContext.jsx";
import { CalendarContextProvider } from "./contexts/calendarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <ClassroomContextProvider>
          <CalendarContextProvider>
            <RoutineContextProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </RoutineContextProvider>
          </CalendarContextProvider>
        </ClassroomContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
