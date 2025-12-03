import React from "react";
import { useNavigate } from "react-router-dom";

export default CoursesList = ({ courses }) => {
  const navigate = useNavigate();

  if (!courses.length) {
    return (
      <div className="card border-0 shadow-sm text-center p-5">
        <div className="card-body">
          <p className="mb-0 text-muted">
            No courses yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light text-uppercase text-muted small">
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={`course-${course.id}`} className="clickable" onClick={() => navigate(`/admin/courses/${course.id}`)}>
                  <td>{course.name}</td>
                  <td>{course.code}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/admin/courses/${course.id}/edit`);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
