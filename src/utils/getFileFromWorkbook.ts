import XLSX from "xlsx";
import { Request } from 'express';
import FormatterService from '../services/formatter';

export const getWorkBookFile = (req: Request, mode='format') => {
  const file:any = req.files.file
    const workbook = XLSX.readFile(file?.tempFilePath);
    const auths: any = XLSX.utils.sheet_to_json(workbook.Sheets['auth']);
    const customers: any = XLSX.utils.sheet_to_json(workbook.Sheets['customer']);
    const accounts = XLSX.utils.sheet_to_json(workbook.Sheets['accounts']);
    const authSheet = []
    const customerSheet = []
    let accountSheet = []
    const dataModels = []
    for (const user of auths) {
      const accountFilter = accounts.filter((account: any)=> account.uniqueAuthId === user.email)
      let data: any = {
        accounts: accountFilter.map((account: any) => {
          return {
            ...account,
            transactions: XLSX.utils.sheet_to_json(workbook.Sheets['transactions-' + account.accountNumber])
          }
        })
      }
      if (mode === 'format'){
        data = {
          ...data,
          ...user,
          ...customers.find(profile => profile.uniqueAuthId === user.email),
        }
        const {formattedData} = FormatterService.formatData(data, false)
        authSheet.push(formattedData.auth)
        customerSheet.push({...formattedData.customer, uniqueAuthId: formattedData.auth.email})
        accountSheet = accountSheet.concat(formattedData.accounts.map(item => {return {...item, uniqueAuthId: formattedData.auth.email} }))
    }else{
      data = {
        ...data,
        auth: user,
        customer: customers.find(profile => profile.uniqueAuthId === user.email),
      }
      dataModels.push(data)
    }
  }
  return { authSheet, customerSheet, accountSheet, dataModels }
}
