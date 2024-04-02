import axios from 'axios';
import { load } from 'cheerio'; // 수정된 부분: load 함수만 import
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';

import { Youtube } from '@/api/youtube/youtubeModel';
import { youtubeRepository } from '@/api/youtube/youtubeRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const youtubeService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<Youtube[] | null>> => {
    try {
      const users = await youtubeRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Youtube found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Youtube[]>(ResponseStatus.Success, 'Youtube found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  findById: async (id: number): Promise<ServiceResponse<Youtube | null>> => {
    try {
      const user = await youtubeRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Youtube>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  crawl: async (): Promise<ServiceResponse<any>> => {
    try {
      const { data } = await axios.get('https://google.com');

      const $ = load(data);
      console.log($);
      const filePath = './output.html';

      const jsonData: any = $('html').html(); // JSON 데이터를 문자열로 변환
      fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
          console.log('An error occurred:', err);
          return;
        }
        console.log('Data saved to file:', filePath);
      });

      const h1Text = $('h1').text();
      console.log(h1Text, 'h1Text');
      if (!h1Text) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<any>(ResponseStatus.Success, 'User found', h1Text, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id '{id}':, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
