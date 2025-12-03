import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { renderInputErrors, getInputClassName } from "../../helpers/AppHelper";
import { saveFaculty, getFaculty } from "../../services/FacultiesService";
import { FACULTY } from "../../models/faculty";

const createEmpty = () => ({ ...FACULTY });

export default FacultiesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(createEmpty);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmpty());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getFaculty(id).then((payload) => {
      const faculty = payload.data;
      setForm({
        id: faculty.id,
        first_name: faculty.first_name || "",
        middle_name: faculty.middle_name || "",
        last_name: faculty.last_name || "",
        id_number: faculty.id_number || ""
      });
    }).catch((payload) => {
      console.error("Unable to load faculty", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, isEditMode]);

  const handleChange = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setErrors({});

    saveFaculty(form).then(() => {
      navigate("/admin/faculties");
    }).catch((payload) => {
      console.error("Unable to save faculty", payload?.response?.data);
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
              Faculty directory
            </p>
            <h2 className="h4 mb-0">
              {isEditMode ? "Edit faculty" : "New faculty"}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={() => navigate("/admin/faculties")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Back
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
              onChange={(event) => handleChange("first_name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "first_name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Middle name
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "middle_name")}
              value={form.middle_name}
              onChange={(event) => handleChange("middle_name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "middle_name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Last name
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "last_name")}
              value={form.last_name}
              onChange={(event) => handleChange("last_name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "last_name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              ID number
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "id_number")}
              value={form.id_number}
              onChange={(event) => handleChange("id_number", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "id_number")}
          </div>
        </div>

        <div className="mt-4 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            disabled={isSaving}
            onClick={handleSubmit}
          >
            <FontAwesomeIcon icon={faSave} className="me-2"/>
            {isEditMode ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
