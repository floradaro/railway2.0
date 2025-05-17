from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import os
import mysql.connector
from productos import obtener_producto_por_id
from productos import productos


app = Flask(__name__)

app.secret_key = os.getenv('SECRET_KEY', 'clave-secreta-para-dev')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_COOKIE_HTTPONLY'] = True

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
    return render_template('index.html',productos=productos.values())

@app.route('/contact_form.html')
def contact():
    return render_template('contact_form.html')


@app.route('/detalle/<int:producto_id>')
def detalle_producto(producto_id):
    producto = obtener_producto_por_id(producto_id)
    if producto:
        # Obtener productos relacionados (excluyendo el producto actual)
        productos_relacionados = [p for id, p in productos.items() if id != producto_id][:4]
        return render_template('detail.html', producto=producto, productos_relacionados=productos_relacionados)
    else:
        return "Producto no encontrado", 404


@app.route('/signup', methods=['GET'])
def signup_page():
    email_prefill = request.args.get('email', '')
    return render_template('signup.html', email=email_prefill)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/password_reset')
def reset():
    return render_template('password_reset.html')

@app.route('/check_login_status')
def check_login_status():
    return jsonify({'logged_in': 'logged_in' in session})

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

    user_id = cursor.lastrowid

    session.permanent = True
    session['logged_in'] = True
    session['user_id'] = user_id

    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario creado exitosamente', 'user_id': user_id}), 201

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
@app.route('/current_user', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'message': 'No autenticado'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify(user)
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

# Mejorado: Obtener usuario específico por ID para edición
@app.route('/users/<int:id>', methods=['GET'])
def get_user_by_id(id):
    # Verificar que el usuario está autenticado y tiene permiso para ver este usuario
    if not session.get('logged_in') or session.get('user_id') != id:
        return jsonify({'message': 'No autorizado'}), 403
        
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
            session.permanent = True
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

@app.before_request
def check_login():
    public_routes = ['home', 'login','contact','signup_page', 'create_user', 'reset', 'static', 'check_login_status', 'sizeTable']
    
    if request.endpoint and request.endpoint not in public_routes and not session.get('logged_in'):
        return redirect(url_for('login'))

# Verificación de inicio de sesión - Mejorado para cargar datos de usuario
@app.route('/profile')
def profile():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    user_id = session.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        session.clear()  # Si el usuario no existe, cerrar sesión
        return redirect(url_for('login'))
        
    return render_template('profile.html', user=user)

# Actualizar un usuario por ID - Mejorado para verificar contraseña
@app.route('/update_profile/<int:id>', methods=['POST'])
def update_profile(id):
    # Verificar que el usuario está autenticado y tiene permiso para editar este usuario
    if not session.get('logged_in') or session.get('user_id') != id:
        return jsonify({'message': 'No autorizado'}), 403
    
    data = request.get_json()
    fullname = data['fullname']
    email = data['email']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("UPDATE users SET fullname = %s, email = %s WHERE id = %s", 
                      (fullname, email, id))
        
        if cursor.rowcount > 0:
            conn.commit()
            return jsonify({'message': 'Perfil actualizado exitosamente'}), 200
        else:
            # Si no se actualizó nada
            return jsonify({'message': 'No se encontró el usuario o no hubo cambios'}), 404
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Ruta para actualizar la contraseña del usuario
@app.route('/update_password/<int:id>', methods=['POST'])
def update_password(id):
    # Verificar que el usuario está autenticado y tiene permiso
    if not session.get('logged_in') or session.get('user_id') != id:
        return jsonify({'message': 'No autorizado'}), 403
    
    data = request.get_json()
    current_password = data['current_password']
    new_password = data['new_password']
    
    # Verificar la contraseña actual
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT password FROM users WHERE id = %s", (id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        if user['password'] != current_password:
            return jsonify({'message': 'Contraseña actual incorrecta'}), 401
        
        # Actualizar la contraseña
        cursor.execute("UPDATE users SET password = %s WHERE id = %s", 
                      (new_password, id))
        
        if cursor.rowcount > 0:
            conn.commit()
            return jsonify({'message': 'Contraseña actualizada exitosamente'}), 200
        else:
            return jsonify({'message': 'No se pudo actualizar la contraseña'}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Eliminar un usuario por ID - Mejorado para verificar autenticación
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    # Verificar que el usuario está autenticado y tiene permiso para eliminar este usuario
    if not session.get('logged_in') or session.get('user_id') != id:
        return jsonify({'message': 'No autorizado'}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    
    if cursor.rowcount > 0:
        conn.commit()
        # Cerrar la sesión del usuario eliminado
        if session.get('user_id') == id:
            session.clear()
    else:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario eliminado exitosamente'})

@app.route('/sizeTable')
def sizeTable():
    return render_template('sizeTable.html')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))