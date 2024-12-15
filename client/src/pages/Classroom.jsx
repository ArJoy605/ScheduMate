import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import RoutineTab from "../components/RoutineTab";
import CalenderTab from "../components/CalenderTab";
import EventsTab from "../components/EventsTab";
import { useClassroomContext } from "../contexts/classroomContext";
import UsersTab from "../components/UsersTab";

export default function Dashboard() {
  const { focusedClass } = useClassroomContext();

  const tabs = [
    {
      label: "Events",
      content: <EventsTab />,
    },
    {
      label: "Routine",
      content: <RoutineTab />,
    },
    {
      label: "Calender",
      content: <CalenderTab />,
    },
  ];

  if (focusedClass.class_role === "admin") {
    tabs.push({ label: "Users", content: <UsersTab /> });
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow justify-center items-center overflow-y-auto mt-12 text-slate-200">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
