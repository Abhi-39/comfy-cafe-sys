-- Allow customers to insert their own orders
CREATE POLICY "Customers can create orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow customers to insert order items for their orders
CREATE POLICY "Customers can create order items"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.created_by = auth.uid()
  )
);