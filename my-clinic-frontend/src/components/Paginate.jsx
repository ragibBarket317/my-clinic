import React from "react";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import ReactPaginate from "react-paginate";

function Paginate({ currPage, setCurrPage, pageCount, limit }) {
  const totalPages = pageCount;
  return (
    <ReactPaginate
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      activeClassName={"active"}
      breakLabel="..."
      previousLabel={
        <span className="text-theme text-3xl">
          <AiFillLeftCircle />
        </span>
      }
      nextLabel={
        <span className="text-theme  text-3xl ">
          <AiFillRightCircle />
        </span>
      }
      onPageChange={(e) => {
        setCurrPage(e.selected + 1);
      }}
      // pageRangeDisplayed={limit}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      renderOnZeroPageCount={null}
      forcePage={currPage - 1}
    />
  );
}

export default Paginate;
