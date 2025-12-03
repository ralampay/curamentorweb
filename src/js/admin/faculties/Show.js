import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getFaculty } from "../../services/FacultiesService";

export default FacultiesShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/admin/faculties");
      return;
    }

    getFaculty(id).then((payload) => {
      setFaculty(payload.data);
    }).catch((payload) => {
      console.error("Unable to load faculty", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, navigate]);

  if (isLoading) {
    return <Loader/>;
  }

  if (!faculty) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-muted">
          Faculty not found.
        </div>
      </div>
    );
  }

  const { first_name, middle_name, last_name, id_number } = faculty;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Faculty directory
            </p>
            <h2 className="h4 mb-0">
              {`${first_name} ${middle_name || ""} ${last_name}`.trim()}
            </h2>
            <p className="text-muted mb-0">
              ID #{id_number}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/faculties")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/faculties/${id}/edit`)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2"/>
              Edit
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              First name
            </h6>
            <p className="mb-0">
              {first_name || "—"}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Middle name
            </h6>
            <p className="mb-0">
              {middle_name || "—"}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Last name
            </h6>
            <p className="mb-0">
              {last_name || "—"}
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
