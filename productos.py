productos = {
    1: {
        "id": 1,
        "nombre": "Sweater Lightning Bolt",
        "categoria": "Sweaters",
        "descripcion": "Sweater oversize con diseño rayos en contraste. Estilo urbano, ideal para destacar.",
        "material": "Algodón peinado premium",
        "cuidados": "Lavar del revés con agua fría. Secar a la sombra. No planchar sobre el estampado.",
        "imagenes": ["5-b.jpg", "5.jpg","5-a.jpg"],
        "imagen_principal": "5.jpg",
        "talles": ["S", "M", "L", "XL"]
    },
    2: {
        "id": 2,
        "nombre": "Jean Lightning Stitch",
        "categoria": "Jeans",
        "descripcion": "Jean relaxed fit con costuras destacadas al frente. Diseño exclusivo street.",
        "material": "Denim resistente con lavado especial",
        "cuidados": "Lavar con colores similares. No usar secadora. No usar blanqueador.",
        "imagenes": ["6-a.jpg","6.jpg", "5.jpg"],
        "imagen_principal": "6.jpg",
        "talles": ["M", "L", "XL"]
    },
    3: {
        "id": 3,
        "nombre": "Remera Boxy Desert",
        "categoria": "Remeras",
        "descripcion": "Remera fit boxy en tono beige con estampado minimal. Suelta, cómoda y con estilo.",
        "material": "Algodón 100% de alto gramaje",
        "cuidados": "Lavar a mano o en ciclo suave. No retorcer. Plancha suave si es necesario.",
        "imagenes": ["7.jpg", "7-a.jpg","7-b.jpg"],
        "imagen_principal": "7.jpg",
        "talles": ["S", "M", "L"]
    },
    4: {
        "id": 4,
        "nombre": "Campera Samples Blackout",
        "categoria": "Camperas",
        "descripcion": "Campera negra con cierre metálico y estampado sutil. Clásico atemporal con vibra urbana.",
        "material": "Poliéster impermeable y liviano",
        "cuidados": "Lavar en frío. No planchar. No usar blanqueador. Secar colgado.",
        "imagenes": ["8.jpg", "9.jpg"],
        "imagen_principal": "8.jpg",
        "talles": ["M", "L", "XL"]
    },
    5: {
        "id": 5,
        "nombre": "Jean Cargo Zipper",
        "categoria": "Jeans",
        "descripcion": "Cargo denim azul con bolsillos laterales y detalle de cierre. Inspiración utilitaria.",
        "material": "Denim grueso de alto rendimiento",
        "cuidados": "Lavar con prendas oscuras. No usar secadora. Planchar del revés.",
        "imagenes": ["9.jpg", "9-a.jpg","9-b.jpg"],
        "imagen_principal": "9.jpg",
        "talles": ["S", "M", "L", "XL"]
    },
    6: {
        "id": 6,
        "nombre": "Buzo Samples Studios Beige",
        "categoria": "Buzos",
        "descripcion": "Buzo beige con print frontal. Corte clásico y tela suave para uso diario.",
        "material": "Algodón premium con interior afelpado",
        "cuidados": "Lavar con agua fría. Evitar secadora. No planchar sobre la estampa.",
        "imagenes": ["10.jpg", "10-a.jpg","10-b.jpg"],
        "imagen_principal": "10.jpg",
        "talles": ["M", "L"]
    },
    7: {
        "id": 7,
        "nombre": "Buzo Den Helder Drop",
        "categoria": "Buzos",
        "descripcion": "Buzo con gráfica bold estilo vintage. Streetwear con actitud.",
        "material": "Algodón de gramaje medio",
        "cuidados": "Lavar con colores similares. No usar cloro. Secado natural.",
        "imagenes": ["11.jpg", "11-a.jpg","11-b.jpg"],
        "imagen_principal": "11.jpg",
        "talles": ["S", "M", "L"]
    },
    8: {
        "id": 8,
        "nombre": "Remera Essential Blanca",
        "categoria": "Remeras",
        "descripcion": "Remera blanca con print central exclusivo. Básico con identidad street.",
        "material": "Algodón 100% suave al tacto",
        "cuidados": "Lavar del revés. No usar blanqueador. Secar colgado a la sombra.",
        "imagenes": ["12.jpg","13.jpg", "14.jpg"],
        "imagen_principal": "12.jpg",
        "talles": ["S", "M", "L", "XL"]
    }
}
def obtener_producto_por_id(producto_id):
    """Función para obtener un producto por su ID"""
    return productos.get(producto_id)