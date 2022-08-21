CREATE POLICY "Enable write challenge files bucket for authenticated users"
    ON storage.objects
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (storage.objects.bucket_id = 'challenge_files');


CREATE POLICY "Enable read challenge files bucket for authenticated users"
    ON storage.objects
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (storage.objects.bucket_id = 'challenge_files');