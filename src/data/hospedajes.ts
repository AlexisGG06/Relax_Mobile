export type HospedajeCatalogo = {
  id: string;
  nombre: string;
  zona: string;
  ubicacion: string;
  precio: number;
  calificacion: number;
  tipo: string;
  habitacion: string;
  descripcion: string;
  imagenes: string[];
  servicios: string[];
  checkIn: string;
  checkOut: string;
  capacidad: number;
  camas: number;
  banos: number;
  politicas: string[];
};

/*
  IMÁGENES PROVISIONALES

  Después podemos sustituir estas imágenes
  por las imágenes que tú agregues al proyecto.
*/

const IMAGENES_HUASCA = [
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
];

const IMAGENES_REAL = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
];

const IMAGENES_CHICO = [
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520984032042-162d526883e0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80',
];

export const HOSPEDAJES: HospedajeCatalogo[] = [
  // =========================================
  // HUASCA DE OCAMPO
  // =========================================

  {
    id: 'hotel-bosque-relax',
    nombre: 'Hotel Bosque RELAX',
    zona: 'Huasca de Ocampo',
    ubicacion: 'Huasca de Ocampo',
    precio: 1250,
    calificacion: 4.8,
    tipo: 'Hotel de naturaleza',
    habitacion: 'Habitación familiar',
    descripcion:
      'Hospedaje de estilo rústico rodeado de naturaleza. Es una opción pensada para descansar después de recorrer Huasca y disfrutar de un ambiente tranquilo.',
    imagenes: IMAGENES_HUASCA,
    servicios: [
      'Wi-Fi gratis',
      'Estacionamiento',
      'Desayuno',
      'Agua caliente',
      'Televisión',
      'Jardín',
      'Chimenea',
      'Recepción',
      'Limpieza',
      'Vista al bosque',
    ],
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    capacidad: 4,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar dentro de las habitaciones',
      'Niños permitidos',
      'Mascotas sujetas a disponibilidad',
      'Respetar las áreas comunes',
    ],
  },

  {
    id: 'cabanas-prismas',
    nombre: 'Cabañas Prismas',
    zona: 'Huasca de Ocampo',
    ubicacion: 'Huasca de Ocampo',
    precio: 1680,
    calificacion: 4.9,
    tipo: 'Cabaña',
    habitacion: 'Cabaña completa',
    descripcion:
      'Cabaña amplia para familias o grupos pequeños que buscan una estancia rodeada de bosque y un ambiente privado.',
    imagenes: IMAGENES_HUASCA,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Cocina equipada',
      'Chimenea',
      'Agua caliente',
      'Terraza',
      'Asador',
      'Cafetera',
      'Refrigerador',
      'Vista al bosque',
    ],
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    capacidad: 5,
    camas: 3,
    banos: 2,
    politicas: [
      'No fumar dentro de la cabaña',
      'Niños permitidos',
      'Mascotas permitidas con aviso previo',
      'Mantener limpias las áreas naturales',
    ],
  },

  {
    id: 'posada-encino',
    nombre: 'Posada Encino',
    zona: 'Huasca de Ocampo',
    ubicacion: 'Huasca de Ocampo',
    precio: 980,
    calificacion: 4.6,
    tipo: 'Posada',
    habitacion: 'Habitación doble',
    descripcion:
      'Posada sencilla y acogedora para viajeros que buscan una opción económica y cómoda cerca de los principales atractivos de Huasca.',
    imagenes: IMAGENES_HUASCA,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Agua caliente',
      'Televisión',
      'Recepción',
      'Limpieza',
      'Cafetera',
      'Información turística',
    ],
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    capacidad: 3,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'No realizar fiestas',
      'Respetar horario de descanso',
    ],
  },

  {
    id: 'refugio-santa-maria',
    nombre: 'Refugio Santa María',
    zona: 'Huasca de Ocampo',
    ubicacion: 'Huasca de Ocampo',
    precio: 1420,
    calificacion: 4.7,
    tipo: 'Hotel rural',
    habitacion: 'Suite rústica',
    descripcion:
      'Alojamiento rural de estilo tradicional con espacios tranquilos y áreas exteriores para disfrutar del clima y paisaje de Huasca.',
    imagenes: IMAGENES_HUASCA,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Desayuno',
      'Jardín',
      'Agua caliente',
      'Televisión',
      'Terraza',
      'Recepción',
      'Limpieza diaria',
    ],
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    capacidad: 4,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar en habitaciones',
      'Niños permitidos',
      'No fiestas después de las 10 PM',
      'Cuidar las áreas verdes',
    ],
  },

  // =========================================
  // REAL DEL MONTE
  // =========================================

  {
    id: 'posada-real',
    nombre: 'Posada Real',
    zona: 'Real del Monte',
    ubicacion: 'Real del Monte',
    precio: 980,
    calificacion: 4.7,
    tipo: 'Posada tradicional',
    habitacion: 'Habitación familiar',
    descripcion:
      'Posada de estilo tradicional para conocer el ambiente histórico y minero de Real del Monte.',
    imagenes: IMAGENES_REAL,
    servicios: [
      'Wi-Fi gratis',
      'Estacionamiento',
      'Desayuno',
      'Agua caliente',
      'Televisión',
      'Recepción',
      'Limpieza',
      'Información turística',
    ],
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    capacidad: 4,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'Respetar horario de descanso',
      'No fiestas dentro de habitaciones',
    ],
  },

  {
    id: 'hotel-mina-del-conde',
    nombre: 'Hotel Mina del Conde',
    zona: 'Real del Monte',
    ubicacion: 'Real del Monte',
    precio: 1320,
    calificacion: 4.8,
    tipo: 'Hotel boutique',
    habitacion: 'Habitación superior',
    descripcion:
      'Hotel inspirado en la tradición minera de la zona, con habitaciones cómodas y espacios pensados para parejas o familias.',
    imagenes: IMAGENES_REAL,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Desayuno',
      'Restaurante',
      'Agua caliente',
      'Televisión',
      'Recepción 24 horas',
      'Calefacción',
      'Limpieza',
    ],
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    capacidad: 4,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'No mascotas',
      'Mantener bajo el volumen durante la noche',
    ],
  },

  {
    id: 'casona-del-real',
    nombre: 'Casona del Real',
    zona: 'Real del Monte',
    ubicacion: 'Real del Monte',
    precio: 1180,
    calificacion: 4.6,
    tipo: 'Casona tradicional',
    habitacion: 'Habitación colonial',
    descripcion:
      'Hospedaje con ambiente tradicional y decoración inspirada en las antiguas casonas de la región.',
    imagenes: IMAGENES_REAL,
    servicios: [
      'Wi-Fi',
      'Agua caliente',
      'Televisión',
      'Desayuno',
      'Patio interior',
      'Recepción',
      'Limpieza',
      'Cafetera',
    ],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    capacidad: 3,
    camas: 2,
    banos: 1,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'No fiestas',
      'Cuidar el mobiliario',
    ],
  },

  {
    id: 'portal-minero',
    nombre: 'Hotel Portal Minero',
    zona: 'Real del Monte',
    ubicacion: 'Real del Monte',
    precio: 1450,
    calificacion: 4.9,
    tipo: 'Hotel',
    habitacion: 'Suite familiar',
    descripcion:
      'Hotel cómodo para quienes desean permanecer cerca del centro y de los principales atractivos culturales de Real del Monte.',
    imagenes: IMAGENES_REAL,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Desayuno',
      'Restaurante',
      'Agua caliente',
      'Televisión',
      'Calefacción',
      'Recepción 24 horas',
      'Servicio de limpieza',
      'Área común',
    ],
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    capacidad: 5,
    camas: 3,
    banos: 2,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'No mascotas',
      'Evitar ruido excesivo después de las 10 PM',
    ],
  },

  // =========================================
  // MINERAL DEL CHICO
  // =========================================

  {
    id: 'cabana-del-mineral',
    nombre: 'Cabaña del Mineral',
    zona: 'Mineral del Chico',
    ubicacion: 'Mineral del Chico',
    precio: 1500,
    calificacion: 4.9,
    tipo: 'Cabaña de montaña',
    habitacion: 'Cabaña completa',
    descripcion:
      'Cabaña acogedora rodeada de bosque y montaña para disfrutar de una estancia tranquila en Mineral del Chico.',
    imagenes: IMAGENES_CHICO,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Chimenea',
      'Cocina',
      'Agua caliente',
      'Terraza',
      'Vista al bosque',
      'Televisión',
      'Cafetera',
      'Asador',
    ],
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    capacidad: 6,
    camas: 3,
    banos: 2,
    politicas: [
      'No fumar dentro de la cabaña',
      'Niños permitidos',
      'Mascotas sujetas a disponibilidad',
      'Respetar las áreas naturales',
    ],
  },

  {
    id: 'refugio-del-chico',
    nombre: 'Refugio del Chico',
    zona: 'Mineral del Chico',
    ubicacion: 'Mineral del Chico',
    precio: 1750,
    calificacion: 4.8,
    tipo: 'Refugio de montaña',
    habitacion: 'Cabaña premium',
    descripcion:
      'Refugio de montaña con espacios amplios y ambiente cálido, pensado para descansar después de actividades de senderismo.',
    imagenes: IMAGENES_CHICO,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Chimenea',
      'Cocina equipada',
      'Terraza',
      'Agua caliente',
      'Asador',
      'Cafetera',
      'Refrigerador',
      'Vista a la montaña',
    ],
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    capacidad: 6,
    camas: 4,
    banos: 2,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'Mascotas permitidas con aviso',
      'No dejar basura en áreas naturales',
    ],
  },

  {
    id: 'cabanas-pino-alto',
    nombre: 'Cabañas Pino Alto',
    zona: 'Mineral del Chico',
    ubicacion: 'Mineral del Chico',
    precio: 1380,
    calificacion: 4.7,
    tipo: 'Cabaña',
    habitacion: 'Cabaña familiar',
    descripcion:
      'Cabañas sencillas rodeadas de pinos, ideales para familias y pequeños grupos que buscan contacto con la naturaleza.',
    imagenes: IMAGENES_CHICO,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Cocina',
      'Chimenea',
      'Agua caliente',
      'Asador',
      'Jardín',
      'Cafetera',
    ],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    capacidad: 5,
    camas: 3,
    banos: 1,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'Mascotas permitidas',
      'Respetar el horario de descanso',
    ],
  },

  {
    id: 'mirador-montana',
    nombre: 'Mirador de la Montaña',
    zona: 'Mineral del Chico',
    ubicacion: 'Mineral del Chico',
    precio: 1890,
    calificacion: 4.9,
    tipo: 'Cabaña premium',
    habitacion: 'Suite con vista a la montaña',
    descripcion:
      'Alojamiento pensado para disfrutar del paisaje montañoso con terraza, espacios amplios y ambiente tranquilo.',
    imagenes: IMAGENES_CHICO,
    servicios: [
      'Wi-Fi',
      'Estacionamiento',
      'Chimenea',
      'Cocina equipada',
      'Terraza privada',
      'Agua caliente',
      'Televisión',
      'Cafetera',
      'Vista panorámica',
      'Asador',
    ],
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    capacidad: 4,
    camas: 2,
    banos: 2,
    politicas: [
      'No fumar',
      'Niños permitidos',
      'No fiestas',
      'Respetar las áreas naturales',
    ],
  },
];

export function obtenerHospedajePorId(
  id?: string
) {
  if (!id) {
    return undefined;
  }

  return HOSPEDAJES.find(
    (hospedaje) =>
      hospedaje.id === id
  );
}