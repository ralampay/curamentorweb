import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getStudent } from "../../services/StudentsService";

export default StudentsShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/admin/students");
      return;
    }

    getStudent(id).then((payload) => {
      setStudent(payload.data);
    }).catch((payload) => {
      console.error("Unable to load student", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, navigate]);

  if (isLoading) {
    return <Loader/>;
  }

  if (!student) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-muted">
          Student not found.
        </div>
      </div>
    );
  }

  const { first_name, middle_name, last_name, id_number, course, course_id } = student;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Student record
            </p>
            <h2 className="h4 mb-0">
              {`${first_name} ${middle_name || ""} ${last_name}`.trim()}
            </h2>
            <p className="text-muted mb-0">
              ID {id_number}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/students")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/students/${id}/edit`)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2"/>
              Edit
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Course
            </h6>
            <p className="mb-0">
              {course?.name || course?.code || course_id || "—"}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              ID number
            </h6>
            <p className="mb-0">
              {id_number || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
