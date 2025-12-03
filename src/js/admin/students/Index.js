import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import StudentsList from "./List";
import { getStudents } from "../../services/StudentsService";

export default StudentsIndex = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudents().then((payload) => {
      const records = payload.data?.records || payload.data || [];
      setStudents(records);
    }).catch((payload) => {
      console.error("Unable to load students", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="students-index">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Student records
            </p>
            <h2 className="h4 mb-0">
              Students
            </h2>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate("/admin/students/new")}
          >
            <FontAwesomeIcon icon={faPlus}/>
            New student
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <StudentsList students={students}/>
      )}
    </div>
  );
}
