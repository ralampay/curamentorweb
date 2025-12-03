import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { renderInputErrors, getInputClassName } from "../../helpers/AppHelper";
import { savePublication, getPublication } from "../../services/PublicationsService";
import { PUBLICATION } from "../../models/publication";

const createEmpty = () => ({ ...PUBLICATION });

export default PublicationsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(createEmpty);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [fileLabel, setFileLabel] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      setForm(createEmpty());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getPublication(id).then((payload) => {
      const publication = payload.data;
      setForm({
        id: publication.id,
        title: publication.title || "",
        date_published: publication.date_published || "",
        file: null
      });
      setFileLabel(publication.file_name || "");
    }).catch((payload) => {
      console.error("Unable to load publication", payload?.response?.data);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setForm((previous) => ({
      ...previous,
      file
    }));
    setFileLabel(file ? file.name : "");
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setErrors({});

    console.log(form);

    savePublication(form).then(() => {
      navigate("/admin/publications");
    }).catch((payload) => {
      console.error("Unable to save publication", payload?.response?.data);
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
              Publications
            </p>
            <h2 className="h4 mb-0">
              {isEditMode ? "Edit publication" : "New publication"}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={() => navigate("/admin/publications")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Back
          </button>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">
              Title
            </label>
            <input
              type="text"
              className={getInputClassName(errors, "title")}
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "title")}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase text-muted small">
              Date published
            </label>
            <input
              type="date"
              className={getInputClassName(errors, "date_published")}
              value={form.date_published}
              onChange={(event) => handleChange("date_published", event.target.value)}
              disabled={isSaving}
            />
            {renderInputErrors(errors, "date_published")}
          </div>
          <div className="col-12">
            <label className="form-label">
              File (PDF only, max 10 MB)
            </label>
            <div className="input-group">
              <input
                type="file"
                className="form-control"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isSaving}
              />
              <span className="input-group-text">
                <FontAwesomeIcon icon={faFileUpload}/>
              </span>
            </div>
            <small className="text-muted">
              {fileLabel || "No file selected"}
            </small>
            {renderInputErrors(errors, "file")}
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
