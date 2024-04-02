import { Youtube } from '@/api/youtube/youtubeModel';

export const youtubes: Youtube[] = [
  { id: 1, name: 'BTS' },
  { id: 2, name: 'IVE' },
];

export const youtubeRepository = {
  findAllAsync: async (): Promise<Youtube[]> => {
    return youtubes;
  },

  findByIdAsync: async (id: number): Promise<Youtube | null> => {
    return youtubes.find((youtube) => youtube.id === id) || null;
  },
};
