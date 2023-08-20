// Use this function to get enum value. Use for dto
export const getValEnumNumber = (enumData: Record<string, any>) => {
  return Object.values(enumData).filter((v) => Number.isFinite(v));
};

// Use this function to get enum value. Use for dto
export const getValEnumStr = <T>(enumData: Record<string, T>) => {
  return Object.values(enumData).filter((v) => !Number.isFinite(v));
};
