import React from "react";

const ReportCard = ({ data }) => {
  return (
    <div className="h-28 w-60 bg-blue-300 flex flex-col justify-center px-6 rounded-lg">
      <p className="font-inter text-slate-600">{data.title}</p>
      <div className="flex items-end gap-1 text-purple-900">
        <p className="text-3xl">{data.total}</p>
        <p>{data.unit}</p>
      </div>
    </div>
  );
};

export default ReportCard;
