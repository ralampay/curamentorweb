import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faFeather } from "@fortawesome/free-solid-svg-icons";

export default Home = () => {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #e0f2fe, #bae6fd)" }}>
      <div className="text-center text-slate-900 px-4 py-5" style={{ maxWidth: "720px", backgroundColor: "rgba(255,255,255,0.85)", borderRadius: "18px", boxShadow: "0 20px 45px rgba(15,23,42,0.15)" }}>
        <p className="text-uppercase text-primary mb-1 fw-semibold letter-spacing-2">Curamentor</p>
        <h1 className="display-5 fw-bold mb-3 text-slate-900" style={{ textShadow: "0 2px 12px rgba(59,130,246,0.3)" }}>
          Research administration, simplified.
        </h1>
        <p className="lead mb-4">
          Manage users, students, faculties, publications, and everything in between from a single secure workspace. Ready to explore?
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a
            className="btn btn-lg btn-primary px-4 d-flex align-items-center gap-2"
            href="#/admin"
          >
            <FontAwesomeIcon icon={faRocket}/>
            Go to admin dashboard
          </a>
          <a
            className="btn btn-lg btn-outline-primary px-4 d-flex align-items-center gap-2"
            href="#/blue-quill"
          >
            <FontAwesomeIcon icon={faFeather}/>
            Visit Blue Quill
          </a>
        </div>
      </div>
    </div>
  )
}
