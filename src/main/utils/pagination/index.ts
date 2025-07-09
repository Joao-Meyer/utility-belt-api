interface GetPageAndLimitInput {
  query: {
    page?: number;
    limit?: number;
  };
  max?: number;
}

interface GetPageAndLimitOutput {
  skip: number;
  take: number;
}

// remove
const aaa = 500;
const maxTake = 500;

export const getPagination = ({ query, max }: GetPageAndLimitInput): GetPageAndLimitOutput => {
  const page = query.page && Number(query.page) > 0 ? Number(query.page) : 1;
  let limit = query.limit && Number(query.limit) > 0 ? Number(query.limit) : aaa;

  if (limit > (max || maxTake)) limit = max || maxTake;

  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
};
