from app import db
from datetime import datetime

class Leader(db.Model):
    __tablename__ = 'leader'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    avatar = db.Column(db.String(255), default='')
    id_card = db.Column(db.String(50), default='')
    status = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class PickupPoint(db.Model):
    __tablename__ = 'pickup_point'
    id = db.Column(db.Integer, primary_key=True)
    leader_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    province = db.Column(db.String(50), default='')
    city = db.Column(db.String(50), default='')
    district = db.Column(db.String(50), default='')
    contact_name = db.Column(db.String(50), nullable=False)
    contact_phone = db.Column(db.String(20), nullable=False)
    business_hours = db.Column(db.String(100), default='')
    status = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    sort_order = db.Column(db.Integer, default=0)
    status = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.now)

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    leader_id = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, default=0)
    name = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(255), default='')
    images = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    cost_price = db.Column(db.Numeric(10, 2), default=0.00)
    commission_rate = db.Column(db.Numeric(5, 2), default=10.00)
    stock = db.Column(db.Integer, default=0)
    sales = db.Column(db.Integer, default=0)
    unit = db.Column(db.String(20), default='件')
    description = db.Column(db.Text)
    specs = db.Column(db.Text)
    status = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class Order(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True)
    order_no = db.Column(db.String(50), nullable=False, unique=True)
    leader_id = db.Column(db.Integer, nullable=False)
    pickup_point_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(100), default='')
    user_phone = db.Column(db.String(20), default='')
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    commission_amount = db.Column(db.Numeric(10, 2), default=0.00)
    status = db.Column(db.Integer, default=0)
    payment_time = db.Column(db.DateTime)
    pickup_code = db.Column(db.String(20), default='')
    verify_time = db.Column(db.DateTime)
    verify_user_id = db.Column(db.Integer)
    remark = db.Column(db.String(255), default='')
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class OrderItem(db.Model):
    __tablename__ = 'order_item'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    product_image = db.Column(db.String(255), default='')
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    commission_rate = db.Column(db.Numeric(5, 2), default=0.00)
    commission_amount = db.Column(db.Numeric(10, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.now)

class Earnings(db.Model):
    __tablename__ = 'earnings'
    id = db.Column(db.Integer, primary_key=True)
    leader_id = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.Integer, nullable=False)
    order_no = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    type = db.Column(db.Integer, default=1)
    status = db.Column(db.Integer, default=0)
    settle_time = db.Column(db.DateTime)
    remark = db.Column(db.String(255), default='')
    created_at = db.Column(db.DateTime, default=datetime.now)

class Withdrawal(db.Model):
    __tablename__ = 'withdrawal'
    id = db.Column(db.Integer, primary_key=True)
    leader_id = db.Column(db.Integer, nullable=False)
    withdrawal_no = db.Column(db.String(50), nullable=False, unique=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    fee = db.Column(db.Numeric(10, 2), default=0.00)
    actual_amount = db.Column(db.Numeric(10, 2), nullable=False)
    account_type = db.Column(db.Integer, default=1)
    account_name = db.Column(db.String(100), nullable=False)
    account_no = db.Column(db.String(100), nullable=False)
    bank_name = db.Column(db.String(100), default='')
    status = db.Column(db.Integer, default=0)
    audit_time = db.Column(db.DateTime)
    audit_remark = db.Column(db.String(255), default='')
    pay_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class LeaderWallet(db.Model):
    __tablename__ = 'leader_wallet'
    id = db.Column(db.Integer, primary_key=True)
    leader_id = db.Column(db.Integer, nullable=False, unique=True)
    total_earnings = db.Column(db.Numeric(10, 2), default=0.00)
    available_balance = db.Column(db.Numeric(10, 2), default=0.00)
    frozen_balance = db.Column(db.Numeric(10, 2), default=0.00)
    total_withdrawal = db.Column(db.Numeric(10, 2), default=0.00)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
