import Link from "next/link";
import { Dispatch, SetStateAction, useEffect } from "react";

const Pagination = ({
  pathName,
  queryParam = "page",
  setFrom,
  total,
  current = 1,
  perPage = 5,
}: {
  pathName: string;
  queryParam?: string;
  setFrom: Dispatch<SetStateAction<number>>;
  total: number;
  current?: number;
  perPage?: number;
}) => {
  const pageCount = Math.ceil(total / perPage);

  useEffect(() => {
    const rangeBegin = (current - 1) * perPage;
    setFrom(rangeBegin);
  }, [setFrom, current, perPage]);

  const allPages = Array.from(Array(pageCount)).map((p, i) => i + 1);

  return (
    <div className="btn-group">
      {allPages.map((p) => (
        <Link key={p} href={{ pathname: pathName, query: { [queryParam]: p } }}>
          <button className={`btn ${current === p ? "btn-active" : null}`}>
            {String(p)}
          </button>
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
