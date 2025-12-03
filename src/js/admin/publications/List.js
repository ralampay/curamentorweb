import React from "react";
import { useNavigate } from "react-router-dom";

export default PublicationsList = ({ publications }) => {
  const navigate = useNavigate();

  if (!publications.length) {
    return (
      <div className="card border-0 shadow-sm text-center p-5">
        <div className="card-body text-muted">
          No publications yet.
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
                <th>Title</th>
                <th>Date published</th>
                <th className="text-center">File</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((publication) => (
                <tr
                  key={`publication-${publication.id}`}
                  className="clickable"
                  onClick={() => navigate(`/admin/publications/${publication.id}`)}
                >
                  <td>{publication.title}</td>
                  <td>{publication.date_published || "—"}</td>
                  <td className="text-center">
                    {publication.file_name || (publication.file_attached ? "Attached" : "—")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/admin/publications/${publication.id}/edit`);
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
