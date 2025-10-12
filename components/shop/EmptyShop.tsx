import React from 'react';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ShoppingBag } from 'lucide-react';

export default async function EmptyShop() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBag />
        </EmptyMedia>
        <EmptyTitle>No Product Found</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
