import XLSX from "xlsx";
import stream from 'stream';
import { Request, Response } from 'express';
import BaseController from './index';
import logger from '../utils/logger';
import { getWorkbook  } from "../utils/processWorkbook";

import { getWorkBookFile } from "../utils/getFileFromWorkbook";

import CollectionRepository from '../services/collectionRepository';

export default class Formatter extends BaseController{
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async formatData(req: Request, res: Response): Promise<any> {
    try{
      const {authSheet, customerSheet, accountSheet } = getWorkBookFile(req)
      const workbookFile = getWorkbook(authSheet, customerSheet, accountSheet);
      const buffer = XLSX.write(workbookFile, {type: "buffer", bookType: "xlsx"});
      console.log(buffer)
      const readStream = new stream.PassThrough();
      readStream.end(buffer);
      res.set('Content-disposition', 'attachment; filename=' + `scraped-data-${Date.now()}.xlsx`);
      res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      readStream.pipe(res);
    }catch(err) {
      console.log(err)
      const errMessage = err.response?.data || err.message || "Error Occured";
      logger.info(errMessage);
      return Formatter.errorHandler(req, res, errMessage.text ||  errMessage, 400);
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
   static async saveFormatteData(req: Request, res: Response): Promise<any> {
    try{
       const { dataModels } = getWorkBookFile(req, 'save')
       for (const data of dataModels){
          await CollectionRepository.saveALL(data, '')
        }
        return Formatter.successHandler(req, res, 'Data save successfully', 200);
    }catch(err) {
      const errMessage = err.response?.data || err.message || "Error Occured";
      logger.info(errMessage);
      return Formatter.errorHandler(req, res, errMessage.text ||  errMessage, 400);
    }
  }
}

