import { useEffect, useState } from "react";

export const useUniqueId = (photoUri: string) => {
  const [uniqueId, setUniqueId] = useState<number>(0);

  useEffect(() => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 9000) + 1000;
    const userId = parseInt(`${timestamp}${random}`, 10);
    setUniqueId((prevId) => prevId + userId);
  }, [photoUri]);

  return { uniqueId };
};
