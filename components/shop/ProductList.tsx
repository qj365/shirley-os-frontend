'use client';

import {
  api,
  CursorPagingResponse_GetProductsByCategoryResponse_Array_,
} from '@/src/lib/api/customer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import ProductListItem from './ProductLisItem';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export default function ProductItems({
  categoryName,
  initData,
}: {
  categoryName: string;
  initData: CursorPagingResponse_GetProductsByCategoryResponse_Array_;
}) {
  const [items, setItems] = useState(initData?.data);
  const [nextCursor, setNextCursor] = useState(initData?.nextCursor);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);

    const resp = await api.product.getProductsByCategory({
      categoryId: Number(categoryId),
      cursor: nextCursor,
      pageSize: DEFAULT_PAGE_SIZE,
    });

    setItems(prev => [...prev, ...resp?.data]);
    setNextCursor(resp?.nextCursor);
    setLoading(false);
  }

  useEffect(() => {
    setItems(initData?.data);
    setNextCursor(initData?.nextCursor);
  }, [initData]);

  return (
    <section className="mx-auto flex w-full flex-col gap-10">
      <h2 className="text-lg font-bold md:text-[25px]">{categoryName}</h2>

      <div className="flex flex-col gap-9">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map(product => (
            <div key={product.id}>
              <ProductListItem product={product} />
            </div>
          ))}
        </div>
      </div>
      {nextCursor && (
        <Button
          className="btn-gradient--yellow mx-auto flex items-center justify-center gap-2 rounded-full px-6 py-2 text-base font-semibold hover:opacity-70"
          onClick={loadMore}
          disabled={loading}
        >
          {loading && <Spinner />}
          Load more
        </Button>
      )}
    </section>
  );
}
