import os

# Configuracion desarrollo
DB_CONFIG_LOCAL = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'galgos',
    'port': 3306
}

# Configuracion Produccion
DB_CONFIG_PRODUCTION = {
    'user': 'root',
    'password': 'DVrbXVwFjFZiUJCcoGKgGTPdmOCbolnI',
    'host': 'junction.proxy.rlwy.net',
    'database': 'railway',
    'port': 21588
}

# Variable de entorno
USE_LOCAL_DB = True  # Cambia a False para producción


DB_CONFIG = DB_CONFIG_LOCAL if USE_LOCAL_DB else DB_CONFIG_PRODUCTION

# Configuraciones generales de Flask
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'clave-secreta-para-dev')
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True