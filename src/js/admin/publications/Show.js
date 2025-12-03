import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilePdf, faBrain, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import { getPublication, deletePublication, vectorize } from "../../services/PublicationsService";
import { getFaculties } from "../../services/FacultiesService";
import { getStudents } from "../../services/StudentsService";
import { addPublicationAuthor, getPublicationAuthors, deletePublicationAuthor } from "../../services/AuthorsService";
import ConfirmationModal from "../../commons/ConfirmationModal";

export default PublicationsShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [personType, setPersonType] = useState("faculty");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAuthorModalOpen, setIsDeleteAuthorModalOpen] = useState(false);
  const [isDeletingAuthor, setIsDeletingAuthor] = useState(false);
  const [authorToRemove, setAuthorToRemove] = useState(null);
  const [isVectorizeModalOpen, setIsVectorizeModalOpen] = useState(false);
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [vectorizeMessage, setVectorizeMessage] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/admin/publications");
      return;
    }

    getPublication(id).then((payload) => {
      setPublication(payload.data);
    }).catch((payload) => {
      console.error("Unable to load publication", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id, navigate]);

  const refreshAuthors = useCallback(() => {
    if (!id) {
      return;
    }

    getPublicationAuthors(id).then((payload) => {
      const records = payload.data?.records ?? payload.data ?? [];
      console.log(records);
      setAuthors(Array.isArray(records) ? records : []);
    }).catch((payload) => {
      console.error("Unable to load publication authors", payload?.response?.data);
    });
  }, [id]);

  useEffect(() => {
    refreshAuthors();
  }, [refreshAuthors]);

  useEffect(() => {
    const controller = new AbortController();

    const params = { query: searchQuery };
    setIsSearching(true);

    const fetchPeople = personType === "faculty" ? getFaculties : getStudents;

    fetchPeople({ ...params, page: 1, per_page: 20 }, { signal: controller.signal })
      .then((payload) => {
        const records = payload.data?.records ?? payload.data ?? [];
        setSearchResults(Array.isArray(records) ? records : []);
        setSearchError(null);
      })
      .catch((payload) => {
        if (payload.name !== "CanceledError") {
          console.error("Unable to search people", payload?.response?.data);
          setSearchError("Unable to fetch people");
        }
      })
      .finally(() => {
        setIsSearching(false);
      });

    return () => {
      controller.abort();
    };
  }, [personType, searchQuery]);

  const searchLabel = personType === "faculty" ? "Faculty" : "Student";

  const handleAddAuthor = () => {
    if (!selectedPerson) {
      return;
    }

    setIsAddingAuthor(true);

    addPublicationAuthor(id, {
      person_id: selectedPerson.id,
      person_type: personType.charAt(0).toUpperCase() + personType.slice(1)
    }).then(() => {
      refreshAuthors();
      setIsAddModalOpen(false);
      setSelectedPerson(null);
      setSearchQuery("");
    }).catch((payload) => {
      console.error("Unable to add author", payload?.response?.data);
    }).finally(() => {
      setIsAddingAuthor(false);
    });
  };

  const handleDeleteAuthor = () => {
    if (!authorToRemove) {
      return;
    }

    setIsDeletingAuthor(true);

    deletePublicationAuthor(id, authorToRemove.id).then(() => {
      setIsDeleteAuthorModalOpen(false);
      setAuthorToRemove(null);
      setIsDeletingAuthor(false);
      refreshAuthors();
    }).catch((payload) => {
      console.error("Unable to delete author", payload?.response?.data);
      setIsDeletingAuthor(false);
    });
  };

  const buildPersonLabel = (person) => {
    if (!person) {
      return "";
    }

    const first = person.person_first_name || person.first_name || person.person?.first_name || "";
    const middle = person.person_middle_name || person.middle_name || person.person?.middle_name || "";
    const last = person.person_last_name || person.last_name || person.person?.last_name || "";

    return `${first} ${middle} ${last}`.replace(/\s+/g, " ").trim();
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    setIsDeleteModalOpen(false);

    deletePublication(id).then(() => {
      navigate("/admin/publications");
    }).catch((payload) => {
      console.error("Unable to delete publication", payload?.response?.data);
      setIsDeleting(false);
      setIsDeleteModalOpen(true);
    });
  };

  const handleVectorize = () => {
    setIsVectorizing(true);
    setIsVectorizeModalOpen(false);

    vectorize(id).then(() => {
      setVectorizeMessage("Vectorization request submitted successfully.");
      setTimeout(() => setVectorizeMessage(""), 5000);
    }).catch((payload) => {
      console.error("Unable to vectorize publication", payload?.response?.data);
    }).finally(() => {
      setIsVectorizing(false);
    });
  };

  if (isLoading) {
    return <Loader/>;
  }

  if (!publication) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-muted">
          Publication not found.
        </div>
      </div>
    );
  }

  const fileUrl = publication.file_url || publication.file_path || "#";

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Publications
            </p>
            <h2 className="h4 mb-1">{publication.title}</h2>
            <p className="text-muted mb-0">
              Published on {publication.date_published || "—"}
            </p>
          </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faUserPlus}/>
            Add author
          </button>
          <button
            className="btn btn-outline-info"
            onClick={() => setIsVectorizeModalOpen(true)}
          >
            <FontAwesomeIcon icon={faBrain} className="me-2"/>
            Vectorize
          </button>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <FontAwesomeIcon icon={faTrash}/>
            Delete
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/publications")}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2"/>
            Back
          </button>
          </div>
        </div>

        {vectorizeMessage &&
          <div className="alert alert-success rounded-3 border border-success mb-4">
            {vectorizeMessage}
          </div>
        }
        <div className="border-top pt-4 mt-4">
          <h5 className="mb-3">Authors</h5>
          {authors.length ? (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>ID</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    <tr key={`author-${author.id}`}>
                      <td>{buildPersonLabel(author)}</td>
                      <td>{author.person_type}</td>
                      <td>{author.person_id_number || "—"}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => {
                            setAuthorToRemove(author);
                            setIsDeleteAuthorModalOpen(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash}/>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted small">
              No authors recorded yet.
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              File name
            </h6>
            <p className="mb-0">
              {publication.file_name || "—"}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <h6 className="text-uppercase text-muted small mb-1">
              Attachment
            </h6>
            {publication.file_attached ? (
              <a
                className="text-decoration-none"
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faFilePdf} className="me-2"/>
                View PDF
              </a>
            ) : (
              <p className="mb-0 text-muted">No file attached.</p>
              )}
          </div>
        </div>
        </div>
      </div>
      {isAddModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(2,6,23,0.65)", zIndex: 2000 }}>
          <div className="card shadow-lg border-0" style={{ width: "min(600px, 90vw)" }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="mb-0">Add author</h5>
                  <small className="text-muted">
                    Search {searchLabel}s and attach them to this publication.
                  </small>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
              </div>
              <div className="btn-group mb-3" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${personType === "faculty" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => {
                    setPersonType("faculty");
                    setSelectedPerson(null);
                  }}
                >
                  Faculty
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${personType === "student" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => {
                    setPersonType("student");
                    setSelectedPerson(null);
                  }}
                >
                  Student
                </button>
              </div>
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  placeholder={`Search ${searchLabel}s`}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery("")}>
                  Clear
                </button>
              </div>
              <div className="mb-2 text-muted small">
                {isSearching ? "Searching…" : (searchError || `Showing ${searchResults.length} results`)}
              </div>
              <div className="border rounded-3 p-2" style={{ maxHeight: "280px", overflowY: "auto" }}>
                {isSearching ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"/>
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-muted small text-center py-4">No results yet.</p>
                ) : (
                  searchResults.map((person) => (
                    <div
                      key={`${personType}-${person.id}`}
                      className={`p-2 rounded-2 mb-1 ${selectedPerson?.id === person.id && selectedPerson?.type === personType ? "bg-primary text-white" : "bg-white"} clickable`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedPerson({ ...person, type: personType })}
                    >
                      <div className="fw-semibold">
                        {buildPersonLabel(person)}
                      </div>
                      <div className="text-muted small">
                        {person.id_number || person.email || "No ID"}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  disabled={!selectedPerson || isAddingAuthor}
                  onClick={handleAddAuthor}
                >
                  {isAddingAuthor ? "Saving…" : "Add author"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        show={isDeleteAuthorModalOpen}
        header="Delete author"
        content={`Remove ${buildPersonLabel(authorToRemove)} from this publication?`}
        isLoading={isDeletingAuthor}
        onPrimaryClicked={handleDeleteAuthor}
        onSecondaryClicked={() => {
          if (!isDeletingAuthor) {
            setIsDeleteAuthorModalOpen(false);
            setAuthorToRemove(null);
          }
        }}
      />
      <ConfirmationModal
        show={isDeleteModalOpen}
        header="Delete publication"
        content="This action cannot be undone. Are you sure you want to permanently delete this publication?"
        isLoading={isDeleting}
        onPrimaryClicked={handleConfirmDelete}
        onSecondaryClicked={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
          }
        }}
      />
      <ConfirmationModal
        show={isVectorizeModalOpen}
        header="Vectorize publication"
        content="Generate vector embeddings for this publication and add it to the knowledge base?"
        isLoading={isVectorizing}
        onPrimaryClicked={handleVectorize}
        onSecondaryClicked={() => {
          if (!isVectorizing) {
            setIsVectorizeModalOpen(false);
          }
        }}
      />
    </>
  );
}
