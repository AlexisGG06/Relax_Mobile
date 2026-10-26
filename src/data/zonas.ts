export type ActividadZona = {
  nombre: string;
  tipo: string;
  duracion: string;
  descripcion: string;
  precio: number;
  emoji: string;
  imagen?: any;
};

export type RestauranteZona = {
  nombre: string;
  tipo: string;
  descripcion: string;
  menu: string;
  precioPromedio: number;
  calificacion: number;
  emoji: string;
  imagen?: any;
};

export type ZonaTuristica = {
  id: string;
  nombre: string;
  emoji: string;
  resumen: string;

  hospedaje: {
    nombre: string;
    precio: number;
  };

  actividades: ActividadZona[];
  restaurantes: RestauranteZona[];
  lugares: string[];
};

export const ZONAS: ZonaTuristica[] = [
  // ==================================================
  // HUASCA DE OCAMPO
  // ==================================================

  {
    id: 'huasca',

    nombre: 'Huasca de Ocampo',

    emoji: '🌲',

    resumen:
      'Huasca de Ocampo es una zona ideal para quienes buscan naturaleza, tranquilidad y paisajes. Se caracteriza por sus bosques, construcciones de estilo tradicional y atractivos naturales como los Prismas Basálticos. Es un buen destino para caminar, tomar fotografías, conocer el centro del Pueblo Mágico y realizar recorridos al aire libre. También cuenta con opciones de hospedaje de estilo rústico, restaurantes de comida tradicional y actividades pensadas para familias, parejas o grupos de amigos. Durante la visita se puede disfrutar de un ambiente tranquilo, recorridos por zonas naturales y diferentes espacios para descansar y conocer más de la cultura de Hidalgo.',

    hospedaje: {
      nombre: 'Hotel Bosque RELAX',
      precio: 1250,
    },

    actividades: [
      {
        nombre:
          'Visita a los Prismas Basálticos',

        tipo: 'Naturaleza',

        duracion: '2 horas',

        descripcion:
          'Recorrido pensado para conocer las formaciones de roca basáltica, observar las cascadas y disfrutar de los paisajes naturales de la zona. Es una actividad ideal para caminar, tomar fotografías y conocer uno de los atractivos más representativos de Huasca.',

        precio: 180,

        emoji: '🏞️',

        imagen: require(
          '../../assets/actividades/huasca_prismas.jpg'
        ),
      },

      {
        nombre:
          'Recorrido por el centro de Huasca',

        tipo: 'Cultura',

        duracion: '2 horas',

        descripcion:
          'Recorrido por las calles principales de Huasca de Ocampo para conocer su arquitectura, plazas, comercios, artesanías y ambiente tradicional. Es una opción tranquila para conocer mejor el Pueblo Mágico.',

        precio: 120,

        emoji: '🏘️',

        imagen: require(
          '../../assets/actividades/huasca_centro.jpg'
        ),
      },

      {
        nombre:
          'Caminata por el bosque',

        tipo: 'Naturaleza',

        duracion: '3 horas',

        descripcion:
          'Experiencia al aire libre entre árboles y senderos de la zona. Durante la caminata se pueden apreciar paisajes naturales, respirar aire fresco y disfrutar de un ambiente tranquilo rodeado de vegetación.',

        precio: 200,

        emoji: '🌲',

        imagen: require(
          '../../assets/actividades/huasca_bosque.jpg'
        ),
      },

      {
        nombre:
          'Recorrido de leyendas',

        tipo: 'Cultura',

        duracion: '2 horas',

        descripcion:
          'Recorrido relacionado con historias, relatos y leyendas tradicionales de Huasca. Está pensado para conocer una parte diferente de la cultura local mientras se recorren distintos puntos del pueblo.',

        precio: 160,

        emoji: '🌙',

        imagen: require(
          '../../assets/actividades/huasca_leyendas.jpg'
        ),
      },

      {
        nombre:
          'Paseo fotográfico por Huasca',

        tipo: 'Recorrido',

        duracion: '2 horas',

        descripcion:
          'Paseo por diferentes calles, paisajes y puntos representativos de Huasca con tiempo para tomar fotografías. Es una actividad tranquila para quienes quieren llevar recuerdos visuales de su visita.',

        precio: 140,

        emoji: '📸',

        imagen: require(
          '../../assets/actividades/huasca_fotografico.jpg'
        ),
      },
    ],

    restaurantes: [
      {
        nombre:
          'Sabores de Huasca',

        tipo:
          'Comida tradicional mexicana',

        descripcion:
          'Restaurante de ambiente familiar enfocado en platillos tradicionales mexicanos y sabores típicos de la región.',

        menu:
          'Enchiladas, quesadillas, carnes, sopas, antojitos mexicanos, guarniciones, aguas frescas y bebidas calientes.',

        precioPromedio: 180,

        calificacion: 4.8,

        emoji: '🌮',
      },

      {
        nombre:
          'Café del Bosque',

        tipo: 'Cafetería',

        descripcion:
          'Cafetería de ambiente tranquilo pensada para desayunar, tomar una bebida caliente o descansar después de recorrer la zona.',

        menu:
          'Café, chocolate caliente, té, pan dulce, pasteles, sándwiches, desayunos ligeros y postres.',

        precioPromedio: 120,

        calificacion: 4.9,

        emoji: '☕',
      },

      {
        nombre:
          'Antojitos de Huasca',

        tipo: 'Antojitos mexicanos',

        descripcion:
          'Opción casual para probar diferentes antojitos mexicanos durante el recorrido por Huasca.',

        menu:
          'Quesadillas, tacos, gorditas, sopes, tlacoyos, pambazos, aguas frescas y refrescos.',

        precioPromedio: 100,

        calificacion: 4.7,

        emoji: '🌯',
      },

      {
        nombre:
          'Dulce Huasca',

        tipo: 'Postres',

        descripcion:
          'Espacio dedicado a postres, bebidas y opciones dulces para disfrutar durante la tarde.',

        menu:
          'Pasteles, pan dulce, crepas, waffles, chocolate caliente, café, malteadas y postres de temporada.',

        precioPromedio: 90,

        calificacion: 4.7,

        emoji: '🍰',
      },

      {
        nombre:
          'Cocina del Pueblo',

        tipo: 'Comida mexicana',

        descripcion:
          'Restaurante con opciones de comida mexicana casera y platillos completos para desayuno o comida.',

        menu:
          'Huevos al gusto, chilaquiles, enchiladas, sopas, carnes, pollo, arroz, frijoles y bebidas tradicionales.',

        precioPromedio: 160,

        calificacion: 4.6,

        emoji: '🍲',
      },
    ],

    lugares: [
      'Prismas Basálticos',
      'Centro de Huasca',
      'Bosques de Huasca',
      'Haciendas de Huasca',
      'Miradores de Huasca',
    ],
  },

  // ==================================================
  // REAL DEL MONTE
  // ==================================================

  {
    id: 'real-del-monte',

    nombre: 'Real del Monte',

    emoji: '⛏️',

    resumen:
      'Real del Monte es un Pueblo Mágico conocido por su historia minera, sus calles tradicionales y su arquitectura característica. Es una zona ideal para conocer más sobre la historia de Hidalgo, visitar espacios relacionados con la minería, recorrer el centro y disfrutar de su gastronomía, especialmente los tradicionales pastes. También ofrece cafeterías, restaurantes, hospedajes de estilo tradicional y diferentes recorridos culturales que permiten conocer mejor la identidad de la región. Es un destino recomendado para quienes disfrutan de los recorridos históricos, los pueblos con mucha tradición y los espacios donde se combina cultura, gastronomía y paisajes de montaña.',

    hospedaje: {
      nombre: 'Posada Real',
      precio: 980,
    },

    actividades: [
      {
        nombre:
          'Recorrido Minero',

        tipo: 'Historia',

        duracion: '2 horas',

        descripcion:
          'Experiencia relacionada con la tradición minera de Real del Monte. Durante el recorrido se conocen aspectos de la historia de la minería y la importancia que tuvo esta actividad para el desarrollo de la región.',

        precio: 220,

        emoji: '⛏️',

        imagen: require(
          '../../assets/actividades/real_minero.jpg'
        ),
      },

      {
        nombre:
          'Recorrido histórico por el centro',

        tipo: 'Cultura',

        duracion: '2 horas',

        descripcion:
          'Paseo por las calles principales y edificios tradicionales de Real del Monte para conocer su arquitectura, plazas y parte de la historia del Pueblo Mágico.',

        precio: 150,

        emoji: '🏛️',

        imagen: require(
          '../../assets/actividades/real_centro.jpg'
        ),
      },

      {
        nombre:
          'Caminata turística por Real del Monte',

        tipo: 'Recorrido',

        duracion: '2 horas',

        descripcion:
          'Caminata tranquila por diferentes puntos del pueblo para observar sus calles, comercios, paisajes y arquitectura tradicional.',

        precio: 130,

        emoji: '🚶',

        imagen: require(
          '../../assets/actividades/real_caminata.jpg'
        ),
      },

      {
        nombre:
          'Ruta cultural de Real del Monte',

        tipo: 'Cultura',

        duracion: '3 horas',

        descripcion:
          'Ruta enfocada en conocer elementos culturales e históricos de Real del Monte, incluyendo sitios representativos y aspectos de sus tradiciones.',

        precio: 190,

        emoji: '🎭',

        imagen: require(
          '../../assets/actividades/real_cultural.jpg'
        ),
      },

      {
        nombre:
          'Ruta gastronómica del paste',

        tipo: 'Gastronomía',

        duracion: '2 horas',

        descripcion:
          'Actividad enfocada en conocer uno de los alimentos más representativos de Real del Monte. Incluye un recorrido por establecimientos y explicación general de la tradición del paste.',

        precio: 170,

        emoji: '🥟',

        imagen: require(
          '../../assets/actividades/real_paste.jpg'
        ),
      },
    ],

    restaurantes: [
      {
        nombre:
          'El Rincón del Paste',

        tipo: 'Pastes',

        descripcion:
          'Establecimiento especializado en pastes tradicionales y diferentes variedades de relleno.',

        menu:
          'Pastes de papa con carne, mole, frijol, pollo, salchicha, opciones dulces y bebidas calientes.',

        precioPromedio: 110,

        calificacion: 4.8,

        emoji: '🥟',
      },

      {
        nombre:
          'Cocina Minera',

        tipo:
          'Comida tradicional',

        descripcion:
          'Restaurante inspirado en la tradición gastronómica de la región con platillos mexicanos completos.',

        menu:
          'Sopas, enchiladas, carnes, pollo, guisados mexicanos, arroz, frijoles y bebidas tradicionales.',

        precioPromedio: 170,

        calificacion: 4.7,

        emoji: '🍲',
      },

      {
        nombre:
          'Café Real',

        tipo: 'Cafetería',

        descripcion:
          'Cafetería de ambiente tranquilo ubicada en la zona turística de Real del Monte.',

        menu:
          'Café, chocolate caliente, té, pan dulce, pasteles, sándwiches, desayunos y bebidas frías.',

        precioPromedio: 115,

        calificacion: 4.8,

        emoji: '☕',
      },

      {
        nombre:
          'Antojitos del Real',

        tipo: 'Antojitos',

        descripcion:
          'Lugar casual para disfrutar comida mexicana rápida y diferentes antojitos durante el recorrido por el pueblo.',

        menu:
          'Tacos, quesadillas, sopes, gorditas, tlacoyos, pambazos, aguas frescas y refrescos.',

        precioPromedio: 100,

        calificacion: 4.6,

        emoji: '🌮',
      },

      {
        nombre:
          'Dulces del Real',

        tipo: 'Postres',

        descripcion:
          'Espacio para disfrutar postres, pan y bebidas después de recorrer Real del Monte.',

        menu:
          'Pasteles, panes, crepas, postres individuales, café, chocolate caliente, té y malteadas.',

        precioPromedio: 85,

        calificacion: 4.7,

        emoji: '🍰',
      },
    ],

    lugares: [
      'Centro Histórico',
      'Panteón Inglés',
      'Zona Minera',
      'Plaza Principal',
      'Miradores de Real del Monte',
    ],
  },

  // ==================================================
  // MINERAL DEL CHICO
  // ==================================================

  {
    id: 'mineral-del-chico',

    nombre:
      'Mineral del Chico',

    emoji: '⛰️',

    resumen:
      'Mineral del Chico es un destino rodeado de montañas, bosques y paisajes naturales. Es una excelente opción para quienes buscan aventura, senderismo, caminatas y contacto con la naturaleza. La zona cuenta con miradores, áreas boscosas y espacios ideales para descansar o realizar actividades al aire libre. Además, puedes encontrar cabañas, restaurantes de comida tradicional, cafeterías y diferentes experiencias para disfrutar de un viaje tranquilo o lleno de actividades. Es una zona recomendada para viajeros que buscan alejarse un poco del ambiente urbano, disfrutar del clima de montaña y conocer diferentes paisajes naturales de Hidalgo.',

    hospedaje: {
      nombre:
        'Cabaña del Mineral',
      precio: 1500,
    },

    actividades: [
      {
        nombre:
          'Senderismo Mineral del Chico',

        tipo: 'Aventura',

        duracion: '3 horas',

        descripcion:
          'Recorrido por senderos naturales de Mineral del Chico para disfrutar del bosque, las montañas y diferentes paisajes. Recomendado para quienes disfrutan caminar y estar en contacto con la naturaleza.',

        precio: 250,

        emoji: '🥾',

        imagen: require(
          '../../assets/actividades/chico_senderismo.jpg'
        ),
      },

      {
        nombre:
          'Ruta de miradores',

        tipo: 'Naturaleza',

        duracion: '2 horas',

        descripcion:
          'Recorrido por distintos puntos panorámicos de la zona para observar las montañas, bosques y paisajes característicos de Mineral del Chico.',

        precio: 180,

        emoji: '🌄',

        imagen: require(
          '../../assets/actividades/chico_miradores.jpg'
        ),
      },

      {
        nombre:
          'Caminata por el bosque del Chico',

        tipo: 'Ecoturismo',

        duracion: '3 horas',

        descripcion:
          'Caminata entre árboles y senderos naturales para disfrutar del ambiente del bosque y conocer diferentes espacios naturales de la zona.',

        precio: 210,

        emoji: '🌲',

        imagen: require(
          '../../assets/actividades/chico_bosque.jpg'
        ),
      },

      {
        nombre:
          'Experiencia de aventura',

        tipo: 'Aventura',

        duracion: '4 horas',

        descripcion:
          'Actividad enfocada en viajeros que buscan una experiencia más activa rodeados de montañas y naturaleza. Combina recorrido, paisajes y actividades al aire libre.',

        precio: 320,

        emoji: '🧗',

        imagen: require(
          '../../assets/actividades/chico_aventura.jpg'
        ),
      },

      {
        nombre:
          'Recorrido por Mineral del Chico',

        tipo: 'Recorrido',

        duracion: '2 horas',

        descripcion:
          'Paseo por el centro y diferentes espacios de Mineral del Chico para conocer el ambiente del Pueblo Mágico, sus calles y sus paisajes.',

        precio: 140,

        emoji: '🏘️',

        imagen: require(
          '../../assets/actividades/chico_recorrido.jpg'
        ),
      },
    ],

    restaurantes: [
      {
        nombre:
          'Cocina del Bosque',

        tipo:
          'Comida tradicional',

        descripcion:
          'Restaurante con ambiente de montaña y opciones de comida mexicana pensadas para disfrutar después de recorrer la zona.',

        menu:
          'Sopas, carnes, pollo, enchiladas, quesadillas, guisados mexicanos, frijoles y bebidas calientes.',

        precioPromedio: 180,

        calificacion: 4.8,

        emoji: '🍲',
      },

      {
        nombre:
          'Café de la Montaña',

        tipo: 'Cafetería',

        descripcion:
          'Cafetería de ambiente tranquilo para descansar y disfrutar bebidas calientes en un entorno de montaña.',

        menu:
          'Café, chocolate caliente, té, pan dulce, pasteles, sándwiches, desayunos y bebidas frías.',

        precioPromedio: 120,

        calificacion: 4.7,

        emoji: '☕',
      },

      {
        nombre:
          'Antojitos del Chico',

        tipo: 'Antojitos',

        descripcion:
          'Opción casual para disfrutar diferentes platillos mexicanos después de recorrer Mineral del Chico.',

        menu:
          'Quesadillas, tacos, sopes, gorditas, tlacoyos, enchiladas, aguas frescas y refrescos.',

        precioPromedio: 110,

        calificacion: 4.6,

        emoji: '🌯',
      },

      {
        nombre:
          'Parrilla del Bosque',

        tipo: 'Parrilla',

        descripcion:
          'Restaurante enfocado en carnes, alimentos a la parrilla y platillos completos para grupos y familias.',

        menu:
          'Cortes de carne, pollo, hamburguesas, chorizo, papas, ensaladas, quesadillas y bebidas.',

        precioPromedio: 230,

        calificacion: 4.8,

        emoji: '🍖',
      },

      {
        nombre:
          'Postres de la Montaña',

        tipo: 'Postres',

        descripcion:
          'Espacio para disfrutar opciones dulces, bebidas y postres durante una tarde en Mineral del Chico.',

        menu:
          'Pasteles, crepas, waffles, pan dulce, café, chocolate, malteadas y postres individuales.',

        precioPromedio: 95,

        calificacion: 4.7,

        emoji: '🍰',
      },
    ],

    lugares: [
      'Parque Nacional El Chico',
      'Centro de Mineral del Chico',
      'Miradores del Chico',
      'Bosques de Mineral del Chico',
      'Zona de Montaña',
    ],
  },
];