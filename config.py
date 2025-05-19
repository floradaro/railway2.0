import os

# Configuración desarrollo
DB_CONFIG_LOCAL = {
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'galgos'),
    'port': int(os.getenv('DB_PORT', '3306'))  # Valor por defecto como string
}

# Configuración Producción
DB_CONFIG_PRODUCTION = {
    'user': os.getenv('PROD_DB_USER', 'root'),  # Añade valores por defecto
    'password': os.getenv('PROD_DB_PASSWORD', ''),
    'host': os.getenv('PROD_DB_HOST', 'localhost'),
    'database': os.getenv('PROD_DB_NAME', 'railway'),
    'port': int(os.getenv('PROD_DB_PORT', '21588'))  # Valor por defecto como string
}

# Variable de entorno (True=local, False=producción)
USE_LOCAL_DB = os.getenv('USE_LOCAL_DB', 'True').lower() in ('true', '1', 't')

DB_CONFIG = DB_CONFIG_LOCAL if USE_LOCAL_DB else DB_CONFIG_PRODUCTION

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'clave-secreta-para-dev')
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True