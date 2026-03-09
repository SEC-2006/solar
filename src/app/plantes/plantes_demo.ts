import { Planta } from "./planta";

export const PLANTES_DEMO: Planta[] = [
    {
        id: 1,
        created_at: Date.now(),
        nom: 'Planta Solar A',
        ubicacio: { latitude: 41.3851, longitude: 2.1734 },
        capacitat: 500,
        user: 'user1',
        foto: 'placa1.jpg'
    },
    {
        id: 2,
        created_at: Date.now(),
        nom: 'Planta Solar B',
        ubicacio: { latitude: 40.4168, longitude: -3.7038 },
        capacitat: 750,
        user: 'user2',
        foto: 'placa2.jpeg'
    },
    {
        id: 3,
        created_at: Date.now(),
        nom: 'Planta Solar C',
        ubicacio: { latitude: 39.4699, longitude: -0.3763 },
        capacitat: 600,
        user: 'user3',
        foto: 'placa3.jpeg'
    }
];