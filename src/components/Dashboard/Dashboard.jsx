import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import service from "../../appwrite/config";
import { ID } from "appwrite";
import { useDispatch } from "react-redux";
import { logout as authSliceLogout } from "../../store/authSlice";
import Alert from "../Alert/Alert";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (!userData) return;

        setUser(userData);
        setPopupMessage({
          message: `${userData.name} logged in successfully`,
          bgColor: "blue",
        });

        const userSubjects = await service.getAllSubjectsOfAStudent(userData.$id);
        const subjects = userSubjects.documents || [];
        setSubjects(subjects);

        if (subjects.length > 0) {
          const defaultSubject = subjects[0];
          setSelectedSubject(defaultSubject);
          await fetchAttendance(userData.$id, defaultSubject.subject_id);
        }
      } catch (error) {
        console.error("Error fetching user or subjects:", error);
      }
    };

    fetchData();
  }, []);

  const fetchAttendance = async (studentId, subjectId) => {
    try {
      const res = await service.getStudentAttendance(studentId, subjectId);
      const attendance = {};
      res.documents.forEach((doc) => {
        attendance[doc.date] = { status: doc.status, id: doc.$id };
      });
      setAttendanceMap(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!subjectName || !user) return;

    try {
      const newSubject = await service.createSubject({
        name: subjectName,
        total_classes: 0,
        attended_classes: 0,
        student_id: user.$id,
        subject_id: ID.unique(),
      });

      if (newSubject) {
        setSubjects([...subjects, newSubject]);
        setSubjectName("");
        setShowForm(false);
        setPopupMessage({
          message: `${subjectName} added successfully`,
          bgColor: "green",
        });
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      setPopupMessage({
        message: "Error adding subject",
        bgColor: "red",
      });
    }
  };

  const calculatePercentage = (attended, total) => {
    if (total === 0) return "0%";
    return `${Math.round((attended / total) * 100)}%`;
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(authSliceLogout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDayClick = (date) => {
    if (!selectedSubject) return;

    const selectedDate = date.toLocaleDateString("en-CA");
    const today = new Date().toLocaleDateString("en-CA");

    if (selectedDate !== today) {
      setPopupMessage({
        message: "You can only mark or change attendance for today.",
        bgColor: "red",
      });
      return;
    }

    setSelectedDate(selectedDate);
    setShowDropdown(true);
  };

  const markAttendance = async (choice) => {
    const prev = attendanceMap[selectedDate];
    const subject = subjects.find((s) => s.subject_id === selectedSubject.subject_id);
    if (!subject || !user) return;

    let newAttendance;
    try {
      if (!prev) {
        newAttendance = await service.createAttendance({
          student_id: user.$id,
          subject_id: selectedSubject.subject_id,
          date: selectedDate,
          status: choice,
        });

        await service.updateAttendance(subject.$id, {
          attended_classes: choice === "present" ? subject.attended_classes + 1 : subject.attended_classes,
          total_classes: subject.total_classes + 1,
        });
      } else if (prev.status !== choice) {
        await service.updateAttendanceRecord(prev.id, { status: choice });

        await service.updateAttendance(subject.$id, {
          attended_classes:
            choice === "present"
              ? subject.attended_classes + 1
              : subject.attended_classes - 1,
          total_classes: subject.total_classes,
        });
      }

      const updatedSubjects = await service.getAllSubjectsOfAStudent(user.$id);
      setSubjects(updatedSubjects.documents || []);

      setAttendanceMap((prevMap) => ({
        ...prevMap,
        [selectedDate]: { status: choice, id: newAttendance?.$id || prev.id },
      }));

      setPopupMessage({
        message: choice === "present" ? "Marked Present Successfully" : "Marked Absent Successfully",
        bgColor: choice === "present" ? "green" : "red",
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      setPopupMessage({
        message: "Error marking attendance",
        bgColor: "red",
      });
    }

    setShowDropdown(false);
    setSelectedDate(null);
  };

  const tileClassName = ({ date }) => {
    const isoDate = date.toLocaleDateString("en-CA");
    const status = attendanceMap[isoDate]?.status;
    if (status === "present") return "present-tile";
    if (status === "absent") return "absent-tile";
    return null;
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    await fetchAttendance(user.$id, subject.subject_id);
  };

  const handleDeleteSubject = async (subject) => {
    if (!window.confirm(`Delete ${subject.name} and all related attendance?`)) return;

    try {
      const res = await service.getStudentAttendance(user.$id, subject.subject_id);
      const records = res?.documents || [];

      await Promise.all(records.map((r) => service.deleteAttendance(r.$id)));
      await service.deleteSubject(subject.$id);

      setSubjects(subjects.filter((s) => s.$id !== subject.$id));
      setPopupMessage({
        message: `${subject.name} deleted successfully`,
        bgColor: "green",
      });

      if (selectedSubject?.$id === subject.$id) {
        setSelectedSubject(null);
        setAttendanceMap({});
      }
    } catch (error) {
      console.error("Error deleting subject or attendance:", error);
      setPopupMessage({
        message: "Error deleting subject",
        bgColor: "red",
      });
    }
  };

  return (
    <div className="flex h-screen">
      {popupMessage && (
        <div className="absolute top-4 right-4 w-80 z-50">
          <Alert
            message={popupMessage.message}
            bgColor={popupMessage.bgColor}
            onClose={() => setPopupMessage(null)}
          />
        </div>
        
      )}

      <aside className="fixed top-0 left-0 z-40 w-64 h-screen sm:translate-x-0 flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          <div className="mb-6 p-4 flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Subject
          </button>

          {showForm && (
            <form onSubmit={handleAddSubject} className="mb-4 space-y-2">
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Subject Name"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Create
              </button>
            </form>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject.$id}
                className={`cursor-pointer bg-white dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center shadow ${
                  selectedSubject?.$id === subject.$id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleSubjectSelect(subject)}
              >
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                  <br />
                  <span className="text-sm text-blue-500">
                    {calculatePercentage(subject.attended_classes, subject.total_classes)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubject(subject);
                  }}
                  className="text-red-500 hover:text-red-700 text-lg"
                  title="Delete subject"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 01-2-2V3a2 2 0 012-2h3" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="p-4 sm:ml-64 w-full h-screen">
        {!selectedSubject ? (
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-2">Create a subject and mark your attendance</h2>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-2">Subject: {selectedSubject.name}</h2>
            <h3 className="text-2xl font-semibold mb-2">Student: {user.name}</h3>
            <div className="w-full max-w-5xl">
              <Calendar
                onClickDay={handleDayClick}
                tileClassName={tileClassName}
                className="w-full calendar-grid"
              />
            </div>

            {showDropdown && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => markAttendance("present")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Mark Present
                </button>
                <button
                  onClick={() => markAttendance("absent")}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Mark Absent
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setSelectedDate(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style>
        {`
          .react-calendar {
            border: none;
          }
          .react-calendar__month-view__days__day {
            border: 1px solid #ccc;
          }
          .present-tile {
            background-color: #bbf7d0 !important;
          }
          .absent-tile {
            background-color: #fecaca !important;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;