import { useState, useEffect, useCallback } from 'react';
import { CompletedPuzzleItem } from '../../../core/types/collection.types';
import { asyncStorageService } from '../../../services/storage/asyncStorageService';

export function useCollection() {
  const [collection, setCollection] = useState<CompletedPuzzleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollection = useCallback(async () => {
    setIsLoading(true);
    const items = await asyncStorageService.getCollection();
    setCollection(items);
    setIsLoading(false);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await asyncStorageService.removeFromCollection(id);
    setCollection((prev) => prev.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  return {
    collection,
    isLoading,
    refreshCollection: loadCollection,
    deleteItem,
  };
}

