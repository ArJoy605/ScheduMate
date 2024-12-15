import API from "../api/axios.config";
import { useClassroomContext } from "../contexts/classroomContext";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersTab() {
  const {
    classIdToUserIdMap,
    userIdToNameMap,
    userIdToEmailMap,
    userIdToRoleMap,
    focusedClass,
    setIsRoleChanged,
  } = useClassroomContext();

  const handleClick = (class_id, user_id, class_role) => {
    console.log(class_id, user_id, class_role);
    API.post("/classroom/change-role", { class_id, user_id, class_role })
      .then(function () {
        toast.success("Action applied successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        });
        setIsRoleChanged(true);
      })
      .catch(function () {
        toast.error("An error occurred", {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "dark",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        });
      });
  };

  return (
    <div>
      {/* {console.log(userIdToRoleMap)} */}
      <h1 className="text-green-400 text-2xl font-bold mb-3">User list :</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 border border-gray-400">Name</th>
            <th className="p-2 border border-gray-400">Email</th>
            <th className="p-2 border border-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {classIdToUserIdMap.get(focusedClass.class_id).map((user_id) => (
            <tr
              key={user_id}
              className={`${
                userIdToRoleMap.get(
                  JSON.stringify({
                    class_id: focusedClass.class_id,
                    user_id: user_id,
                  })
                ) === "admin"
                  ? "hidden"
                  : "even:bg-slate-600 odd:bg-gray-700"
              }`}
            >
              <td className="p-2 border border-gray-400">
                {userIdToNameMap.get(user_id)}
              </td>
              <td className="p-2 border border-gray-400">
                {userIdToEmailMap.get(user_id)}
              </td>
              <td className="p-2 border border-gray-400">
                <div className="flex items-center justify-center">
                  <button
                    className="rounded-full border border-gray-400 bg-gray-700 hover:bg-gray-800 px-2 py-1 text-sm"
                    onClick={() => {
                      let class_role;

                      userIdToRoleMap.get(
                        JSON.stringify({
                          class_id: focusedClass.class_id,
                          user_id: user_id,
                        })
                      ) === "user"
                        ? (class_role = "moderator")
                        : (class_role = "user");

                      handleClick(focusedClass.class_id, user_id, class_role);
                    }}
                  >
                    {userIdToRoleMap.get(
                      JSON.stringify({
                        class_id: focusedClass.class_id,
                        user_id: user_id,
                      })
                    ) === "user"
                      ? "Make moderator"
                      : "Remove moderator"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
