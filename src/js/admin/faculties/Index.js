import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../commons/Loader";
import FacultiesList from "./List";
import { getFaculties } from "../../services/FacultiesService";

export default FacultiesIndex = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFaculties().then((payload) => {
      const records = payload.data?.records || payload.data || [];
      setFaculties(records);
    }).catch((payload) => {
      console.error("Unable to load faculties", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="faculties-index">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Administration
            </p>
            <h2 className="h4 mb-0">
              Faculties
            </h2>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/faculties/new")}
          >
            New faculty
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <FacultiesList faculties={faculties}/>
      )}
    </div>
  );
}
