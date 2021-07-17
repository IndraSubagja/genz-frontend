export const getDateTime = (datetime) => {
  const offset = new Date().getTimezoneOffset() * 60000;
  const milliseconds = new Date(datetime).getTime();
  const localISOTime = new Date(milliseconds - offset).toISOString().slice(0, -1);

  const time = localISOTime.split(/[T.]/);
  return `${time[0]} ${time[1].slice(0, 5)}`;
};
