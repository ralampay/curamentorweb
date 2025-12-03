import React from "react";
import { useNavigate } from "react-router-dom";

export default StudentsList = ({ students }) => {
  const navigate = useNavigate();

  if (!students.length) {
    return (
      <div className="card border-0 shadow-sm text-center p-5">
        <div className="card-body text-muted">
          No students yet.
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
                <th>ID number</th>
                <th>Course</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={`student-${student.id}`} className="clickable" onClick={() => navigate(`/admin/students/${student.id}`)}>
                  <td>{`${student.first_name} ${student.middle_name || ""} ${student.last_name}`.trim()}</td>
                  <td>{student.id_number}</td>
                  <td>{student.course?.name || student.course_name || student.course_id || "—"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/admin/students/${student.id}/edit`);
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
