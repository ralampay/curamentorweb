import React from "react";
import { useNavigate } from "react-router-dom";

export default FacultiesList = ({ faculties }) => {
  const navigate = useNavigate();

  if (!faculties.length) {
    return (
      <div className="card border-0 shadow-sm text-center p-5">
        <div className="card-body text-muted">
          No faculty members yet.
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
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={`faculty-${faculty.id}`} className="clickable" onClick={() => navigate(`/admin/faculties/${faculty.id}`)}>
                  <td>{`${faculty.first_name} ${faculty.middle_name || ""} ${faculty.last_name}`.trim()}</td>
                  <td>{faculty.id_number}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/admin/faculties/${faculty.id}/edit`);
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
