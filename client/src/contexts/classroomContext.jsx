import API from "../api/axios.config";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";

const ClassroomContext = createContext();

const ClassroomContextProvider = ({ children }) => {
  const { userData } = useUserContext();
  const [classList, setClassList] = useState([]);
  const [isClassAdded, setIsClassAdded] = useState(false);
  const [focusedClass, setFocusedClass] = useState([]);
  const [isRoleChanged, setIsRoleChanged] = useState(false);
  const [classIdToUserIdMap, setClassIdToUserIdMap] = useState(new Map());
  const [userIdToNameMap, setUserIdToNameMap] = useState(new Map());
  const [userIdToEmailMap, setUserIdToEmailMap] = useState(new Map());
  const [userIdToRoleMap, setUserIdToRoleMap] = useState(new Map());

  useEffect(() => {
    if (userData != null) {
      const user_id = userData.user_id;
      API.post("/classroom/class&UserList", { user_id }).then((res) => {
        if (res?.data.classList.length > 0) {
          setClassList([classList, ...res.data.classList]);
          setFocusedClass(res.data.classList[0]);
          setIsClassAdded(false);
        }
        if (res?.data.classIdToUserIdMap.length > 0) {
          setClassIdToUserIdMap(new Map(res.data.classIdToUserIdMap));
        }
        if (res?.data.userIdToNameMap.length > 0) {
          setUserIdToNameMap(new Map(res.data.userIdToNameMap));
        }
        if (res?.data.userIdToEmailMap.length > 0) {
          setUserIdToEmailMap(new Map(res.data.userIdToEmailMap));
        }
        if (res?.data.userIdToRoleMap.length > 0) {
          setUserIdToRoleMap(new Map(res.data.userIdToRoleMap));
          setIsRoleChanged(false);
        }
      });
    }
  }, [userData, isClassAdded, isRoleChanged]);

  return (
    <ClassroomContext.Provider
      value={{
        classList,
        focusedClass,
        setFocusedClass,
        classIdToUserIdMap,
        userIdToNameMap,
        userIdToEmailMap,
        userIdToRoleMap,
        setIsClassAdded,
        setIsRoleChanged,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

const useClassroomContext = () => {
  const context = useContext(ClassroomContext);

  if (context === undefined) {
    throw new Error(
      "useClassroomContext must be used within ClassroomContextProvider"
    );
  }
  return context;
};

export { ClassroomContextProvider, useClassroomContext };
