import React from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../../styles/images/profile.png";

export default List = ({ users }) => {
  const navigate = useNavigate();

  const getAvatar = (user) => {
    return user.avatar_url || profile;
  }

  const renderRoles = (user) => {
    if (user.roles && user.roles.length) {
      return user.roles.join(", ");
    }

    return "—";
  }

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="text-uppercase text-muted small">
              <tr>
                <th scope="col">
                  User
                </th>
                <th scope="col">
                  Email
                </th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr 
                    key={`user-row-${user.id}`}
                    className="clickable"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/admin/users/${user.id}/edit`);
                    }}
                  >
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={getAvatar(user)}
                          className="rounded-circle"
                          alt={`${user.full_name}'s avatar`}
                          width={48}
                          height={48}
                        />
                        <div>
                          <div className="fw-semibold">
                            {user.full_name}
                          </div>
                          <div className="text-muted small">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      {user.username}
                    </td>
                    <td className="text-muted">
                      {renderRoles(user)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/admin/users/${user.id}/edit`);
                        }}
                      >
                        View profile
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
