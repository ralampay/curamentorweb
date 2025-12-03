import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getCourse, getCourseStudents } from "../../services/CoursesService";

export default CoursesShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);

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

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsStudentsLoading(true);
    getCourseStudents(id).then((payload) => {
      const source = payload.data?.records ?? payload.data;
      setStudents(Array.isArray(source) ? source : []);
    }).catch((payload) => {
      console.error("Unable to load course students", payload?.response?.data);
    }).finally(() => {
      setIsStudentsLoading(false);
    });
  }, [id]);

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

        <div className="row g-3 mb-4">
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

        <hr/>

        <div className="mt-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="h6 mb-0 text-uppercase text-muted">
              Students under this course
            </h5>
            <span className="badge text-bg-secondary">
              {isStudentsLoading ? "Loading…" : `${students.length} records`}
            </span>
          </div>
          {isStudentsLoading ? (
            <Loader/>
          ) : students.length === 0 ? (
            <p className="text-muted">No students enrolled yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Name</th>
                    <th>ID number</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={`student-${student.id}`}
                      className="clickable"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/students/${student.id}`)}
                    >
                      <td>
                        {`${student.first_name} ${student.middle_name || ""} ${student.last_name}`.trim()}
                      </td>
                      <td>{student.id_number || "—"}</td>
                      <td>{student.email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
