//Export to Excel:- 
import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Checkbox
} from "antd";
import moment from "moment";
import {
  EditOutlined,
  CheckOutlined,
  CopyOutlined, 
  CloseOutlined,
  PlusOutlined,
  LogoutOutlined,
  ExportOutlined
} from "@ant-design/icons";
import { Snackbar,Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { Tooltip } from "antd";
import dayjs from 'dayjs'
//import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';
const { Option } = Select;
const Reserves = ({firstName, lastName}) => {
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [actionType, setActionType] = useState('add');
  const [tableData, setTableData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false,message: "",severity: "warning"});
  const initialnewRow = {
      transactionType: "RAN",
      documentDate: null,
      year: "",
      period: "",
      reference: "",
      project: "",
      ledger: "",
      amount: "",
      status: "draft",
  }
  const [newRow, setNewrow] = useState(initialnewRow)
  const [selectedRecords, setSelectedRecords] = useState({});
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddRow = () => {
    if (editingIndex !== null) {
      showSnackbar(
          "You can add a new record only if the existing editing row is either saved or canceled",
          "warning"
        );
    } else {
      setTableData([newRow, ...tableData]);
      setEditingIndex(0);
      setActionType('add');
    }
  };

   const handleCellValueChange = (columnName, value, index) => {
     const updatedTableData = [...tableData];

     // Handle record selection
    if (columnName === "selected") {
      const selected = !selectedRecords[index];
      setSelectedRecords({ ...selectedRecords, [index]: selected });
      return;
    }

     if (columnName === "documentDate") {
       if (value) {
         let year = parseInt(moment(value, "DD-MM-YYYY").format("YYYY"), 10);
         let month = parseInt(moment(value, "DD-MM-YYYY").format("MM"), 10);
         if (month >= 4) {
           month -= 3;
         } else {
           month += 9;
           year -= 1;
         }
         updatedTableData[index]["documentDate"] = value;
         updatedTableData[index]["year"] = year;
         updatedTableData[index]["period"] = month;
       }
     }
     else {
       updatedTableData[index][columnName] = value;
       const editedData = { ...editedRow, [columnName]: value };
      setEditedRow(editedData);
       }
      setTableData(updatedTableData);
    };
    
    const handleEditRow = (index) => {
      if (editingIndex !== null && editingIndex !== index) {
      showSnackbar(
            "Existing row is in edit mode, Please save or cancel the row before editing this row",
            "warning"
          );
      } else {
        const updatedTableData = [...tableData];
        updatedTableData[index].status = "Draft";
        // Store a copy of the original data for this row
        setOriginalRowData({ ...updatedTableData[index] });
        setTableData(updatedTableData);
        setEditingIndex(index);
        setEditedRow({ ...updatedTableData[index] }); // Store the edited row data
        setActionType('edit');
      }
    };

  const handleEditRowSave = (index) => {
    if (editingIndex === index) {
        const editedData = editedRow;
      if (editedData && editedData.transactionType && editedData.documentDate && editedData.reference && editedData.project && editedData.amount && editedData.ledger) {
        if (editedData.status === "submitted") {
          Modal.confirm({
            title: "Record Submition",
            content: "Do you want to Submit Your Record?",
            onOk() {
              const currentDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
              editedData.submittedBy = firstName && lastName ? `${firstName} ${lastName}` : "";
              editedData.submittedOn = currentDateTime;
              console.log("edited data :", editedData);
              const accessToken = localStorage.getItem("accessToken");
              const Cookie = {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              };

              axios
                .put(
                  `https://api.p360.build:6060/v1/fundflow/reserves/submit`,
                  editedData,
                  Cookie
                )
                    .then((response) => {
                    console.log("Record updated successfully:", response.data.data);
                    const updatedTableData = [...tableData]; // Assuming tableData is your data source
                    updatedTableData[index] = response.data.data; // Update the data with the response data
                    setTableData(updatedTableData); // Update the state with the new data
                    setEditingIndex(null); // Exit edit mode
                    setEditedRow(null); // Clear the edited row
                    setActionType('edit');
                    showSnackbar("Record is Updated Successfully","success");
                    })

                  .catch((err) => {
                    console.error("Error updating record:", err);
                    Modal.error({ content: "Error Occurred, While Updating Changes" });
                  });
              }
            })
          } else {
          // If status is not "submitted," clear submittedBy and submittedOn
          editedData.submittedBy = null;
          editedData.submittedOn = null;
          console.log("edited data :", editedData);
          const accessToken = localStorage.getItem("accessToken");
          const Cookie = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              },
            };

            axios
              .put(
                `https://api.p360.build:6060/v1/fundflow/reserves/submit`,
                editedData,
                Cookie
              )
              .then((response) => {
                console.log("Record updated successfully:", response.data.data);
                const updatedTableData = [...tableData]; // Assuming tableData is your data source
                updatedTableData[index] = response.data.data; // Update the data with the response data
                setTableData(updatedTableData); // Update the state with the new data
                setEditingIndex(null); // Exit edit mode
                setEditedRow(null); // Clear the edited row
                setActionType('edit');
                showSnackbar("Record is Updated Successfully","success");
              })
              .catch((err) => {
                console.error("Error updating record:", err);
                Modal.success({ content: "Error Occurred, While Updating Changes" });
              });
            }
          }else {
            showSnackbar(
            "Please fill all the Fields in the record",
            "error"
            );
          }
        }
       }
 
    const handleDuplicateRow = (index) => {
      if (editingIndex !== null) {
      showSnackbar(
            "You can copy a record only if the current editing row is either saved or canceled",
            "warning"
          );
      } else {
        const duplicatedRow = { ...tableData[index] };
        duplicatedRow.key = Date.now(); // Add a unique identifier to the duplicated row
        duplicatedRow.status = "draft"; // Set the status to "draft" for the duplicated row
        console.log(duplicatedRow);
        setNewrow(duplicatedRow);
        setTableData((prevData) => {
          const newData = [duplicatedRow, ...prevData]; // Insert at the beginning of the array
          return newData;
        });
        setEditingIndex(0); // Set the editing index to the duplicated row at the beginning
        setActionType('duplicate'); // Set the action type to 'duplicate'
      }
    };

  const handleRowSave = (index) => {
    console.log(newRow)
    const editedRowData = tableData[index];
    
    if (editedRowData && editedRowData.transactionType && editedRowData.documentDate && editedRowData.reference && editedRowData.project && editedRowData.amount && editedRowData.ledger) {
      if (editedRowData.status === "submitted") {
        Modal.confirm({
          title: "Record Submition",
          content: "Do you want to Submit Your Record?",
          onOk() {
            const postData = {
              transactionType: editedRowData.transactionType,
              documentDate: editedRowData.documentDate,
              year: editedRowData.year,
              period: editedRowData.period,
              reference: editedRowData.reference,
              project: editedRowData.project,
              ledger: editedRowData.ledger,
              amount: editedRowData.amount,
              status: "submitted",
            };
            const accessToken = localStorage.getItem("accessToken");
            const Cookie = {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
            const createdBy = firstName && lastName ? `${firstName} ${lastName}` : "";
            const submittedBy = firstName && lastName ? `${firstName} ${lastName}` : "";
            const currentDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
            console.log("Called Draft");
            console.log("Name :" + firstName + " " + lastName);
            const updatedNewRow = {
              ...postData,
              createdDate: currentDateTime,
              createdBy: createdBy,
              submittedOn: currentDateTime,
              submittedBy: submittedBy,
            };

            console.log("New Row :", updatedNewRow)
            console.log("submit after Row");
            axios
              .post(
                "https://api.p360.build:6060/v1/fundflow/reserves/draft",
                updatedNewRow,
                Cookie
              )
              .then((response) => {
                console.log("Response:", response.data.data);
                const updatedTableData = [...tableData];
                updatedTableData[index] = response.data.data;
                setTableData(updatedTableData);
                showSnackbar("Record is Submitted Successfully","success");
                setEditingIndex(null);
                setNewrow(initialnewRow);
              })

              .catch((error) => {
                console.error("Error:", error);
                Modal.error({ content: "Record not submitted" });
              });
          }
        })
      } else {
        const createdBy = firstName && lastName ? `${firstName} ${lastName}` : "";
        const currentDateTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
        const postData = {
          transactionType: editedRowData.transactionType,
          documentDate: editedRowData.documentDate,
          year: editedRowData.year,
          period: editedRowData.period,
          reference: editedRowData.reference,
          project: editedRowData.project,
          ledger: editedRowData.ledger,
          amount: editedRowData.amount,
          status: editedRowData.status,
        };
        console.log("Called Draft");
        console.log("status:", editedRowData.status);
        console.log("Name :" + firstName + " " + lastName);

        const updatedNewRow = {
          ...postData,
          createdDate: currentDateTime,
          createdBy: createdBy,
        };
        console.log("New Row :", updatedNewRow)
        console.log("after Row");
        axios
          .post(
            "https://api.p360.build:6060/v1/fundflow/reserves/draft",
            updatedNewRow, // You can pass the data as an array if needed
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
          .then((response) => {
            console.log("Response:", response.data.data);
            const updatedTableData = [...tableData];
            updatedTableData[index] = response.data.data;
            setTableData(updatedTableData);
            showSnackbar("Record is Saved Successfully","success");
            setEditingIndex(null);
            setNewrow(initialnewRow);
          })
          .catch((error) => {
            console.error("Error:", error);
            Modal.error({ content: "Record not saved" });
          });
          }
        }
        else {
          showSnackbar(
            "Please fill all the Fields in the record",
            "error"
          );
        }
  }
  
    const handleCancelRow = (index) => {
      if (index === editingIndex) {
        if (actionType === 'add') {
          const updatedTableData = [...tableData];
          updatedTableData.splice(0, 1); 
          setTableData(updatedTableData);
          setNewrow(initialnewRow);
        } else if (actionType === 'edit') {
          const updatedTableData = [...tableData];
          // Restore the original data by reverting to the originalRowData state
          updatedTableData[index] = { ...originalRowData };
          setTableData(updatedTableData);
          setEditingIndex(null);
          setOriginalRowData(null);
        } else if (actionType === 'duplicate') {
          const updatedTableData = [...tableData];
          updatedTableData.splice(0, 1);
          setTableData(updatedTableData);
          setNewrow(initialnewRow);
        }
      }
      setEditingIndex(null);
    };

  const handleLogout = () => {
    if (editingIndex !== null) {
       showSnackbar(
        "Please save or cancel the Current Editing row to Logout from this page ",
        "warning"
      )
    } else {
      Modal.confirm({
        title: "Confirm Logout",
        content: "Are you sure want to logout?",
        onOk() {
          navigate("/");
        }
      })
    }
  }
  
   const Saverow = (index) => {
    if (actionType === 'add') {
        handleRowSave(index);
    } else if (actionType === 'edit') {
         handleEditRowSave(index);
    } else if (actionType === 'duplicate') {
        handleRowSave(index)
    }
  };

  const handleExport = () => {
    // Filter the tableData to include only selected records
    const selectedRecordsToExport = tableData.filter((record, index) => selectedRecords[index]);

    if (selectedRecordsToExport.length === 0) {
      showSnackbar("No records selected for export", "warning");
      return;
    }

    // Map the selected records to the format you want to export
    const dataToExport = selectedRecordsToExport.map((item) => ({
      'T typ': item.transactionType,
      'Document Date': item.documentDate,
      'Year': item.year,
      'Period': item.period,
      'Reference': item.reference,
      'Project': item.project,
      'Ledger': item.ledger,
      'Amount': item.amount,
      'Status': item.status,
      'Entry Date': item.createdDate,
      'Created By': item.createdBy,
      'SubmittedOn': item.submittedOn,
      'SubmittedBy': item.submittedBy,
    }));

    // Create Excel sheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Define the filename for the exported file
    const fileName = 'exported_data.xlsx';

    // Export the Excel file
    XLSX.writeFile(wb, fileName);
  };





  const columns = [
 {
    title: (
      <div>
        <div style={{ textAlign: "center" }}>Select
        <Checkbox
          // Indeterminate state for the header checkbox
          indeterminate={
            tableData.length > 0 &&
            tableData.some(
              (record, index) => selectedRecords[index]
            ) &&
            !tableData.every(
              (record, index) => selectedRecords[index]
            )
          }
          // Check whether all records are selected
          checked={
            tableData.length > 0 &&
            tableData.every((record, index) => selectedRecords[index])
          }
          onChange={(e) => {
            const newSelectedRecords = {};
            if (e.target.checked) {
              tableData.forEach(
                (record, index) => (newSelectedRecords[index] = true)
              );
            }
            setSelectedRecords(newSelectedRecords);
          }}
         />
         </div>
      </div>
    ),
    dataIndex: "selected",
    key: "selected",
    width: 55,
    render: (_, record, index) => (
      <div style={{ textAlign: "center" }}>
        <Checkbox
          checked={selectedRecords[index]}
          onChange={(e) => {
            const newSelectedRecords = {
              ...selectedRecords,
              [index]: e.target.checked,
            };
            setSelectedRecords(newSelectedRecords);
          }}
        />
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
      width: 120,
    align:"center",
    render: (_, record, index) => {
      if (editingIndex === index) {
        return (
          <span>
            <Tooltip title="Save">
              <Button
                icon={<CheckOutlined />}
                onClick={() => Saverow(index)}
                style={{ marginRight: 4 }}
              />
            </Tooltip>
            <Tooltip title="Cancel">
                  <Button
                    type="default"
                    icon={<CloseOutlined />}
                    onClick={() => handleCancelRow(index)}
                    style={{ marginRight: 4 }}
                  />
                </Tooltip>
          </span>
        );
      } else {
        return (
          <span>
            <Tooltip title="Edit">
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => handleEditRow(index)}
                disabled={record.status === "submitted"}
                style={{ marginRight: 4 }}
              />
            </Tooltip>
            <Tooltip title="Duplicate">
              <Button
                type="default"
                icon={<CopyOutlined />}
                onClick={() => handleDuplicateRow(index)}
                disabled={editingIndex === 0 }
              />
            </Tooltip>
          </span>
        );
      }
    },
  },
  {
      title: "T typ",
      dataIndex: "transactionType",
      key: "selectedT_typ",
      align:"center",
      width: 100,
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Select
              value={text}
              onChange={(value) => handleCellValueChange("transactionType", value, index)}
              style={{ width: 80,border:"none" }}
            >
              <Option value="RAN">RAN</Option>
              <Option value="BLR">BLR</Option>
              <Option value="HYD">HYD</Option>
              <Option value="CO">CO</Option>
            </Select>
          );
        } else {
          return text;
        }
      },
    },
  
  {
    title: "Document Date",
    dataIndex: "documentDate",
    key: "Document Date",
    align: "center",
    width: 150,
    render: (text, record, index) => {
      if (editingIndex === index) {
        return (
          <DatePicker
            value={text && dayjs(text, "DD-MM-YYYY")}
            format="DD-MM-YYYY" // You can specify the date format
            inputReadOnly
            onChange={(value) =>
              handleCellValueChange(
                  "documentDate",
                  value ? value.format("DD-MM-YYYY") : null,
                  index
                )
              }
          />
        );
      } else {
        return text;
      }
    },
  },

    {
      title: "Reference",
      align:"center",
      dataIndex: "reference",
      key: "Reference",
      width: 200,
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Input
              value={text}
              maxLength={30} 
              onChange={(e) =>
                handleCellValueChange("reference",e.target.value,index)
              }
            />
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Project",
      align:"center",
      dataIndex: "project",
      key: "Payment Project",
      width: 120,
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Input
              value={text}
              maxLength={9} 
              onChange={(e) =>
                handleCellValueChange("project",e.target.value,index)
              }
            />
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Ledger",
      dataIndex: "ledger",
      key: "selectedLedger",
      align:"center",
      width: 230,
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Select
              value={text}
              onChange={(value) => handleCellValueChange("ledger", value, index)}
              style={{ width: 200 }}
            >
              <Option value={"General"}>
              General
              </Option>
              <Option value={"BG & LC"}>
                BG & LC
              </Option>
              <Option value={"Statutory"}>
                Statutory
              </Option>
            </Select>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "Amount",
      align:"center",
      width: 100,
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handleCellValueChange("amount",e.target.value,index)
              }
            />
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "status",
      dataIndex: "status",
      key: "selectedstatus",
      width: 120,
      align:"center",
      render: (text, record, index) => {
        if (editingIndex === index) {
          return (
            <Select
              value={text}
              onChange={(value) => handleCellValueChange("status", value, index)}
              style={{ width: 100 }}
            >
              <Option value="draft">Draft</Option>
              <Option value="submitted">submitted</Option>
            </Select>
          );
        } else {
          return text;
        }
      },
    },
    
    ];

      useEffect(() => {
      const fetchData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.get(
            "https://api.p360.build:6060/v1/fundflow/reserves/fetchAll", { headers });
          setTableData(response.data.data);
            console.log("the get method is working")
          // Handle the response data here
          console.log("Response:", response.data);
        } catch (error) {
          // Handle any errors here
          console.error("Error:", error);
        } 
      };
      fetchData();
      }, []); // The empty dependency array means this effect runs once when the component mounts  
  
  return (
    <div>
        <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={2000} // Adjust as needed
        onClose={handleSnackbarClose}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div>
      <Row justify="space-between" align="middle" style={{marginTop:"-5vh"}}>
          <Col>
            <Typography.Title level={4} style={{ fontFamily: "open sans", paddingLeft: "10vh" }}>
              <h2>Reserves</h2>
            </Typography.Title>
          </Col>
          <Col style={{ marginLeft: "0vh" }}>
            <Tooltip title="New Row">
              <Button
                icon={<PlusOutlined  style={{ color: 'blue' }}/>}
                style={{ marginRight: "1vh" }}
                onClick={handleAddRow}
              />
            </Tooltip>
            <Tooltip title="Export">
            <Button
              type="default"
              icon={<ExportOutlined  style={{ color: 'darkblue' }}/>} 
              style={{ marginRight: "1vh" }}
              onClick={handleExport}
            />
          </Tooltip>
            <Tooltip title="Logout">
              <Button
                type="default"
                icon={<LogoutOutlined style={{ color: 'red', transform: 'rotate(270deg)' }} />}
                style={{ marginRight: "3vh" }}
                onClick={handleLogout}
              />
            </Tooltip>
          </Col>
      </Row>
      </div>
      <div>
        <Table
          dataSource={tableData}
          columns={columns}
          scroll={{ x: "max-content", y: "calc(100vh - 33vh)" }}
          pagination={true}
          size="small"/>
      </div>
    </div>
  );
};

export default Reserves;