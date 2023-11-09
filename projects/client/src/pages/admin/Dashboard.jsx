import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import ReportCard from "../../components/admin/ReportCard";
import TableGlobal from "../../components/global/TableGlobal";
import withAuth from "../withAuth";

const Dashboard = () => {
  const [reports, setReports] = useState({});
  const [newestProduct, setNewestProduct] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get("/admin/report-dashboard");
        setReports(response?.data?.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data?.message
        ) {
          setErrMsg(error.response?.data?.message);
        } else {
          setErrMsg("An error occurred while fetching data.");
        }
      }
    };

    fetchReport();
  }, []);

  useEffect(() => {
    const fetchNewestProduct = async () => {
      try {
        const response = await axios.get("/admin/product-list");
        setNewestProduct(response.data.NewestProduct);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrMsg(error.response.data.message);
        } else {
          setErrMsg("An error occurred while fetching data.");
        }
      }
    };
    fetchNewestProduct();
  }, []);

  const dataReport = [
    {
      title: "Amount Active Users",
      total: reports.userActive,
      unit: "Users",
    },
    { title: "Amount Users", total: reports.user, unit: "Users" },
    {
      title: "Amount Active Products",
      total: reports.productActive,
      unit: "Products",
    },
    { title: "Amount Products", total: reports.product, unit: "Products" },
  ];

  const head = [
    { title: "Product Name" },
    { title: "Created at" },
    { title: "Price" },
  ];

  return (
    <div className="bg-slate-100 w-full">
      <div className=" m-8 space-y-6">
        <h1 className="text-xl font-inter">Dashboard</h1>
        <div className="flex justify-around">
          {dataReport.map((report, idx) => (
            <ReportCard data={report} key={idx} />
          ))}
        </div>
        <TableGlobal
          head={head}
          body={newestProduct}
          tableUseFor="NewestProduct"
        />
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
