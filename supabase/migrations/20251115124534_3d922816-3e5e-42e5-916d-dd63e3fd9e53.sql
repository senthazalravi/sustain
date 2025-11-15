-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for listing photos
CREATE POLICY "Users can upload their own listing photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view listing photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-photos');

CREATE POLICY "Users can update their own listing photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own listing photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);