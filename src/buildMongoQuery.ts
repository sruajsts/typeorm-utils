export type AdvancedQueryFilter = {
    [key: string]:
        | string
        | number
        | boolean
        | null
        | (string | number)[]
        | {
              $like?: string;
              $in?: (string | number)[];
              $gt?: number;
              $lt?: number;
              $ne?: unknown;
              $eq?: unknown;
          };
};

export function buildMongoQuery(
    filter: AdvancedQueryFilter,
    includeDeleted = false,
): Record<string, unknown> {
    const query: Record<string, unknown> = includeDeleted
        ? {}
        : { deletedAt: null };

    Object.entries(filter).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const op = value as {
                $like?: string;
                $in?: (string | number)[];
                $gt?: number;
                $lt?: number;
                $ne?: unknown;
                $eq?: unknown;
            };

            if (op.$like !== undefined) {
                query[key] = { $regex: op.$like, $options: 'i' };
            } else if (op.$in !== undefined) {
                query[key] = { $in: op.$in };
            } else {
                const nested: Record<string, unknown> = {};
                if (op.$gt !== undefined) nested.$gt = op.$gt;
                if (op.$lt !== undefined) nested.$lt = op.$lt;
                if (op.$ne !== undefined) nested.$ne = op.$ne;
                if (op.$eq !== undefined) nested.$eq = op.$eq;
                query[key] = nested;
            }
        } else {
            query[key] = value;
        }
    });

    return query;
}
