from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify
from flask_mysqldb import MySQL
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
from math import radians, cos, sin, acos, degrees
from datetime import datetime
import re
import ephem

app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'sedatko'
app.config['MYSQL_DB'] = 'cs458'

mysql = MySQL(app)
app.secret_key = "dfmgojdkfgmdgkjdfmg"
oauth = OAuth(app)


@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/google/')
def google():
    GOOGLE_CLIENT_ID = '235009084771-qgj92ufgl0nnr56kgel8srj7a3ph470u.apps.googleusercontent.com'
    GOOGLE_CLIENT_SECRET = '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'

    CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
    oauth.register(
        name='google',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url=CONF_URL,
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

    redirect_uri = url_for('google_auth', _external=True)
    session['nonce'] = generate_token()
    return oauth.google.authorize_redirect(redirect_uri, nonce=session['nonce'])


@app.route('/google/auth/')
def google_auth():
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token, nonce=session['nonce'])
    session['user'] = user
    return redirect('/home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['button'] == 'Login':
            email = request.form['loginEmail']
            phone = request.form['loginEmail']
            password = request.form['loginPassword']

            if email == '' and password == '':
                flash("Enter email or phone number and password")
                return redirect('/login')
            elif not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", email):
                conv = True
                try:
                    email = int(email)
                except:
                    conv = False
                if conv == False:
                    flash('Incorrect input format')
                    return redirect('/login')

            cursor = mysql.connection.cursor()
            cursor.execute('SELECT * FROM user WHERE (email = %s OR phone = %s) AND password = %s',
                           (str(email), str(email), password))
            user = cursor.fetchone()

            if user:
                session['loginEmail'] = email
                return redirect('/home')
            else:
                flash('Incorrect email or password')
                return redirect('/login')

    else:
        return render_template('login.html')


@app.route('/home', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        return redirect('/logout')

    if 'loginEmail' in session:
        return render_template('home.html', username=session['loginEmail'])
    else:
        return redirect('/')


@app.route('/logout')
def logout():
    session.pop('loginEmail', None)
    return redirect('/login')


@app.route('/calculate')
def calculate():
    return render_template('calculate.html')


def calculate_distance(lat, lon):
    # Convert latitude and longitude to radians
    lat = radians(lat)
    lon = radians(lon)

    # Get the current position of the Sun using ephem
    observer = ephem.Observer()
    observer.lat = str(degrees(lat))
    observer.lon = str(degrees(lon))
    observer.date = datetime.utcnow()

    sun = ephem.Sun(observer)

    sun_lat = sun.dec
    sun_lon = sun.ra

    # Calculate distance using the spherical law of cosines
    distance = 149.6e6 * acos(sin(lat) * sin(sun_lat) + cos(lat) * cos(sun_lat) * cos(sun_lon - lon))

    return distance


@app.route('/calculate_distance', methods=['POST'])
def get_distance():
    # Reading coordinates from form or request body
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')

    distance = calculate_distance(lat, lon)

    return jsonify({'distance': f"{distance:.2f} km"})


if __name__ == '__main__':
    app.run(debug=True)
