import React from "react";
import { useParams } from "react-router-dom";
import P2PPaymentsComponent from "./P2PPaymentsComponent"; // Import your component files
import P2PLoansComponent from "./P2PLoansComponent";
import ROROLoansComponent from "./ROROLoansComponent";
// ... Import other component files

function Dashboard() {
  const { componentId } = useParams();

  let componentContent = null;

  switch (componentId) {
    case "p2p-payments":
      componentContent = <P2PPaymentsComponent />;
      break;
    case "p2p-loans":
      componentContent = <P2PLoansComponent />;
      break;
    case "roro-loans":
      componentContent = <ROROLoansComponent />;
      break;
    // Add more cases for other components
    default:
      componentContent = <div>Select a component from the sidebar</div>;
  }

  return <div className="dashboard-container">{componentContent}</div>;
}

export default Dashboard;
