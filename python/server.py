from turtle import title
from flask import Flask, jsonify, redirect, request, render_template, flash, session, url_for
from flask_session import Session
import dotenv
import os

dotenv.load_dotenv()

app = Flask(__name__)

# app.secret_key = os.getenv("SESSION_SECRET")
# app.config['SESSION_TYPE'] = 'mongodb'
# Session(app)


@app.get('/')
def home():
    return render_template('home.html', title='Products')
    # return redirect("/products")
    
@app.get('/auth/login')
def get_login():
    return render_template('login.html', title='Login')
    
@app.get('/auth/register')
def get_register():
    return render_template('register.html', title='Register')

@app.get('/products')
def get_products():
    return "evwev"

@app.route('/cart')
def cart():
    return "render_template('cart.html')"
    # return render_template('cart.html')

app.run(debug=True, port=os.getenv('PORT'))
