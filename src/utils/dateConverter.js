function convertDate(rows) {
  const formattedRows = rows.map((row) => {
    const updatedDate = new Date(row.date).toLocaleDateString();
    return {...row, date: updatedDate};
  });
  return formattedRows;
}

module.exports = {
  convertDate: convertDate,
};
