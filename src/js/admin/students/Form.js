import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { renderInputErrors, getInputClassName } from "../../helpers/AppHelper";
import { saveStudent, getStudent } from "../../services/StudentsService";
import { getCourses } from "../../services/CoursesService";
import { STUDENT } from "../../models/student";

const createEmpty = () => ({ ...STUDENT });

export default StudentsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(createEmpty);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then((payload) => {
      const source = payload.data?.records ?? payload.data;
      setCourses(Array.isArray(source) ? source : []);
    }).catch((payload) => {
      console.error("Unable to load courses", payload?.response?.data);
    });
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmpty());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getStudent(id).then((payload) => {
      const student = payload.data;
      setForm({
        id: student.id,
        first_name: student.first_name || "",
        middle_name: student.middle_name || "",
        last_name: student.last_name || "",
        id_number: student.id_number || "",
        email: student.email || "",
        course_id: student.course_id || student.course?.id || ""
      });
    }).catch((payload) => {
      console.error("Unable to load student", payload?.response?.data);
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

    saveStudent(form).then(() => {
      navigate("/admin/students");
    }).catch((payload) => {
      console.error("Unable to save student", payload?.response?.data);
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
              Student records
            </p>
            <h2 className="h4 mb-0">
              {isEditMode ? "Edit student" : "Create a student"}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={() => navigate("/admin/students")}
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
          <div className="col-12 col-md-6">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              className={getInputClassName(errors, "email")}
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "email")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">
              Course
            </label>
            <select
              className={getInputClassName(errors, "course_id")}
              value={form.course_id}
              onChange={(event) => handleChange("course_id", event.target.value)}
              disabled={isSaving}
            >
              <option value="">
                Select course
              </option>
              {courses.map((course) => (
                <option value={course.id} key={`course-option-${course.id}`}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {renderInputErrors(errors, "course_id")}
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
