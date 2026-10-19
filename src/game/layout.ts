export const MAP_LAYOUT_STORAGE_KEY = 'abelhas-nativas-map-layout-v2';

export const MAP_ELEMENT_LABELS = {
  fence: 'Cercado',
  house: 'Casa',
  shop: 'Lojinha',
  saf: 'Sistema agroflorestal',
  'hive-front-small': 'Caixa frente · 1 módulo',
  'hive-front-medium': 'Caixa frente · 2 módulos',
  'hive-front-large': 'Caixa frente · 3 módulos',
  'hive-left-small': 'Caixa esquerda · 1 módulo',
  'hive-left-medium': 'Caixa esquerda · 2 módulos',
  'hive-left-large': 'Caixa esquerda · 3 módulos',
  'hive-right-small': 'Caixa direita · 1 módulo',
  'hive-right-medium': 'Caixa direita · 2 módulos',
  'hive-right-large': 'Caixa direita · 3 módulos',
} as const;

export type MapElementType = keyof typeof MAP_ELEMENT_LABELS;

export type MapElementInstance = {
  id: string;
  type: MapElementType;
  x: number;
  y: number;
  size: number;
  layer: number;
};

export type CollectionPoint = { id: string; x: number; y: number };

export type MapLayout = {
  elements: MapElementInstance[];
  collectionPoints: CollectionPoint[];
};

export function cloneMapLayout(layout: MapLayout): MapLayout {
  return {
    elements: layout.elements.map((element) => ({ ...element })),
    collectionPoints: layout.collectionPoints.map((point) => ({ ...point })),
  };
}

export function loadMapLayout(): MapLayout {
  try {
    const saved = JSON.parse(localStorage.getItem(MAP_LAYOUT_STORAGE_KEY) ?? '{}') as Partial<MapLayout>;
    if (!Array.isArray(saved.elements)) return { elements: [], collectionPoints: [] };
    const elements = saved.elements.filter((element): element is MapElementInstance => (
        typeof element?.id === 'string'
        && element.type in MAP_ELEMENT_LABELS
        && Number.isFinite(element.x)
        && Number.isFinite(element.y)
        && Number.isFinite(element.size)
      ));
    elements.sort((a, b) => (Number.isFinite(a.layer) ? a.layer : 0) - (Number.isFinite(b.layer) ? b.layer : 0));
    const collectionPoints = Array.isArray(saved.collectionPoints)
      ? saved.collectionPoints.filter((point): point is CollectionPoint => (
        typeof point?.id === 'string' && Number.isFinite(point.x) && Number.isFinite(point.y)
      ))
      : [];
    return {
      elements: elements.map((element, layer) => ({ ...element, layer })),
      collectionPoints,
    };
  } catch {
    return { elements: [], collectionPoints: [] };
  }
}

export function saveMapLayout(layout: MapLayout): void {
  localStorage.setItem(MAP_LAYOUT_STORAGE_KEY, JSON.stringify(layout, null, 2));
}
