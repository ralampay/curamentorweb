import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { renderInputErrors, getInputClassName } from "../../helpers/AppHelper";
import { saveCourse, getCourse } from "../../services/CoursesService";
import { COURSE } from "../../models/course";

const createEmptyForm = () => ({ ...COURSE });

export default CoursesForm = () => {
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
    getCourse(id).then((payload) => {
      const course = payload.data;
      setForm({
        id: course.id,
        name: course.name || "",
        code: course.code || ""
      });
    }).catch((payload) => {
      console.error("Unable to load course", payload?.response?.data);
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

    saveCourse(form).then(() => {
      navigate("/admin/courses");
    }).catch((payload) => {
      console.error("Error saving course", payload?.response?.data);
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
              Curriculum
            </p>
            <h2 className="h4 mb-0">
              {isEditMode ? "Edit course" : "Create a course"}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={() => navigate("/admin/courses")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Back
          </button>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">
              Name
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "name")}
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "name")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Code
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "code")}
              value={form.code}
              onChange={(event) => handleChange("code", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "code")}
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
