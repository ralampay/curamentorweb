import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserGraduate,
  faBook,
  faChalkboardTeacher,
  faChartLine,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

const STAT_CARDS = [
  {
    label: "Active users",
    value: "1,248",
    trend: "+12% this month",
    icon: faUsers,
    color: "text-primary"
  },
  {
    label: "Students enrolled",
    value: "912",
    trend: "8 new registrations today",
    icon: faUserGraduate,
    color: "text-success"
  },
  {
    label: "Courses",
    value: "42",
    trend: "5 awaiting review",
    icon: faBook,
    color: "text-warning"
  },
  {
    label: "Faculty members",
    value: "76",
    trend: "3 onboarding this week",
    icon: faChalkboardTeacher,
    color: "text-info"
  }
];

const ACTIVITY = [
  {
    title: "System uptime",
    value: "99.98%",
    detail: "All services stable over 30 days.",
    icon: faShieldHalved,
    badge: "clean"
  },
  {
    title: "Average course completion",
    value: "68%",
    detail: "12% improvement compared to Q1.",
    icon: faChartLine,
    badge: "up"
  }
];

export default Dashboard = () => {
  return (
    <div className="dashboard-grid">
      <div className="row g-3">
        {STAT_CARDS.map((card) => (
          <div className="col-12 col-md-6 col-xl-3" key={card.label}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted text-uppercase small mb-1">
                      {card.label}
                    </p>
                    <h3 className="mb-0">
                      {card.value}
                    </h3>
                  </div>
                  <div className={`fs-2 ${card.color}`}>
                    <FontAwesomeIcon icon={card.icon}/>
                  </div>
                </div>
                <small className="text-muted">
                  {card.trend}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0">
                  Operations overview
                </h5>
                <span className="badge text-bg-secondary">
                  Updated now
                </span>
              </div>
              <p className="text-muted mb-3">
                The platform stays healthy as the team actively monitors activity, enrollments, and resource usage.
              </p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span className="text-muted">
                    24h sign-ins
                  </span>
                  <strong>
                    314
                  </strong>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span className="text-muted">
                    Active sessions
                  </span>
                  <strong>
                    89
                  </strong>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                  <span className="text-muted">
                    Support tickets open
                  </span>
                  <strong className="text-danger">
                    6
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">
                System health
              </h5>
              {ACTIVITY.map((item) => (
                <div key={item.title} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <div className="text-muted small text-uppercase">
                      {item.title}
                    </div>
                    <strong>
                      {item.value}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1 text-muted">
                      {item.detail}
                    </p>
                    <span className={`badge ${item.badge === "up" ? "text-bg-success" : "text-bg-secondary"}`}>
                      {item.badge === "up" ? "Trending up" : "Stable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
