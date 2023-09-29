import React, { useEffect, useState } from "react";
import "./Home.css";
import { Paper, IconButton, Tooltip } from "@mui/material";
import COLevis from "./Components/COLevis";
import P2PPayments from "./Components/P2PPayments";
import P2PLoans from "./Components/P2PLoans";
import Reserves from "./Components/Reserves";
import ROROLoans from "./Components/ROROLoans";
import P2RSurplusFundsTransfer from "./Components/P2RSurplusFundsTransfer";
import R2CSurplusFundsTransfer from "./Components/R2CSurplusFundsTransfer";
import Payments from "./Components/Payments";
import ReceiptFromRO from "./Components/ReceiptFromRO";
import AssetsFunds from "./Components/AssetsFunds";
import TermLoanSetoff from "./Components/TermLoanSetoff";
import axios from "axios";
import jwtDecode from "jwt-decode";
import ViewSidebar from "@mui/icons-material/Menu";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";

function Home() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [idToken, setIdToken] = useState(localStorage.getItem("idToken"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [noComponentSelected, setNoComponentSelected] = useState(true); 

  const listItems = [
    "P2P Payments",
    "P2P Loans",
    "RO-RO Loans",
    "P2R Surplus Fund Transfer",
    "Payments",
    "R2C Surplus Fund Transfer",
    "Receipt from RO",
    "CO Levis",
    "Asset Funds",
    "Term Loan Set off",
    "Reserves",
  ];

  const itemContent = {
    // "P2P Payments": <P2PPayments />,
    // "CO Levis": <COLevis />,
    // "Reserves": <Reserves />
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowCloseIcon(true);
    setNoComponentSelected(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let email;

  useEffect(() => {
    if (idToken) {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("idToken"));
        email = decodedToken.email;
      } catch (error) {
        console.error("Error decoding the token:", error);
      }

      async function UserData() {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const Cookie = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const response = await axios.get(
            `https://api.p360.build:9003/v1/user/fetchUserDetails/${email}`,
            Cookie
          );
          const { firstName, lastName } = response.data.data;
          setFirstName(firstName);
          setLastName(lastName);
        } catch (error) {
          console.error("Error fetching User's data:", error);
        }
      }
      UserData();
    }
  }, [idToken]);

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      {isSidebarOpen && (
        <Paper
          style={{
            margin: "2%",
            padding: "1%",
            marginRight: "0.5%",
            marginLeft:"1%",
            marginTop: "1%",
            maxWidth: "300px",
            height: "92vh",
            background: "#f0f5f4",
            borderRadius: "20px",
            paddingRight: "6%",
            overflowY: "auto",
          }}
        >
          <nav>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                background: "#f0f5f4",
              }}
            >
              <header>
                <b>Fund Flows</b>
              </header>
            </div>
            <ul className="homeUL">
              {listItems.map((item) => (
                <li
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={selectedItem === item ? "selected" : ""}
                >
                  <div>
                  {item === "P2P Payments" && <SwapVertIcon  style={{height:"2.2vh"}}/>}
                  {item === "P2P Loans" && <CurrencyRupeeIcon style={{height:"2.2vh"}}/>}
                  {item === "RO-RO Loans" && <CreditCardIcon style={{height:"2.2vh"}}/>}
                  {item === "P2R Surplus Fund Transfer"&&<AccountBalanceWalletOutlinedIcon style={{height:"2.2vh"}}/>}                  {item === "Payments" && <PaymentsOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "R2C Surplus Fund Transfer" && <AddBusinessOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "Receipt from RO" && <ReceiptOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "CO Levis" && <RequestQuoteOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "Asset Funds" && <AccountBalanceOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "Term Loan Set off" && <MoneyOffOutlinedIcon style={{height:"2.2vh"}}/>}
                  {item === "Reserves" && <LocalAtmOutlinedIcon style={{height:"2.2vh"}}/>}
                    {item}
                    </div>
                </li>
              ))}
            </ul>
          </nav>
        </Paper>
      )}

      <div
        style={{
          marginTop: "1%",
          height: "96vh",
          flex: 1,
          background: "#f0f5f4",
          borderRadius: "20px",
          overflowY: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          {noComponentSelected && (
    <img
      src="https://www.fyorin.com/hubfs/phast.jpg"
      alt="Image"
      style={{ maxWidth: "100%", height: "100vh",width:"200vh", opacity: "25%" }}/>
  )}
          <div
            style={{
              position: "absolute",
              top: "0vh",
              left: "4vh",
              // width:"15vw",
              fontSize:"1.5vw"
            }}
          >
            <h1 style={{ color: "#F4F8F7" }}>Financial Fund Flows</h1>
          </div>
        </div>

        {selectedItem && (
          <div>
            {showCloseIcon && (
              <Tooltip title="Hide/Open Sidebar">
                <IconButton onClick={toggleSidebar}>
                  <ViewSidebar style={{ color: "#075243" }} />
                </IconButton>
              </Tooltip>
            )}
            {selectedItem === "P2P Payments" ? (
              <div>
                <P2PPayments
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "P2P Loans" ? (
              <div>
                <P2PLoans
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "RO-RO Loans" ? (
              <div>
                <ROROLoans
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "P2R Surplus Fund Transfer" ? (
              <div>
                <P2RSurplusFundsTransfer
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "Payments" ? (
              <div>
                <Payments
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "R2C Surplus Fund Transfer" ? (
              <div>
                <R2CSurplusFundsTransfer
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "Receipt from RO" ? (
              <div>
                <ReceiptFromRO
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "CO Levis" ? (
              <div>
                <COLevis
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "Asset Funds" ? (
              <div>
                <AssetsFunds
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "Term Loan Set off" ? (
              <div>
                <TermLoanSetoff
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
            {selectedItem === "Reserves" ? (
              <div>
                <Reserves
                  firstName={firstname}
                  lastName={lastname}
                  closeSidebar={toggleSidebar}
                />
              </div>
            ) : (
              <div>{itemContent[selectedItem]}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
