import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetYoutubeSchema, YoutubeSchema } from '@/api/youtube/youtubeModel';
import { youtubeService } from '@/api/youtube/youtubeService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const youtubeRegistry = new OpenAPIRegistry();

youtubeRegistry.register('Youtube', YoutubeSchema);

export const youtubeRouter: Router = (() => {
  const router = express.Router();

  youtubeRegistry.registerPath({
    method: 'get',
    path: '/youtube',
    tags: ['Youtube'],
    responses: createApiResponse(z.array(YoutubeSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await youtubeService.crawl();
    handleServiceResponse(serviceResponse, res);
  });

  youtubeRegistry.registerPath({
    method: 'get',
    path: '/youtube/{id}',
    tags: ['Youtube'],
    request: { params: GetYoutubeSchema.shape.params },
    responses: createApiResponse(YoutubeSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetYoutubeSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await youtubeService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
