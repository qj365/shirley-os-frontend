'use client';

import {
  api,
  CursorPagingResponse_GetCookingClassesResponse_Array_,
} from '@/src/lib/api/customer';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import CookingClassListItem from './CookingClassListItem';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export default function CookingClassList({
  initData,
}: {
  initData: CursorPagingResponse_GetCookingClassesResponse_Array_;
}) {
  const [items, setItems] = useState(initData?.data || []);
  const [nextCursor, setNextCursor] = useState(initData?.nextCursor);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);

    try {
      const resp = await api.cookingClass.customerGetCookingClasses({
        cursor: nextCursor,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      setItems(prev => [...prev, ...resp?.data]);
      setNextCursor(resp?.nextCursor);
    } catch (error) {
      console.error('Error loading more cooking classes:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setItems(initData?.data || []);
    setNextCursor(initData?.nextCursor);
  }, [initData]);

  return (
    <div className="container grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-7">
      {items.map(cookingClass => (
        <CookingClassListItem
          key={cookingClass.id}
          description={cookingClass?.description}
          imageSrc={cookingClass?.image}
          price={cookingClass?.price || 0}
          slug={cookingClass?.slug}
          title={cookingClass?.name}
        />
      ))}

      {nextCursor && (
        <div className="col-span-full mt-8 flex justify-center">
          <Button
            className="btn-gradient--yellow mx-auto flex items-center justify-center gap-2 rounded-full px-6 py-2 text-base font-semibold hover:opacity-70"
            onClick={loadMore}
            disabled={loading}
          >
            {loading && <Spinner />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
