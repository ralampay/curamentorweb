import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../commons/Loader";
import CoursesList from "./List";
import { getCourses } from "../../services/CoursesService";

export default CoursesIndex = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCourses().then((payload) => {
      const source = payload.data?.records ?? payload.data;
      setCourses(Array.isArray(source) ? source : []);
    }).catch((payload) => {
      console.error("Unable to load courses", payload?.response?.data);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="courses-index">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-uppercase text-muted small fw-semibold mb-1">
              Curriculum
            </p>
            <h2 className="h4 mb-0">
              Courses
            </h2>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate("/admin/courses/new")}
          >
            <FontAwesomeIcon icon={faPlus}/>
            New course
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader/>
      ) : (
        <CoursesList courses={courses} />
      )}
    </div>
  );
}
