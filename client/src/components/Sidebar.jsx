import { useClassroomContext } from "../contexts/classroomContext";
import { AiOutlineLink } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

export default function Sidebar() {
  const { classList, focusedClass, setFocusedClass } = useClassroomContext();

  const handleItemClick = (obj) => {
    setFocusedClass(obj);
  };

  return (
    <div className="bg-gray-800 border-r border-gray-700 h-screen w-72 py-6 text-slate-200 overflow-y-auto sticky top-0 z-30">
      <div className="text-xl mt-11 font-bold text-center">Class List</div>
      <div className="border-t border-gray-700 mt-2 mb-6"></div>
      <ul>
        {classList &&
          classList.map(
            (obj) =>
              obj.class_id && (
                <li
                  key={obj.class_id}
                  onClick={() => handleItemClick(obj)}
                  className={`bg-gray-800 text-sm font-medium flex items-center rounded-e-full py-2 px-2 mb-4 cursor-pointer ${
                    focusedClass === obj
                      ? "focused hover:bg-gray-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <AiOutlineLink className="mr-2" />
                  <p
                    className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                    data-tooltip-content={obj.class_name}
                    data-tooltip-id="className-tooltip"
                  >
                    {obj.class_name}
                  </p>
                  <Tooltip
                    className="overflow-auto"
                    id="className-tooltip"
                    place="bottom"
                    offset="20"
                    positionStrategy="fixed"
                    delayShow="1000"
                  />
                </li>
              )
          )}
      </ul>
      <style jsx="true">
        {`
          .focused {
            background-color: #4b5563;
            color: white;
          }
        `}
      </style>
    </div>
  );
}
