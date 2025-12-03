import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../commons/Loader";
import PublicationsList from "./List";
import { getPublications } from "../../services/PublicationsService";

export default PublicationsIndex = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublications().then((payload) => {
      const records = payload.data?.records ?? payload.data ?? [];
      setPublications(Array.isArray(records) ? records : []);
    }).catch((payload) => {
      console.error("Unable to load publications", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="publications-index">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Publications
            </p>
            <h2 className="h4 mb-0">
              Research library
            </h2>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/publications/new")}
          >
            New publication
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <PublicationsList publications={publications}/>
      )}
    </div>
  );
}
