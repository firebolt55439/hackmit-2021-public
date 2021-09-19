import random
import uuid
import csv
from collections import defaultdict

TABLES = [
    {
        "_table": "users",
        "_num": 800,
        "_each": [
            {
                "_table": "user_courses",
                "_num": 1,
                "user_id": "$id",
                "course_id": "5b533b0b-7182-4724-b87c-8e454c442bd5",
            },
            {
                "_table": "times",
                "_num": ["uniform", 3, 5],
                "user_id": "$id",
                "assignment_id": "e19831e8-f092-4e94-bcc0-25ce5f4cfbf5",
                "hours": ["uniform_real", 15, 20],
                "completed": ["choice", True, True, False, False, False],
            },
            {
                "_table": "times",
                "_num": ["uniform", 2, 4],
                "user_id": "$id",
                "assignment_id": "dda9d40a-6161-4b4f-b82b-72166ad7b476",
                "hours": ["uniform_real", 10, 15],
                "completed": ["choice", True, True, False, False, False],
            },
            {
                "_table": "times",
                "_num": ["uniform", 1, 6],
                "user_id": "$id",
                "assignment_id": "d2eb5e79-2a94-43db-b586-f522449f489e",
                "hours": ["uniform_real", 10, 20],
                "completed": ["choice", True, True, False, False, False],
            },
            {
                "_table": "times",
                "_num": ["uniform", 4, 6],
                "user_id": "$id",
                "assignment_id": "6856acb6-248f-4596-a259-f52a472df78e",
                "hours": ["uniform_real", 15, 20],
                "completed": ["choice", True, True, False, False, False],
            },
        ],
        "name": "Test User",
        "id": ["uuid"],
        "username": ["uuid"],
        "password_hash": ["uuid"],
        "salt": ["uuid"],
        "age": ["uniform", 18, 22],
        "gender": ["choice", "Male", "Female", "Other", "Not_Provided"],
        "race": [
            "choice",
            "White",
            "Black",
            "Asian",
            "Hawaiian",
            "American_Indian",
            "Not_Provided",
        ],
        "num_upper_taken": ["uniform", 3, 15],
        "num_lower_taken": ["uniform", 1, 5],
    },
]

outputs = defaultdict(list)


def process(val, context):
    if isinstance(val, list):
        typ, rest = val[0], val[1:]
        if typ == "choice":
            return random.choice(rest)
        elif typ == "uuid":
            return str(uuid.uuid4())
        elif typ == "uniform":
            return random.randint(rest[0], rest[1])
        elif typ == "uniform_real":
            return random.uniform(rest[0], rest[1])
        else:
            raise RuntimeError(f"unknown type {typ}")
    elif isinstance(val, int):
        return val
    elif isinstance(val, str):
        if val.startswith("$"):
            return context[val[1:]]
        else:
            return val


def recurse(on, context={}):
    tbl, num = on["_table"], process(on["_num"], context)
    for _ in range(num):
        val = {}
        for key in on:
            if key.startswith("_"):
                continue
            val[key] = process(on[key], context)
        outputs[tbl].append(val)
        if "_each" in on:
            for schema in on["_each"]:
                recurse(schema, context={**context, **val})


def main():
    for schema in TABLES:
        recurse(schema)

    for table in outputs:
        keys = list(outputs[table][0].keys())
        vals = [
            ("(" + ", ".join([repr(item[k]).lower() for k in keys]) + ")")
            for item in outputs[table]
        ]
        keys_str = ", ".join(keys)
        vals_str = ", ".join(vals)
        print(f"INSERT INTO classcaster_schema.{table} ({keys_str}) VALUES {vals_str};")

        # with open(f"outputs/{table}.csv", "w", newline="") as fp:
        #     writer = csv.writer(fp, quoting=csv.QUOTE_MINIMAL)
        #     keys = list(outputs[table][0].keys())
        #     writer.writerow(keys)
        #     writer.writerows([[item[k] for k in keys] for item in outputs[table]])
        #     keys_str = ", ".join(keys)
        #     print(f"IMPORT INTO users ({keys_str}) CSV DATA ();")


if __name__ == "__main__":
    main()
