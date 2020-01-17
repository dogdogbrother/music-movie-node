/**
  *  @description: 传入ctx.query,默认分页size和默认分页number.当前返回 pageNumber 和 pageSize, page_number也返回是为了外面计算下一页
  *  @author: sl
  *  @update :sl(2019/01/17)
*/
const returnPaging = (query, defaultSize = 10, defaultNumber = 1) => {
  const { page_size = defaultSize, page_number = defaultNumber } = query
  const pageNumber = Math.max(page_number * 1, 1) - 1
  const pageSize = Math.max(page_size * 1, 1)
  return { pageNumber, pageSize, page_number }
}

module.exports = { returnPaging }