import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDashboard, 
  faArrowLeft,
  faGears,
  faBars,
  faBook,
  faUserGraduate,
  faUsers,
  faChalkboardTeacher,
  faFilePdf,
  faFeather
} from "@fortawesome/free-solid-svg-icons";
import profile from "../styles/images/profile.png";
import { destroySession } from "./services/AuthService";
import { useNavigate, useLocation } from "react-router-dom";

export default Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? 'active' : 'close'}`}>
      <a
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="logo-details">
          <i className="clickable">
            <FontAwesomeIcon icon={faBars}/>
          </i>
          <span className="logo-name">
            CM
          </span>
        </div>
      </a>
      <ul className="nav-links">
        <li className={location.pathname == "/admin" ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faDashboard}/>
            </i>
            <span className="link-name">
              Dashboard
            </span>
          </a>
        </li>
        <li className={location.pathname == "/blue-quill" ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/blue-quill')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faFeather}/>
            </i>
            <span className="link-name">
              Blue Quill
            </span>
          </a>
        </li>
        <li className={location.pathname.startsWith("/admin/users") ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/users')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faUsers}/>
            </i>
            <span className="link-name">
              Users
            </span>
          </a>
        </li>
        <li className={location.pathname.startsWith("/admin/courses") ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/courses')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faBook}/>
            </i>
            <span className="link-name">
              Courses
            </span>
          </a>
        </li>
        <li className={location.pathname.startsWith("/admin/students") ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/students')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faUserGraduate}/>
            </i>
            <span className="link-name">
              Students
            </span>
          </a>
        </li>
        <li className={location.pathname.startsWith("/admin/faculties") ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/faculties')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faChalkboardTeacher}/>
            </i>
            <span className="link-name">
              Faculties
            </span>
          </a>
        </li>
        <li className={location.pathname.startsWith("/admin/publications") ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/publications')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faFilePdf}/>
            </i>
            <span className="link-name">
              Publications
            </span>
          </a>
        </li>
        <li className={location.pathname == "/settings" ? "active" : ""}>
          <a
            onClick={() => {
              navigate('/admin/settings')
            }}
          >
            <i>
              <FontAwesomeIcon icon={faGears}/>
            </i>
            <span className="link-name">
              Settings
            </span>
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              destroySession();
              navigate('/');
            }}
          >
            <i>
              <FontAwesomeIcon icon={faArrowLeft}/>
            </i>
            <span className="link-name">
              Logout
            </span>
          </a>
        </li>
        <li>
          <div className="profile-details">
            <a href="#">
              <div className="profile-content">
                <img alt="profileImg" src={profile}/>
              </div>
              <div className="name-job">
                <div className="profile-name">
                  username
                </div>
                <div className="job">
                  JOB  
                </div>
              </div>
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
