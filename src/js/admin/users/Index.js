import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/UsersService";
import Loader from "../../commons/Loader";
import List from "./List";
import Pagination from "../../Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMagnifyingGlass, 
  faPlus
} from '@fortawesome/free-solid-svg-icons';

export default Index = () => {
  const navigate = useNavigate();
  const [users, setUsers]                         = useState([]);
  const [totalPages, setTotalPages]               = useState(1);
  const [currentPage, setCurrentPage]             = useState(1);
  const [isLoading, setIsLoading]                 = useState(true);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);

  const [args, setArgs] = useState({ page: 1 });

  const [filterByName, setFilterByName]           = useState("");

  const sync = () => {
    getUsers(args).then((payload) => {
      let data = payload.data;

      setUsers(data.records);
      setTotalPages(data.total_pages);
      setCurrentPage(data.current_page);
      setIsLoading(false);
    }).catch((payload) => {
      console.log("Error in fetching users:");
      console.log(payload.response.data);
    });
  }

  useEffect(() => {
    sync();
  }, [args]);

  const applyFilters = (page = 1) => {
    const params = { page };
    const trimmedName = filterByName.trim();

    if (trimmedName) {
      params.query = trimmedName;
    }

    setArgs(params);
  }

  const handleSearch = () => {
    setIsLoading(true);
    setCurrentPage(1);
    applyFilters(1);
  }

  const handleResetFilters = () => {
    setFilterByName("");
    setIsLoading(true);
    setCurrentPage(1);
    setArgs({ page: 1 });
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage === currentPage) {
      return;
    }

    setIsLoading(true);
    setCurrentPage(newPage);
    applyFilters(newPage);
  }

  return (
    <div className="users-index">
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Administration
            </p>
            <h2 className="h4 mb-2">
              User Directory
            </h2>
            <p className="text-muted mb-0">
              Search, filter, and manage every active account in one place.
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                setIsSearchPanelVisible(!isSearchPanelVisible);
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
              {isSearchPanelVisible ? 'Hide search' : 'Search'}
            </button>
            <button
              className="btn btn-primary"
              disabled={isLoading}
              onClick={() => {
                navigate('/admin/users/new');
              }}
            >
              <i>
                <FontAwesomeIcon icon={faPlus} />
              </i>
              <span className="ms-2">
                New User
              </span>
            </button>
          </div>
        </div>
      </div>

      {isSearchPanelVisible &&
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
            <div className="col-12 col-lg-7">
              <label className="form-label text-uppercase text-muted small fw-semibold mb-1">
                Search users
              </label>
              <div className="input-group input-group-lg">
                  <span className="input-group-text bg-transparent">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Name, username, or email"
                    name="q"
                    value={filterByName}
                    disabled={isLoading}
                    onChange={(event) => {
                      setFilterByName(event.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-5 d-flex gap-2">
                <button 
                  className="btn btn-primary flex-grow-1"
                  disabled={isLoading}
                  onClick={handleSearch}
                >
                  <i>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                  </i>
                  <span className="ms-2">
                    Apply
                  </span>
                </button>
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  disabled={isLoading}
                  onClick={handleResetFilters}
                >
                  Clear
                </button>
              </div>
            </div>

          </div>
        </div>
      }

      {(() => {
        if (isLoading) {
          return (
            <Loader/>
          )
        }

        if (!users.length) {
          return (
            <div className="card border-0 shadow-sm text-center py-5">
              <div className="card-body">
                <h5 className="mb-2">
                  No users found
                </h5>
                <p className="text-muted mb-4">
                  Try adjusting your search criteria or reset all filters to start over.
                </p>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleResetFilters}
                  disabled={isLoading}
                >
                  Reset filters
                </button>
              </div>
            </div>
          )
        }

        return (
          <React.Fragment>
            <List users={users}/>
            {totalPages > 1 &&
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrevious={() => handlePageChange(currentPage - 1)}
                handlePageClick={(i) => handlePageChange(i)}
                handleNext={() => handlePageChange(currentPage + 1)}
              />
            }
          </React.Fragment>
        )
      })()}
    </div>
  )
}
