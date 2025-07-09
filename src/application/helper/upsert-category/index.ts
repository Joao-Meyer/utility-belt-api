import { CategoryEntity } from '@entity/category';
import { EntityManager } from 'typeorm';

export const upsertCategory = async (
  manager: EntityManager,
  categoryList: { name: string }[]
): Promise<number[]> => {
  await manager
    .createQueryBuilder()
    .insert()
    .into(CategoryEntity)
    .values(categoryList)
    .orIgnore()
    .execute();

  const names = categoryList.map((c) => c.name);

  const categories = await manager.find(CategoryEntity, {
    where: names?.map((name) => ({ name })),
    select: { id: true }
  });

  return categories.map((c) => c.id);
};
