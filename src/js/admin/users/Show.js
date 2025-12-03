import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getUser } from "../../services/UsersService";

const renderRoles = (roles) => {
  if (!roles || !roles.length) {
    return "—";
  }

  return roles.join(", ");
};

export default UsersShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/admin/users");
      return;
    }

    getUser(id).then((payload) => {
      setUser(payload.data);
    }).catch((payload) => {
      console.error("Unable to load user", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, navigate]);

  if (isLoading) {
    return <Loader/>;
  }

  if (!user) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <p className="text-muted small mb-0">
            Unable to find this user.
          </p>
        </div>
      </div>
    );
  }

  const { first_name, last_name, username, email, roles } = user;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Directory
            </p>
            <h2 className="h4 mb-0">
              {first_name} {last_name}
            </h2>
            <p className="text-muted mb-0">
              {username}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/users")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/users/${id}/edit`)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2"/>
              Edit
            </button>
          </div>
        </div>

        <dl className="row g-3 mb-0">
          <dt className="col-sm-3 text-uppercase text-muted small fw-semibold">
            First name
          </dt>
          <dd className="col-sm-9">
            {first_name || "—"}
          </dd>
          <dt className="col-sm-3 text-uppercase text-muted small fw-semibold">
            Last name
          </dt>
          <dd className="col-sm-9">
            {last_name || "—"}
          </dd>
          <dt className="col-sm-3 text-uppercase text-muted small fw-semibold">
            Email
          </dt>
          <dd className="col-sm-9">
            {email}
          </dd>
          <dt className="col-sm-3 text-uppercase text-muted small fw-semibold">
            Roles
          </dt>
          <dd className="col-sm-9">
            {renderRoles(roles)}
          </dd>
        </dl>
      </div>
    </div>
  );
}
