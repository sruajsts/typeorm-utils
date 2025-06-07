# 🧰 buildMongoQuery

A lightweight utility to dynamically construct MongoDB-compatible filter objects from a flexible `AdvancedQueryFilter` structure. Works seamlessly with `MongoRepository` in TypeORM-based NestJS applications..

---

## 📦 Features

- Supports advanced filtering operators:
    - `$like`: case-insensitive substring match
    - `$in`: array match
    - `$gt`, `$lt`: greater than / less than
    - `$eq`, `$ne`: equals / not equals
- Automatically excludes soft-deleted records (`{ deletedAt: null }`) by default
- Type-safe and ESLint-safe implementation

---

## 🚀 Installation

```bash
npm install @solunertech/typeorm-utils
```

---

## 🧑‍💻 Usage

```ts
import { buildMongoQuery } from '@solunertech/typeorm-utils';

const query = buildMongoQuery({
    name: { $like: 'john' },
    age: { $gt: 25 },
    role: { $in: ['admin', 'editor'] },
});

const results = await this.userRepo.find({ where: query });
```

### Include soft-deleted documents

```ts
const query = buildMongoQuery({}, true); // includeDeleted = true
```

---

## 📘 Type Definition

```ts
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
```

---

## 📤 Function Signature

```ts
function buildMongoQuery(
    filter: AdvancedQueryFilter,
    includeDeleted?: boolean,
): Record<string, unknown>;
```

---

## 🧪 Example Output

### Input:

```ts
buildMongoQuery({
    name: { $like: 'admin' },
    status: 'active',
    age: { $gt: 18 },
});
```

### Output:

```ts
{
  deletedAt: null,
  name: { $regex: 'admin', $options: 'i' },
  status: 'active',
  age: { $gt: 18 }
}
```

---

## 🧾 License

MIT
