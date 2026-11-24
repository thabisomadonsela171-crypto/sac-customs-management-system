function DataTable({
  columns = [],
  data = [],
  emptyMessage = "No records found.",
}) {
  return (
    <div className="table-container">

      {data.length === 0 ? (
        <div className="empty-state">
          {emptyMessage}
        </div>
      ) : (
        <table>

          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || index}>

                {columns.map((column) => (
                  <td key={column.key}>
                    {row[column.key] ?? "-"}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}

export default DataTable;