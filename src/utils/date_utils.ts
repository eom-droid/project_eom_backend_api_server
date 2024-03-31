export class DateUtils {
  static generateNowDateTime() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    const nowDateTime = `${year}-${month >= 10 ? month : "0" + month}-${
      date >= 10 ? date : "0" + date
    } ${hours >= 10 ? hours : "0" + hours}:${
      minutes >= 10 ? minutes : "0" + minutes
    }:${seconds >= 10 ? seconds : "0" + seconds}`;

    return nowDateTime;
  }
}
