import XLSX from "xlsx";

export const getWorkbook = (auth=[], customer=[], accounts=[]): any => {
  const workbook = XLSX.utils.book_new();
  const authSheet = XLSX.utils.json_to_sheet(auth)
  const customerSheet = XLSX.utils.json_to_sheet(customer)
  const accountSheet = XLSX.utils.json_to_sheet(accounts)

  XLSX.utils.book_append_sheet(workbook, authSheet, 'auth')
  XLSX.utils.book_append_sheet(workbook, customerSheet, 'customer')
  XLSX.utils.book_append_sheet(workbook, accountSheet, 'accounts')
  accounts.forEach(item => {
    const transactionSheet = XLSX.utils.json_to_sheet(item.transactions)
    XLSX.utils.book_append_sheet(workbook, transactionSheet, 'transactions-' + item.accountNumber)
  })
  return workbook
}
