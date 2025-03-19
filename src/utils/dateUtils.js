const formatDateForMySQL = (date) => {
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const isValidDate = (date) => {
  const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  return regex.test(date);
};

export { formatDateForMySQL, isValidDate };