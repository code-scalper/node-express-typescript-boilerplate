import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Youtube = z.infer<typeof YoutubeSchema>;
export const YoutubeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetYoutubeSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
