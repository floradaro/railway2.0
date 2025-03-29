from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import os
import mysql.connector

app = Flask(__name__)

app.secret_key = os.getenv('SECRET_KEY', 'clave-secreta-para-dev')

# Configuración para entorno local
db_config_local = {
    'user': 'root',
    'password': '',  # Cambia por tu contraseña local
    'host': 'localhost',
    'database': 'galgos',  # Cambia por el nombre de tu base de datos local
    'port': 3306  # Puerto predeterminado de MySQL
}

# Configuración de la base de datos railway
#
#db_config_production = {
#   'user': 'root',
#   'password': 'DVrbXVwFjFZiUJCcoGKgGTPdmOCbolnI',
#    'host': 'junction.proxy.rlwy.net',
#    'database': 'railway',
#    'port':21588
#}

#mysql://root:DVrbXVwFjFZiUJCcoGKgGTPdmOCbolnI@junction.proxy.rlwy.net:21588/railway
USE_LOCAL_DB= True
db_config = db_config_local if USE_LOCAL_DB else db_config_production

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template('signup.html') 

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('home'))

@app.route('/password_reset')
def reset():
    return render_template('password_reset.html')

# Crear un nuevo usuario
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    fullname = data['fullname']
    email = data['email']
    password = data['password']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (fullname, email, password) VALUES (%s,%s, %s)", (fullname, email, password))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario creado exitosamente'}), 201

# Obtener todos los usuarios
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# Obtener un usuario por ID
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify(user)
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.is_json: 
            data = request.get_json()
            email = data['email']
            password = data['password']
        else:  
            email = request.form['email']
            password = request.form['password']
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user and user['password'] == password:
            session['logged_in'] = True
            session['user_id'] = user['id']
            
            if request.is_json:
                return jsonify({'message': 'Login exitoso', 'user_id': user['id']}), 200
            else:
                return redirect(url_for('home'))
        else:
            if request.is_json:
                return jsonify({'message': 'Datos inválidos'}), 401
            else:
                return "Datos inválidos", 401
    
    return render_template('login.html')

#Verificacion de inicio de sesión
@app.route('/profile')
def profile():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('profile.html')

# Actualizar un usuario por ID
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    fullname = data['fullname']
    email = data['email']
    password = data['password']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET fullname = %s, email = %s, password = %s WHERE id = %s", (fullname,email, password, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario actualizado exitosamente'})

# Eliminar un usuario por ID
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario eliminado exitosamente'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
