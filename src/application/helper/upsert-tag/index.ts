import { TagEntity } from '@entity/tag';
import { EntityManager } from 'typeorm';

export const upsertTag = async (
  manager: EntityManager,
  tagList: { name: string }[]
): Promise<number[]> => {
  await manager.createQueryBuilder().insert().into(TagEntity).values(tagList).orIgnore().execute();

  const names = tagList.map((c) => c.name);

  const tags = await manager.find(TagEntity, {
    where: names.map((name) => ({ name }))
  });

  return tags.map((c) => c.id);
};
