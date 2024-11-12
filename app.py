from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'user': 'root',
    'password': 'gFnBMkOKsYoOlZbwNanXgUVKkmQkNrmU',
    'host': 'mysql.railway.internal',
    'database': 'railway'
}

@app.route('/')
def home():
    return "¡Hola, mundo!"

@app.route('/test_db')
def test_db():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        return f"Conectado a la base de datos: {db_name}"
    except mysql.connector.Error as err:
        return f"Error: {err}"
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
