import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getCourse } from "../../services/CoursesService";

export default CoursesShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/admin/courses");
      return;
    }

    getCourse(id).then((payload) => {
      setCourse(payload.data);
    }).catch((payload) => {
      console.error("Unable to load course", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, navigate]);

  if (isLoading) {
    return <Loader/>;
  }

  if (!course) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-muted">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Curriculum
            </p>
            <h2 className="h4 mb-0">
              {course.name}
            </h2>
            <p className="text-muted mb-0">
              {course.code}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/courses")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/courses/${id}/edit`)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2"/>
              Edit
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Name
            </h6>
            <p className="mb-0">
              {course.name || "—"}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Code
            </h6>
            <p className="mb-0">
              {course.code || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
