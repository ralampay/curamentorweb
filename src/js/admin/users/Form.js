import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { renderInputErrors, getInputClassName } from "../../helpers/AppHelper";
import { saveUser, getUser } from "../../services/UsersService";
import { DEFAULT_USER } from "../../models/user";

const createEmptyForm = () => ({ ...DEFAULT_USER });

export default UsersForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(createEmptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmptyForm());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getUser(id).then((payload) => {
      const user = payload.data;

      setForm({
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        password_confirmation: ""
      });
    }).catch((payload) => {
      console.error("Unable to load user", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, isEditMode]);

  const handleInputChange = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setErrors({});

    const payload = { ...form };

    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    saveUser(payload).then(() => {
      navigate("/admin/users");
    }).catch((payload) => {
      console.error("Error saving user", payload?.response?.data);
      setErrors(payload?.response?.data || {});
      setIsSaving(false);
    });
  };

  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              User management
            </p>
            <h2 className="h4 mb-0">
              {isEditMode ? "Edit user" : "Create a user"}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={() => navigate("/admin/users")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Back to directory
          </button>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">
              First name
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "first_name")}
              value={form.first_name}
              onChange={(event) => handleInputChange("first_name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "first_name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Last name
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "last_name")}
              value={form.last_name}
              onChange={(event) => handleInputChange("last_name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "last_name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              className={getInputClassName(errors, "email")}
              value={form.email}
              onChange={(event) => handleInputChange("email", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "email")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              className={getInputClassName(errors, "password")}
              value={form.password}
              onChange={(event) => handleInputChange("password", event.target.value)}
              disabled={isSaving}
              placeholder={isEditMode ? "Leave blank to keep current password" : ""}
            />
            {renderInputErrors(errors, "password")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Password confirmation
            </label>
            <input
              type="password"
              className={getInputClassName(errors, "password_confirmation")}
              value={form.password_confirmation}
              onChange={(event) => handleInputChange("password_confirmation", event.target.value)}
              disabled={isSaving}
              placeholder={isEditMode ? "Leave blank to keep current password" : ""}
            />
            {renderInputErrors(errors, "password_confirmation")}
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSaving}
            onClick={handleSubmit}
          >
            <FontAwesomeIcon icon={faSave} className="me-2"/>
            {isEditMode ? "Save changes" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}
