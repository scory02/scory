/* --------时间转换开始 */
// 时间戳
export function getTimestamp() {
  return Math.round(new Date().getTime());
}
// 时间戳转日期（1）
export function toDateTime(timestamp) {
  if (timestamp && Number(timestamp) && Number(timestamp) !== NaN) {
    const date = new Date(timestamp);
    const year = date.getFullYear(); // 获取年份
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，注意要加1
    const day = date.getDate().toString().padStart(2, '0'); // 获取日期
    const hour = date.getHours().toString().padStart(2, '0'); // 获取小时数
    const minute = date.getMinutes().toString().padStart(2, '0'); // 获取分钟数
    const second = date.getSeconds().toString().padStart(2, '0'); // 获取秒数
    const dateTime=`${year}-${month}-${day} ${hour}:${minute}:${second}`; // 输出：2023-4-19 7:30:0
    return dateTime;
  } else {
    return timestamp;
  }
}
/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  console.log(
    "%c [ time ]-46",
    "font-size:13px; background:pink; color:#bf2c9f;",
    time
  );
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}
/**
 * 计算实际年龄，精确到天
 * @param {*} birthday array [year, month, day]
 * @return array
 * getAge("2013-7-12".split("-"))
 */
function getAge(birthday) {
  // 新建日期对象
  let date = new Date();
  // 今天日期，数组，同 birthday
  let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  // 分别计算年月日差值
  let age = today.map((value, index) => {
    return value - birthday[index];
  });
  // 当天数为负数时，月减 1，天数加上月总天数
  if (age[2] < 0) {
    // 简单获取上个月总天数的方法，不会错
    let lastMonth = new Date(today[0], today[1], 0);
    age[1]--;
    age[2] += lastMonth.getDate();
  }
  // 当月数为负数时，年减 1，月数加上 12
  if (age[1] < 0) {
    age[0]--;
    age[1] += 12;
  }
  return age;
}
/* ---------时间结束 */
