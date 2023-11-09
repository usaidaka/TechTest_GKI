import React from "react";
import TableBodyNewestProduct from "../admin/TableBodyNewestProduct";
import TableBodyUsersList from "../admin/TableBodyUsersList";

const TableGlobal = ({ head, body, tableUseFor, refetch }) => {
  let tableComponent;
  switch (tableUseFor) {
    case "NewestProduct":
      tableComponent = <TableBodyNewestProduct body={body} />;
      break;
    case "UsersList":
      tableComponent = <TableBodyUsersList body={body} refetch={refetch} />;
      break;

    default:
      break;
  }

  return (
    <div className="w-full bg-white p-8 rounded-md shadow-md">
      <table className="w-full border-collapse ">
        <thead className="bg-blue-500 text-white ">
          <tr>
            {head.map((column, idx) => (
              <td key={idx} className="py-2 px-4 text-left font-inter text-sm">
                {column.title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>{tableComponent}</tbody>
      </table>
    </div>
  );
};

export default TableGlobal;
