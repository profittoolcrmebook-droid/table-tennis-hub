DROP POLICY "Imágenes de productos públicas" ON storage.objects;
CREATE POLICY "Lectura imágenes producto por path"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] IS NOT NULL);