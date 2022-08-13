import Link from "next/link";

const Pagination = ({
  pathName,
  queryParam = "page",
  from,
  to,
  total,
  current = 1,
}: {
  pathName: string;
  queryParam?: string;
  from?: number;
  to?: number;
  total: number;
  current: number;
}) => {
  const allPages = Array.from(Array(total)).map((p, i) => i + 1);
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
