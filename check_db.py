from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['taskmanager']

print("=" * 50)
print("USERS COLLECTION")
print("=" * 50)
users = list(db['users'].find({}, {'password': 0}))
for u in users:
    print(f"  ID:      {u['_id']}")
    print(f"  Name:    {u.get('name')}")
    print(f"  Email:   {u['email']}")
    print(f"  Created: {u.get('created_at')}")
    print("-" * 30)
print(f"Total users: {len(users)}")

print()
print("=" * 50)
print("TASKS COLLECTION")
print("=" * 50)
tasks = list(db['tasks'].find({}))
for t in tasks:
    print(f"  ID:      {t['_id']}")
    print(f"  Title:   {t['title']}")
    print(f"  Done:    {t.get('done')}")
    print(f"  User ID: {t.get('user_id')}")
    print("-" * 30)
print(f"Total tasks: {len(tasks)}")
