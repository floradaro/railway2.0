import os

# Configuración desarrollo
#DB_CONFIG_LOCAL = {
 #   'user': os.getenv('DB_USER', 'root'),
  #  'password': os.getenv('DB_PASSWORD', ''),
   # 'host': os.getenv('DB_HOST', 'localhost'),
  #  'database': os.getenv('DB_NAME', 'galgos'),
  #  'port': int(os.getenv('DB_PORT', '3306'))  # Valor por defecto como string
#}

# Configuración Producción
DB_CONFIG_PRODUCTION = {
    'user': 'root',
    'password': 'pCmWtaaQGqkIjHqmHVVUqVcfwsQIGvHt',
    'host': 'gondola.proxy.rlwy.net',
    'port': 15490,
    'database': 'railway'
}

#mysql://root:pCmWtaaQGqkIjHqmHVVUqVcfwsQIGvHt@gondola.proxy.rlwy.net:15490/railway

# Variable de entorno (True=local, False=producción)
USE_LOCAL_DB = os.getenv('USE_LOCAL_DB', 'False').lower() in ('true', '1', 't')


DB_CONFIG =  DB_CONFIG_PRODUCTION

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'clave-secreta-para-dev')
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True