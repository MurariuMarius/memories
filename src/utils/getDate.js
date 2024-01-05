import moment from "moment";

const getDate = (timestamp) => {
  const seconds = timestamp?.seconds || timestamp?._seconds
  return moment(new Date(seconds * 1000)).fromNow();
}

export default getDate;