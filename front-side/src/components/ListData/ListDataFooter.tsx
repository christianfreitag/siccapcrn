import { CaretLeft, CaretRight } from "phosphor-react";

interface ListDataFooterProps {
  totalData: number;
  page: number;
  setPage: (page: number) => void;
  nPerPage: number;
  showTotal?: boolean
}

export function ListDataFooter({
  setPage,
  page,
  totalData,
  nPerPage,
  showTotal = true
}: ListDataFooterProps) {
  return (
    <footer className={` h-10 items-center w-full flex justify-between rounded-t-sm p-2 border-t-[1px] border-brand-100`}>
      {showTotal ?
        <div className=" rounded-sm text-sm">
          Total: {totalData}
        </div> : null}
      <div className="noselect flex justify-end mr-10 items-baseline ">
        <CaretLeft
          className="cursor-pointer"
          size="14px"
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        />
        <div className="flex items-baseline ml-2 mr-2 text-lightBlack-100">
          <div className="h-6 w-6 border-[1px] rounded-sm text-lg border-lightBlack-100 align-middle items-center justify-center flex text-lightBlack-100">
            {page}
          </div>
          /
          <span className="text-sm text-lightBlack-100">
            {Math.ceil(totalData / nPerPage) <= 0
              ? 1
              : Math.ceil(totalData / nPerPage)}
          </span>
        </div>
        <CaretRight
          className="cursor-pointer"
          size="14px"
          onClick={() => {
            if (page < Math.ceil(totalData / nPerPage)) {
              setPage(page + 1);
            }
          }}
        />
      </div>
    </footer>
  );
}
