productos = {
    1: {
        "id": 1,
        "nombre": "Remera Oversize Blanca",
        "categoria": "Remeras",
        "descripcion": "Remera de algodón 100% con corte oversize para un estilo urbano.",
        "material": "Algodón",
        "cuidados": "Lavar con colores similares. No usar blanqueador.",
        "imagenes": ["5-b.jpg", "5.jpg","5-a.jpg"],
        "imagen_principal": "5.jpg",
        "talles": ["S", "M", "L", "XL"]
    },
    2: {
        "id": 2,
        "nombre": "Campera Denim Clásica",
        "categoria": "Camperas",
        "descripcion": "Campera de jean con botones metálicos y bolsillos frontales.",
        "material": "Jean",
        "cuidados": "Lavar del revés. No secar en máquina.",
        "imagenes": ["6-a.jpg","6.jpg", "5.jpg"],
        "imagen_principal": "6.jpg",
        "talles": ["M", "L", "XL"]
    },
    3: {
        "id": 3,
        "nombre": "Pantalón Cargo Verde",
        "categoria": "Pantalones",
        "descripcion": "Pantalón estilo cargo con múltiples bolsillos y cordón ajustable.",
        "material": "Gabardina",
        "cuidados": "Plancha tibia. No retorcer.",
        "imagenes": ["7.jpg", "7-a.jpg","7-b.jpg"],
        "imagen_principal": "7.jpg",
        "talles": ["S", "M", "L"]
    },
    4: {
        "id": 4,
        "nombre": "Camisa Cuadros Flanelada",
        "categoria": "Camisas",
        "descripcion": "Camisa de franela con estampado a cuadros y botones frontales.",
        "material": "Franela",
        "cuidados": "No lavar en seco. Lavar con agua fría.",
        "imagenes": ["8.jpg", "9.jpg"],
        "imagen_principal": "8.jpg",
        "talles": ["M", "L", "XL"]
    },
    5: {
        "id": 5,
        "nombre": "Buzo con Capucha Negro",
        "categoria": "Buzos",
        "descripcion": "Buzo de felpa con capucha ajustable y bolsillo canguro.",
        "material": "Algodón y poliéster",
        "cuidados": "Secar a la sombra. No usar plancha caliente.",
        "imagenes": ["9.jpg", "9-a.jpg","9-b.jpg"],
        "imagen_principal": "9.jpg",
        "talles": ["S", "M", "L", "XL"]
    },
    6: {
        "id": 6,
        "nombre": "Chaleco Puffer",
        "categoria": "Chalecos",
        "descripcion": "Chaleco acolchado ideal para días frescos, con cierre frontal.",
        "material": "Poliéster",
        "cuidados": "No planchar. Lavar a mano.",
        "imagenes": ["10.jpg", "10-a.jpg","10-b.jpg"],
        "imagen_principal": "10.jpg",
        "talles": ["M", "L"]
    },
    7: {
        "id": 7,
        "nombre": "Short Deportivo Gris",
        "categoria": "Shorts",
        "descripcion": "Short con cintura elástica y bolsillos laterales, ideal para entrenar.",
        "material": "Poliéster liviano",
        "cuidados": "Lavar con agua fría. No usar secadora.",
        "imagenes": ["11.jpg", "11-a.jpg","11-b.jpg"],
        "imagen_principal": "11.jpg",
        "talles": ["S", "M", "L"]
    },
    8: {
        "id": 8,
        "nombre": "Remera Estampada Negra",
        "categoria": "Remeras",
        "descripcion": "Remera negra con estampado frontal exclusivo de la temporada.",
        "material": "Algodón",
        "cuidados": "Lavar del revés. No usar blanqueador.",
        "imagenes": ["12.jpg","13.jpg", "14.jpg"],
        "imagen_principal": "12.jpg",
        "talles": ["S", "M", "L", "XL"]
    },
}
def obtener_producto_por_id(producto_id):
    """Función para obtener un producto por su ID"""
    return productos.get(producto_id)