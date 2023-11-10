import React from "react";
import dayjs from "dayjs";
import { rupiahFormat } from "../../utils/formatter";

const TableBodyNewestProduct = ({ body }) => {
  return (
    <>
      {body.map((product, idx) => (
        <tr
          key={idx}
          className={
            (idx % 2 === 0 ? "bg-gray-100" : "bg-white") + " text-gray-700"
          }
        >
          <td className="py-2 px-4">{product.name}</td>
          <td className="py-2 px-4">
            {dayjs(product.createdAt).format("DD MMMM YYYY")}
          </td>
          <td className="py-2 px-4">{rupiahFormat(product.price)}</td>
        </tr>
      ))}
    </>
  );
};

export default TableBodyNewestProduct;
