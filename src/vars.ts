export const statuses = [
  "created",
  "processing",
  "ready",
  "completed",
] as const;

export const triggers: Record<(typeof statuses)[number], (string | RegExp)[]> =
  {
    created: ["/n", "Новый", "новый", /Новый.*/, /новый.*/],
    processing: ["/r", "В работе", "в работе", /В работе.*/, /в работе.*/],
    ready: ["/g", "Готов", "Готов", /Готов.*/, /готов.*/],
    completed: ["/v", "Выдан", "выдан", /Выдан.*/, /выдан.*/],
  };

export const plurals: Record<(typeof statuses)[number], string> = {
  created: "Новые",
  processing: "В работе",
  ready: "Готовые",
  completed: "Выданы",
};

export const emojis: Record<(typeof statuses)[number], string> = {
  created: "🆕",
  processing: "🛠",
  ready: "✅",
  completed: "🕐",
};
