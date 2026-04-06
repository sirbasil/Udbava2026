from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from db import init_db, get_db
from cache import get_cached, set_cached, invalidate_cache
import json
from datetime import datetime
from bson import json_util

app = Flask(__name__)
app.secret_key = 'super_secret_key'

db = get_db()
init_db()

def parse_json(data):
    return json.loads(json_util.dumps(data))

@app.route('/')
def index():
    products = list(db.products.find({}).limit(5))
    return render_template('index.html', products=products)

@app.route('/marketplace')
def marketplace():
    listings = list(db.listings.find({"sold": False}))
    return render_template('marketplace.html', listings=listings)

@app.route('/dashboard')
def dashboard():
    student_id = session.get('student_id', 'STU001')
    student = db.students.find_one({"student_id": student_id})
    orders = list(db.orders.find({"student_id": student_id}))
    my_listings = list(db.listings.find({"seller_id": student_id}))
    return render_template('dashboard.html', student=student, orders=orders, my_listings=my_listings)

@app.route('/manager')
def manager():
    products = list(db.products.find({}))
    analytics = {"categories": ["Used Books", "Lab Gear", "Merchandise"], "sales": [120, 80, 50]}
    return render_template('manager.html', products=products, analytics=analytics)

@app.route('/api/inventory/search')
def api_search():
    query = request.args.get('q', '')
    cache_key = f"search:{query}"
    cached = get_cached(cache_key)
    if cached:
        return jsonify(json.loads(cached))
    
    regex = {"$regex": query, "$options": "i"}
    results = list(db.products.find({"$or": [{"name": regex}, {"category": regex}]}))
    
    results_json = parse_json(results)
    set_cached(cache_key, json.dumps(results_json), 300)
    
    return jsonify(results_json)

@app.route('/api/inventory/item/<string:id>')
def api_item(id):
    pass

@app.route('/api/marketplace/list', methods=['POST'])
def api_list_item():
    pass

@app.route('/api/marketplace/listings')
def api_listings():
    pass

@app.route('/api/notify/subscribe', methods=['POST'])
def api_subscribe():
    return jsonify({"success": True})

@app.route('/api/manager/analytics')
def api_analytics():
    pass

@app.route('/api/orders/collect', methods=['POST'])
def api_collect():
    pass

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    pass

@app.route('/api/manager/stock', methods=['PATCH'])
def api_update_stock():
    data = request.json
    db.products.update_one({"_id": data['id']}, {"$set": {"stock_count": data['count']}})
    invalidate_cache("search:*")
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
