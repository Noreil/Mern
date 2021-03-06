export const dateParser = (num) => {
  let options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  let timestamps = Date.parse(num);

  let date = new Date(timestamps).toLocaleDateString('fr-FR', options);

  return date.toString();
};

export const isEmpty = (value) => {
  return (
    value === undefined ||
    null ||
    (typeof value === 'object' && Object.keys(value).lenght === 0) ||
    (typeof value === 'string' && value.trim().lenght === 0)
  );
};
