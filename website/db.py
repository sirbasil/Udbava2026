from datetime import datetime
import re

class MockCollection:
    def __init__(self):
        self.docs = []
    
    def count_documents(self, filter):
        return len(self.docs)
    
    def insert_many(self, docs):
        self.docs.extend(docs)
        
    def find(self, filter=None):
        if not filter:
            return self.docs
        results = []
        for d in self.docs:
            match = True
            for k, v in filter.items():
                if k == "$or":
                    or_match = False
                    for cond in v:
                        for ck, cv in cond.items():
                            if isinstance(cv, dict) and "$regex" in cv:
                                if re.search(cv["$regex"], str(d.get(ck, "")), re.IGNORECASE):
                                    or_match = True
                    match = or_match
                elif d.get(k) != v:
                    match = False
            if match:
                results.append(d)
        
        class Cursor(list):
            def limit(self, n):
                return Cursor(self[:n])
        return Cursor(results)

    def find_one(self, filter):
        res = self.find(filter)
        return res[0] if res else None

    def update_one(self, filter, update):
        target = self.find_one(filter)
        if target and "$set" in update:
            target.update(update["$set"])

class MockDB:
    def __init__(self):
        self.products = MockCollection()
        self.students = MockCollection()
        self.listings = MockCollection()
        self.orders = MockCollection()

db_client = MockDB()

def get_db():
    return db_client

def init_db():
    if db_client.products.count_documents({}) == 0:
        db_client.products.insert_many([
            {"_id": "P1", "name": "Calculus Early Transcendentals", "category": "Used Books", "price": 45.0, "stock_count": 3, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P2", "name": "Organic Chemistry Model Kit", "category": "Lab Gear", "price": 15.0, "stock_count": 8, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P3", "name": "Chemical Safety Goggles", "category": "Lab Gear", "price": 8.0, "stock_count": 4, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P4", "name": "University Hoodie (Dark Edition)", "category": "Merchandise", "price": 35.0, "stock_count": 2, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P5", "name": "Physics for Scientists", "category": "Used Books", "price": 55.0, "stock_count": 1, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P6", "name": "Lab Coat - Medium", "category": "Lab Gear", "price": 20.0, "stock_count": 0, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P7", "name": "Intro to Algorithms", "category": "Used Books", "price": 60.0, "stock_count": 5, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P8", "name": "SR Uni Coffee Mug", "category": "Merchandise", "price": 12.0, "stock_count": 15, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P9", "name": "Programming in C", "category": "Used Books", "price": 25.0, "stock_count": 7, "image_url": "", "last_updated": datetime.now()},
            {"_id": "P10", "name": "Notebook 5-Pack", "category": "Merchandise", "price": 10.0, "stock_count": 20, "image_url": "", "last_updated": datetime.now()},
        ])
    
    if db_client.students.count_documents({}) == 0:
        db_client.students.insert_many([
            {"_id": "S1", "name": "Alice Johnson", "email": "alice@sr.edu", "student_id": "STU001", "loyalty_points": 150, "verified": True, "password_hash": "hashed"},
            {"_id": "S2", "name": "Bob Smith", "email": "bob@sr.edu", "student_id": "STU002", "loyalty_points": 45, "verified": True, "password_hash": "hashed"}
        ])

    if db_client.listings.count_documents({}) == 0:
        db_client.listings.insert_many([
            {"_id": "L1", "seller_id": "STU002", "item_name": "Used Graphing Calculator", "condition": "Good", "price": 40.0, "category": "Electronics", "description": "Works perfectly. Minor scratches on back.", "sold": False, "created_at": datetime.now()}
        ])

    if db_client.orders.count_documents({}) == 0:
        db_client.orders.insert_many([
            {"_id": "O1", "student_id": "STU001", "items": [{"name": "Calculus book", "qty": 1}], "status": "Ready for Pickup", "pickup_time": "14:00", "created_at": datetime.now()}
        ])
