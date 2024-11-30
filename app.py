from flask import Flask, request, jsonify, render_template
import os
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'user': 'root',
    'password': 'ohxJtyQrrvZaabepsYqWKxXMnuZKeqqi',
    'host': 'autorack.proxy.rlwy.net',
    'database': 'railway',
    'port': 17945
}
#mysql://root:ohxJtyQrrvZaabepsYqWKxXMnuZKeqqi@autorack.proxy.rlwy.net:17945/railway
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/')
def home():
    return render_template('index.html')

# Crear un nuevo usuario
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    fullname = data['fullname']
    phone = data['phone']
    email = data['email']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (fullname, phone, email) VALUES (%s,%s, %s)", (fullname, phone, email))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario creado exitosamente'}), 201

# Obtener todos los usuarios
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# Obtener un usuario por ID
@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify(user)
    else:
        return jsonify({'message': 'Usuario no encontrado'}), 404

# Actualizar un usuario por ID
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    fullname = data['fullname']
    phone = data['phone']
    email = data['email']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET fullname = %s, phone= %s, email = %s WHERE id = %s", (fullname,phone, email, id))
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
